import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import * as Moment from "moment";
import * as GlobalFunctionForUpdateItem from '../GlobalFunctionForUpdateItems';
import {
    Panel,
    PanelType,
} from "office-ui-fabric-react";
import Tooltip from '../Tooltip';
import { MdCompare } from 'react-icons/Md';
import { BsArrowRightSquare } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import ServiceComponentPortfolioPopup from '../EditTaskPopup/ServiceComponentPortfolioPopup';
import * as GlobalCommon from '../globalCommon';
import FlorarImageUploadComponent from "../FlorarComponents/FlorarImageUploadComponent";
import { Web, sp } from 'sp-pnp-js';
import PageLoader from '../pageLoader';

let AllTypeCategory: any = [];
let GlobalAllCSFData: any = [];
let GlobalAllProjectData: any = [];
let GlobalFeedbackJSON: any = [];
let GlobalCurrentUserData: any;
const CreateTaskCompareTool = (RequiredData: any) => {
    const { ItemDetails, RequiredListIds, CallbackFunction, CreateTaskForThisPoint, Context } = RequiredData || {};
    const [isOpenTypeCategoryPopup, setIsOpenTypeCategoryPopup] = useState(false);
    const [isTeamPortfolioPopup, setIsTeamPortfolioPopup] = useState(false);
    const [isProjectManagementPopup, setIsProjectManagementPopup] = useState(false);
    const [SearchedProjectData, setSearchedProjectData] = useState([]);
    const [SearchedPortfolioData, setSearchedPortfolioData] = useState([]);
    const [UploadBtnStatus, setUploadBtnStatus] = useState(false);
    const [LoaderStatus, setLoaderStatus] = useState(false);
    const [TypeCategoryData, setTypeCategoryData] = useState([]);
    const [CreateTaskInfo, setCreateTaskInfo] = useState<any>({
        Title: "",
        Project: {},
        Priority: "",
        DueDate: '',
        Relevant_Url: "",
        UploadedImage: [],
        FeedBackJSON: []

    })
    useEffect(() => {
        GetAllComponentAndServiceData();
        GetSmartMetaDataList();
        let param: any = Moment(new Date().toLocaleString());
        GlobalFunctionForUpdateItem.GetCurrentUserData({ ListId: RequiredListIds?.TaskUsertListID, ListSiteURL: RequiredListIds?.siteUrl, Context: Context }).then((ResData: any) => {
            let CurrentUserData: any = ResData?.CurrentUser;
            GlobalCurrentUserData = ResData?.CurrentUser;
            let CommentTitle: any = `This is in reference to the task: ${ItemDetails?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + ItemDetails?.Id + "&Site=" + ItemDetails?.siteType}`;
            let CreateTaskFor: any = {
                AuthorImage: CurrentUserData.ItemCover != undefined ? CurrentUserData.ItemCover : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                AuthorName: CurrentUserData.Title != undefined ? CurrentUserData.Title : Context.pageContext._user.displayName,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: CommentTitle,
                NewestCreated: "" + param,
                editableItem: false,
                isApprovalComment: false,
                isShowLight: ""
            }
            let CreateTaskPointDataObject: any = {
                Title: CreateTaskForThisPoint.Title,
                Completed: "",
                text: "",
                SeeAbove: '',
                Phone: '',
                LowImportance: '',
                Comments: [CreateTaskFor]
            }
            let FeedBackItem: any = {
                Title: "FeedBackPicture" + param,
                FeedBackDescriptions: [CreateTaskPointDataObject],
                ImageDate: "" + param,
                Completed: ''
            };
            setCreateTaskInfo({ ...CreateTaskInfo, FeedBackJSON: [FeedBackItem] })
            // GlobalFeedbackJSON = [FeedBackItem];
        }).catch((error) => {
            console.log("Error in UseEffect Section Function", error.message)
        });

    }, [])


    // ################# this is for getting all the CSF and projects with groupBy and flatView data #######################

    const GetAllComponentAndServiceData = async () => {
        let PropsObject: any = {
            MasterTaskListID: RequiredListIds?.MasterTaskListID,
            siteUrl: ItemDetails?.siteUrl,
            ComponentType: "Component",
            TaskUserListId: RequiredListIds.TaskUsertListID,
        };
        let CallBackData = await GlobalCommon.GetServiceAndComponentAllData(
            PropsObject
        );
        if (CallBackData?.AllData != undefined && CallBackData?.AllData?.length > 0) {
            GlobalAllCSFData = CallBackData.AllData;
            GlobalAllProjectData = CallBackData?.FlatProjectData;
        }
    };

    const GetSmartMetaDataList = async () => {
        let SmartMetaDataCategoriesData: any = [];
        let RequiredData: any = {
            ListId: RequiredListIds?.SmartMetadataListID, ListSiteURL: ItemDetails.siteUrl, TaxType: ["Categories"]
        }
        GlobalFunctionForUpdateItem.GetSmartMetaDataListAllItems(RequiredData).then((data: any) => {
            let AllTypeCategoryData: any = [];
            data?.map((CategoryType: any) => {
                if (CategoryType.hasOwnProperty("Categories")) {
                    SmartMetaDataCategoriesData = CategoryType.Categories;
                }
            })
            const TypeCategoryObject: any = SmartMetaDataCategoriesData?.find((item: any) => item.Title === "Type");
            SmartMetaDataCategoriesData?.map((TypeItem: any) => {
                if (TypeItem.ParentId == TypeCategoryObject?.Id) {
                    TypeItem.IsSelected = false;
                    AllTypeCategoryData.push(TypeItem)
                }
            })
            setIsOpenTypeCategoryPopup(true);
            setTypeCategoryData(AllTypeCategoryData);
            AllTypeCategory = AllTypeCategoryData;
        }).catch((error) => {
            console.error("Error In Smart Meta Data call", error);
        });

    }


    // let CreateTaskFor: any = [{
    //     AuthorImage: currentUserData.ImageUrl != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
    //     AuthorName: currentUserData.Title != undefined ? currentUserData.Title : Context.pageContext._user.displayName,
    //     Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
    //     Title: CommentTitle,
    //     NewestCreated: "" + param,
    //     editableItem: false,
    //     isApprovalComment: false,
    //     isShowLight: ""
    // }]


    const SelectTaskCategory = (SelectedCategory: any) => {
        AllTypeCategory?.map((CategoryItem: any) => {
            if (CategoryItem.Title === SelectedCategory.Title) {
                if (CategoryItem.IsSelected === true) {
                    CategoryItem.IsSelected = false;
                } else {
                    CategoryItem.IsSelected = true;
                }
            }
        })
        setTypeCategoryData([...AllTypeCategory]);
    }

    const SwipeDataFunction = (KeyName: any) => {
        if (ItemDetails.hasOwnProperty(KeyName)) {
            setCreateTaskInfo({ ...CreateTaskInfo, [KeyName]: ItemDetails[KeyName] })
        }
    }

    const swipeImageFunction = (ImageData: any, Index: any) => {
        let ImageJSON: any = { ...CreateTaskInfo }
        ImageData.ImageIndex = Index;
        ImageJSON?.UploadedImage?.push(ImageData);
        let uniqueImageNames: any = {};
        const result: any = ImageJSON?.UploadedImage.filter((item: any) => {
            if (!uniqueImageNames[item.ImageName]) {
                uniqueImageNames[item.ImageName] = true;
                return true;
            }
            return false;
        });
        setCreateTaskInfo({ ...CreateTaskInfo, UploadedImage: result })
    }

    const DeleteUploadedImage = (ImageName: any) => {
        let ImageJSON: any = { ...CreateTaskInfo }
        const result: any = removeObjectByTitle(ImageJSON?.UploadedImage, ImageName)
        setCreateTaskInfo({ ...CreateTaskInfo, UploadedImage: result })
    }

    function removeObjectByTitle(DataArray: any, ImageName: any) {
        return DataArray?.filter((ImgItem: any) => ImgItem.ImageName !== ImageName);
    }


    //    this is used for auto suggetions for Portfolio and Project 


    const AutoSuggestionsCommonFunction = (usedFor: String, SearchedKeyWord: any) => {
        // GlobalAllCSFData
        // GlobalAllProjectData
        let SearchDataTempArray: any = [];
        let ResultantArray: any = [];
        if (usedFor == "Project") {
            ResultantArray = GlobalAllProjectData
        }
        if (usedFor == "Portfolio") {
            ResultantArray = GlobalAllCSFData
        }
        if (SearchedKeyWord.length > 0) {
            ResultantArray?.map((ItemData: any) => {
                if (ItemData.Path?.toLowerCase()?.includes(SearchedKeyWord.toLowerCase())) {
                    SearchDataTempArray.push(ItemData);
                }
            })
            if (usedFor == "Project") {
                setSearchedProjectData(SearchDataTempArray)
            }
            if (usedFor == "Portfolio") {
                setSearchedPortfolioData(SearchDataTempArray)
            }
        } else {
            setSearchedPortfolioData([])
            setSearchedProjectData([])
        }

    }

    const SwipePortfolioAndProject = (usedFor: string, TagItem: any) => {
        TagItem.listId = RequiredListIds?.MasterTaskListID;
        TagItem.siteUrl = ItemDetails?.siteUrl;
        TagProjectAndPortfolio(usedFor, TagItem)
    }

    const TagProjectAndPortfolio = async (usedFor: string, TagItem: any) => {
        if (usedFor == "Portfolio") {
            let ResponseData: any = await GlobalFunctionForUpdateItem.onPortfolioTaggingAllChanges({ ItemDetails: TagItem, RequiredListIds: RequiredListIds, TaskDetails: ItemDetails });
            ResponseData.Portfolio = TagItem;
            setCreateTaskInfo({ ...CreateTaskInfo, ...ResponseData })
            setSearchedPortfolioData([]);
        }
        if (usedFor == "Project") {
            setCreateTaskInfo({ ...CreateTaskInfo, Project: TagItem })
            setSearchedProjectData([]);
        }
    }



    const ComponentServicePopupCallBack = async (SelectedItem: any, Type: any, functionType: any) => {
        if (functionType !== "Close") {
            if (SelectedItem?.length > 0) {
                let SelectedItemObject: any = SelectedItem[0];
                if (SelectedItemObject.Item_x0020_Type !== "Project") {
                    let ResponseData: any = await GlobalFunctionForUpdateItem.onPortfolioTaggingAllChanges({ ItemDetails: SelectedItemObject, RequiredListIds: RequiredListIds, TaskDetails: ItemDetails });
                    ResponseData.Portfolio = SelectedItemObject;
                    setCreateTaskInfo({ ...CreateTaskInfo, ...ResponseData })
                } else {
                    setCreateTaskInfo({ ...CreateTaskInfo, Project: SelectedItemObject })
                }
            }
            setIsProjectManagementPopup(false);
            setIsTeamPortfolioPopup(false);
        } else {
            setIsProjectManagementPopup(false);
            setIsTeamPortfolioPopup(false);
        }
    }


    const CreateTaskFunction = async () => {
        try {
            let SelectedCategories: any = [];
            let CategoriesTitle: string = "";
            let Priority: string;
            if (CreateTaskInfo.PriorityRank) {
                let rank = CreateTaskInfo.PriorityRank;
                if (rank <= 10 && rank >= 8) {
                    Priority = "(1) High";
                }
                if (rank <= 7 && rank >= 4) {
                    Priority = "(2) Normal";
                }
                if (rank <= 3 && rank >= 0) {
                    Priority = "(3) Low";
                }
            }
            TypeCategoryData?.forEach((CategoryItem: any) => {
                if (CategoryItem.IsSelected) {
                    SelectedCategories.push(CategoryItem);
                    CategoriesTitle = CategoriesTitle ? `${CategoriesTitle};${CategoryItem.Title}` : CategoryItem.Title;
                }
            });

            if (SelectedCategories.length > 0 && CreateTaskInfo.Title?.length > 0) {
                let UpdateJSONData: any = {
                    Title: CreateTaskInfo.Title,
                    DueDate: CreateTaskInfo.DueDate ? Moment(CreateTaskInfo.DueDate).format("MM-DD-YYYY") : null,
                    // TeamMembersId: CreateTaskInfo?.TeamMembersId,
                    ResponsibleTeamId: CreateTaskInfo?.ResponsibleTeamId,
                    FeedBack: JSON.stringify(CreateTaskInfo?.FeedBackJSON),
                    ComponentLink: {
                        __metadata: { type: "SP.FieldUrlValue" },
                        Description: CreateTaskInfo.Relevant_Url || "",
                        Url: CreateTaskInfo.Relevant_Url || "",
                    },
                    ProjectId: CreateTaskInfo?.Project?.Id || null,
                    TaskCategoriesId: { results: GlobalFunctionForUpdateItem.getDataByKey(SelectedCategories, "Id") },
                    Categories: CategoriesTitle,
                    PortfolioId: CreateTaskInfo?.Portfolio?.Id || null,
                    Sitestagging: CreateTaskInfo?.Sitestagging,
                    SiteCompositionSettings: CreateTaskInfo?.SiteCompositionSettings,
                    ClientCategoryId: CreateTaskInfo?.ClientCategoryId,
                    PriorityRank: CreateTaskInfo?.PriorityRank,
                    Priority: Priority,
                };
                let web = new Web(ItemDetails?.siteUrl);
                await web.lists.getById(ItemDetails?.listId).items.add(UpdateJSONData).then(async (resData: any) => {
                    console.log("Task Created Successfully");
                    let BasicImageInfoArray: any = [];
                    let UpdatedData: any = resData?.data;
                    let ImageUploadCount: any = 0;
                    if (CreateTaskInfo?.UploadedImage?.length > 0) {
                        setLoaderStatus(true);
                        for (let ImageIndex = 0; ImageIndex < CreateTaskInfo?.UploadedImage?.length;) {
                            const ImageItem = CreateTaskInfo?.UploadedImage[ImageIndex];
                            let date = new Date();
                            let timeStamp = date.getTime();
                            let UpdateIndex: any = ImageIndex + 1;
                            let fileName: string = "T" + UpdatedData.Id + "-Image" + UpdateIndex + "-" + UpdatedData.Title?.replace(/["/':?%]/g, "")?.slice(0, 40) + " " + timeStamp + ".jpg";
                            let PrepareImageObject = {
                                ImageName: fileName,
                                UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                                ImageUrl: ItemDetails?.siteUrl + "/Lists/" + ItemDetails?.siteType + "/Attachments/" + UpdatedData?.Id + "/" + fileName,
                                UserImage: GlobalCurrentUserData.ItemCover ? GlobalCurrentUserData.ItemCover : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                                UserName: GlobalCurrentUserData?.Title ? GlobalCurrentUserData?.Title : "",
                                Description: ImageItem.Description != undefined ? ImageItem.Description : "",
                            };

                            if (ImageItem?.data_url != undefined) {
                                await UploadImageFunction(UpdatedData, ImageItem, fileName);
                                BasicImageInfoArray.push(PrepareImageObject);
                                ImageUploadCount++;
                                ImageIndex++;
                            } else {
                                await CopyAttachedImageFunction(UpdatedData, ImageItem?.ImageIndex, fileName);
                                BasicImageInfoArray.push(PrepareImageObject);
                                ImageUploadCount++;
                                ImageIndex++;
                            }
                        }

                        if (ImageUploadCount == CreateTaskInfo?.UploadedImage?.length) {
                            let web = new Web(ItemDetails?.siteUrl);
                            await web.lists
                                .getById(ItemDetails?.listId)
                                .items.getById(UpdatedData?.Id)
                                .update({ BasicImageInfo: BasicImageInfoArray?.length > 0 ? JSON.stringify(BasicImageInfoArray) : null }).then(() => {
                                    setLoaderStatus(false);
                                    console.log("Image JSON Updated !!");
                                    CloseTypeCategoryPopup("Save", resData?.data);
                                });
                        }
                    } else {
                        CloseTypeCategoryPopup("Save", resData?.data);
                    }
                });
            } else {
                if (SelectedCategories.length === 0 && !CreateTaskInfo.Title?.length) {
                    alert("Please enter a task title and select a task category before proceeding.");
                } else if (SelectedCategories.length === 0) {
                    alert("Please select a task category before proceeding.");
                } else if (!CreateTaskInfo.Title?.length) {
                    alert("Please enter a task title before proceeding.");
                }
            }
        } catch (error) {
            console.error("Error in CreateTaskFunction:", error.message);
            throw error;
        }
    };


    //***************** This is for Image Upload Section  Functions *****************

    const FlorarImageUploadComponentCallBack = (dt: any) => {
        setUploadBtnStatus(false);
        let ImageTempObject: any = {
            ImageName: ItemDetails.Title + (CreateTaskInfo.UploadedImage?.length + 1),
            ImageUrl: dt,
            data_url: dt,
            UserImage: GlobalCurrentUserData?.ImageUrl != undefined ? GlobalCurrentUserData?.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
            UserName: GlobalCurrentUserData?.Title != undefined ? GlobalCurrentUserData?.Title : Context.pageContext._user.displayName,
            UploadeDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        }
        swipeImageFunction(ImageTempObject, 0);
    };

    // this is used for upload Image As Attachments on backend side 

    const UploadImageFunction = (NewlyCreatedTask: any, Data: any, imageName: any): Promise<any> => {
        return new Promise<void>(async (resolve, reject) => {
            let src = Data.data_url?.split(",")[1];
            let byteArray = new Uint8Array(
                atob(src)
                    ?.split("")
                    ?.map(function (c) {
                        return c.charCodeAt(0);
                    })
            );
            if (byteArray) {
                try {
                    let web = new Web(ItemDetails.siteUrl);
                    let item = web.lists.getById(ItemDetails.listId).items.getById(NewlyCreatedTask?.Id);
                    await item.attachmentFiles.add(imageName, byteArray);
                    console.log("New Attachment added");
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });
    };

    // This is used for Copy image form old task to new task 

    const CopyAttachedImageFunction = async (NewlyCreatedTask: any, ImageIndex: any, fileName: any) => {
        let web = new Web(ItemDetails?.siteUrl);
        let Response: any = await web.lists
            .getById(ItemDetails?.listId)
            .items.getById(ItemDetails?.Id)
            .select("Id,Title,Attachments,AttachmentFiles")
            .expand("AttachmentFiles")
            .get();
        for (let index = 0; index < Response?.AttachmentFiles?.length; index++) {
            try {
                if (ImageIndex == index) {
                    const value: any = Response?.AttachmentFiles[index];
                    const sourceEndpoint = `${ItemDetails?.siteUrl}/_api/web/lists/getbytitle('${ItemDetails?.siteType}')/items(${ItemDetails?.Id})/AttachmentFiles/getByFileName('${value.FileName}')/$value`;
                    const ResponseData = await fetch(sourceEndpoint, {
                        method: "GET",
                        headers: {
                            Accept: "application/json;odata=nometadata",
                        },
                    });
                    if (ResponseData.ok) {
                        const binaryData = await ResponseData.arrayBuffer();
                        console.log("Binary Data:", binaryData);
                        var uint8Array = new Uint8Array(binaryData);
                        const item = await sp.web.lists.getById(ItemDetails?.listId).items.getById(NewlyCreatedTask?.Id).get();
                        const currentETag = item ? item['@odata.etag'] : null;
                        await sp.web.lists.getById(ItemDetails?.listId).items.getById(NewlyCreatedTask?.Id).attachmentFiles.add(fileName, uint8Array), currentETag, { headers: { "If-Match": currentETag } }
                    }
                }
            } catch (error) {
                console.log("error in copy image attachment function", error.message)
            }
        }
    }


    const CloseTypeCategoryPopup = (usedFor: string, Data: any) => {
        setIsOpenTypeCategoryPopup(false);
        CallbackFunction(usedFor, Data);
    }


    const CustomHeaderTypeCategoryPopup = () => {
        return (
            <>
                <div className="subheading alignCenter">
                    <span
                    >
                        Create Separate Task
                    </span>

                </div>
                <Tooltip ComponentId="" isServiceTask={false} />
            </>

        )
    }
    const CustomFooterTypeCategoryPopup = () => {
        return (
            <footer className='alignCenter justify-content-between'>
                <div>
                    <a
                        target="_blank"
                        className="siteColor"
                        data-interception="off"
                        href={`${ItemDetails?.siteUrl}/Lists/${ItemDetails.siteType}/EditForm.aspx?ID=${ItemDetails.Id}`}
                    >
                        Open Out-Of-The-Box Form
                    </a>
                    <div className="">
                        Created{" "}
                        <span className="font-weight-normal siteColor">
                            {" "}
                            {ItemDetails.Created
                                ? Moment(ItemDetails.Created).format("DD/MM/YYYY")
                                : ""}{" "}
                        </span>{" "}
                        By{" "}
                        <span className="font-weight-normal siteColor">
                            {ItemDetails.Author?.Title ? ItemDetails.Author?.Title : ""}
                        </span>
                    </div>
                    <div>
                        Last modified{" "}
                        <span className="font-weight-normal siteColor">
                            {" "}
                            {ItemDetails.Modified
                                ? Moment(ItemDetails.Modified).format("DD/MM/YYYY")
                                : ""}
                        </span>{" "}
                        By{" "}
                        <span className="font-weight-normal siteColor">
                            {ItemDetails.Editor?.Title ? ItemDetails.Editor.Title : ""}
                        </span>
                    </div>

                </div>
                <div>
                    <button
                        className="btn btn-primary mx-1 px-3"
                        onClick={CreateTaskFunction}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn btn-default px-3"
                        onClick={() => CloseTypeCategoryPopup("Close", [])}
                    >
                        Cancel
                    </button>
                </div>
            </footer>
        )
    }
    return (
        <div>
            <Panel
                type={PanelType.custom}
                isOpen={isOpenTypeCategoryPopup}
                onRenderHeader={CustomHeaderTypeCategoryPopup}
                isBlocking={false}
                onRenderFooterContent={CustomFooterTypeCategoryPopup}
                isFooterAtBottom={true}
                onDismiss={() => CloseTypeCategoryPopup("Close", [])}
                customWidth='50%'
            >
                <div className="modal-body">
                    {/*---- Task Type Categories ----------------------------------------*/}
                    <div className="card">
                        <div className='alignCenter card-header siteColor'>
                            <b className='siteColor'> Select Category* </b>
                            <span className="hover-text alignIcon">
                                <span className="svg__iconbox svg__icon--info dark"></span>
                                <span className="tooltip-text pop-right">
                                    To create a task, it is necessary to tag the task category. A task cannot be created without tagging it with a task category.
                                </span>
                            </span>
                        </div>
                        <div className="row card-body row-cols-1 row-cols-sm-2 row-cols-md-6 justify-content-center">
                            {TypeCategoryData?.map((item: any, Index: any) => {
                                return (
                                    <div
                                        key={Index}
                                        className={item?.IsSelected ? "col border hreflink py-1 text-center m-1 ms-0 mt-0 bg-siteColor" : "col border hreflink py-1 text-center m-1 ms-0 mt-0"}
                                        style={{ fontSize: "0.8rem" }}
                                        onClick={() => SelectTaskCategory(item)}
                                    >
                                        {item.Title}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/*---- Task Compare Section ----------------------------------------*/}
                    <div className='task-compare-section container'>
                        <div className='row'>
                            <div className='bg-f4 border d-flex mt-4 py-2 text-center'>
                                <div className='current-Task-section' style={{ width: "47%" }}><b className='siteColor'>Current Task Details</b></div>
                                <div className='Move-data-current-to-new' style={{ width: "6%" }} title='Compare Task'><MdCompare /></div>
                                <div className='new-task-section' style={{ width: "47%" }}><b className='siteColor'>Create New Task</b></div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className=' d-flex py-2 border-start border-end '>
                                <div className='current-Task-section' style={{ width: "47%" }}>Title: <span className='siteColor ms-2'>{ItemDetails?.Title}</span></div>
                                <div className='Move-data-current-to-new text-center' style={{ width: "6%" }} title='Swipe data left to right'><BsArrowRightSquare onClick={() => SwipeDataFunction("Title")} /></div>
                                <div className='new-task-section' style={{ width: "47%" }}>
                                    Title*:
                                    {CreateTaskInfo.Title ?
                                        <input
                                            type='text'
                                            className="form-control"
                                            value={CreateTaskInfo.Title}
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, Title: e.target.value })}
                                        /> :
                                        <input
                                            type='text'
                                            placeholder='Enter Task Title'
                                            className="form-control"
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, Title: e.target.value })}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className=' d-flex py-2 border-start border-end '>
                                <div className='current-Task-section' style={{ width: "47%" }}>Portfolio: <span className='siteColor ms-2'>{ItemDetails?.Portfolio?.Title}</span></div>
                                <div className='Move-data-current-to-new text-center' style={{ width: "6%" }} title='Swipe data left to right' ><BsArrowRightSquare onClick={() => SwipePortfolioAndProject("Portfolio", ItemDetails?.Portfolio)} /></div>
                                <div className='new-task-section input-group' style={{ width: "47%" }}>
                                    <label className='form-label full-width'> Portfolio:</label>
                                    {CreateTaskInfo.Portfolio?.Title ?
                                        <div className="full-width replaceInput alignCenter">
                                            <a
                                                title={CreateTaskInfo.Portfolio?.Title}
                                                target="_blank"
                                                data-interception="off"
                                                className="textDotted"
                                                href={`${ItemDetails.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${CreateTaskInfo.Portfolio?.Id}`}
                                            >
                                                {CreateTaskInfo.Portfolio?.Title}
                                            </a>
                                        </div>
                                        :
                                        <input
                                            type='text'
                                            placeholder='Search Portfolio Items'
                                            className="form-control"
                                            onChange={(e) => AutoSuggestionsCommonFunction("Portfolio", e.target.value)}
                                        />
                                    }
                                    <span
                                        className="input-group-text"
                                        onClick={() => setIsTeamPortfolioPopup(true)}
                                        title="Portfolio Items Popup"
                                    >
                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {SearchedPortfolioData?.length > 0 ? (
                                        <div className="SmartTableOnTaskPopup">
                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                {SearchedPortfolioData?.map((item: any) => {
                                                    return (
                                                        <li
                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                            key={item.id}
                                                            onClick={() =>
                                                                TagProjectAndPortfolio("Portfolio", item)
                                                            }
                                                        >
                                                            <a>{item?.Path}</a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className=' d-flex py-2 border-start border-end '>
                                <div className='current-Task-section' style={{ width: "47%" }}>Project: <span className='siteColor ms-2'>{ItemDetails?.Project?.Title}</span></div>
                                <div className='Move-data-current-to-new text-center' style={{ width: "6%" }} title='Swipe data left to right'><BsArrowRightSquare onClick={() => SwipePortfolioAndProject("Project", ItemDetails?.Project)} /></div>
                                <div className='new-task-section input-group' style={{ width: "47%" }}>
                                    <label className='form-label full-width'> Project:</label>
                                    {CreateTaskInfo.Project?.Title ?
                                        <div className="full-width replaceInput alignCenter">
                                            <a
                                                title={CreateTaskInfo.Project?.Title}
                                                target="_blank"
                                                data-interception="off"
                                                className="textDotted"
                                                href={`${ItemDetails.siteUrl}/SitePages/PX-Profile.aspx?ProjectId==${CreateTaskInfo.Project?.Id}`}
                                            >
                                                {CreateTaskInfo.Project?.Title}
                                            </a>

                                        </div>
                                        :
                                        <input
                                            type='text'
                                            placeholder='Search Project Items'
                                            className="form-control"
                                            onChange={(e) => AutoSuggestionsCommonFunction("Project", e.target.value)}
                                        />
                                    }
                                    <span
                                        className="input-group-text"
                                        onClick={() => setIsProjectManagementPopup(true)}
                                        title="Project Items Popup"
                                    >
                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {SearchedProjectData?.length > 0 ? (
                                        <div className="SmartTableOnTaskPopup">
                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                {SearchedProjectData.map((item: any) => {
                                                    return (
                                                        <li
                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                            key={item.id}
                                                            onClick={() =>
                                                                TagProjectAndPortfolio("Project", item)
                                                            }
                                                        >
                                                            <a>{item?.Path}</a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='d-flex py-2 border-start border-end '>
                                <div className='current-Task-section' style={{ width: "47%" }}>Priority: <span className='siteColor ms-2'>{ItemDetails?.PriorityRank}</span></div>
                                <div className='Move-data-current-to-new text-center' style={{ width: "6%" }} title='Swipe data left to right' ><BsArrowRightSquare onClick={() => SwipeDataFunction("PriorityRank")} /></div>
                                <div className='new-task-section' style={{ width: "47%" }}>Priority:
                                    {CreateTaskInfo.PriorityRank ?
                                        <input
                                            type='Number'
                                            className="form-control"
                                            value={CreateTaskInfo.PriorityRank}
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, PriorityRank: e.target.value })}
                                        /> :
                                        <input
                                            type='Number'
                                            placeholder='Enter Task Priority'
                                            className="form-control"
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, PriorityRank: e.target.value })}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='d-flex py-2 border-start border-end '>
                                <div className='current-Task-section' style={{ width: "47%" }}>DueDate: <span className='siteColor ms-2'>{ItemDetails.DueDate ? Moment(ItemDetails.DueDate).format("DD/MM/YYYY") : ""}</span></div>
                                <div className='Move-data-current-to-new text-center' style={{ width: "6%" }} title='Swipe data left to right' ><BsArrowRightSquare onClick={() => SwipeDataFunction("DueDate")} /></div>
                                <div className='new-task-section' style={{ width: "47%" }}>
                                    DueDate:
                                    {CreateTaskInfo.DueDate ?
                                        <input
                                            type='date'
                                            className="form-control"
                                            defaultValue={Moment(ItemDetails.DueDate).format("YYYY-MM-DD")}
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, DueDate: e.target.value })}
                                        /> :
                                        <input
                                            type='date'
                                            placeholder='Enter Due Date'
                                            className="form-control"
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, DueDate: e.target.value })}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className=' d-flex py-2 border-start border-end '>
                                <div className='current-Task-section' style={{ width: "47%" }}>
                                    <label className='full-width form-label'>Relevant-URL:</label>
                                    <a href={ItemDetails?.Relevant_Url} target="_blank" data-interception="off" className='siteColor text-break'>{ItemDetails?.Relevant_Url}</a>
                                </div>
                                <div className='Move-data-current-to-new text-center' style={{ width: "6%" }} title='Swipe data left to right' ><BsArrowRightSquare onClick={() => SwipeDataFunction("Relevant_Url")} /></div>
                                <div className='new-task-section' style={{ width: "47%" }}>Relevant-URL:
                                    {CreateTaskInfo.Relevant_Url ?
                                        <input
                                            type='text'
                                            className="form-control"
                                            defaultValue={CreateTaskInfo.Relevant_Url}
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, Relevant_Url: e.target.value })}
                                        /> :
                                        <input
                                            type='text'
                                            placeholder='Enter Task Relevant_Url'
                                            className="form-control"
                                            onChange={(e) => setCreateTaskInfo({ ...CreateTaskInfo, Relevant_Url: e.target.value })}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='d-flex py-2 border-start border-end '>
                                <div className='current-Task-section' style={{ width: "56%" }}>Task Images:

                                </div>
                                <div className='new-task-section' style={{ width: "50%" }}>
                                    Task Images:
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='d-flex border-start border-end '>
                                <div style={{ width: "56%" }}>
                                    {ItemDetails?.UploadedImage?.map((ImageItem: any, Index: number) => {
                                        return (
                                            <div className='alignCenter'>
                                                <div className='d-flex mt-2' style={{ width: "91%" }} >
                                                    <div>{Index + 1}.</div>
                                                    <div className='border p-2 mx-3'>
                                                        <img src={ImageItem?.ImageUrl} className='img-fluid' alt={ImageItem?.ImageName} />
                                                        <div className="card-footer alignCenter justify-content-between pt-0 pb-1 px-2">
                                                            <div className="alignCenter">
                                                                <span className="fw-semibold" title={ImageItem.ImageName}>
                                                                    {ImageItem.ImageName
                                                                        ? ImageItem.ImageName.slice(0, 15) + "..."
                                                                        : ""}
                                                                </span>
                                                                <span className='mx-1'>{" "} |</span>
                                                                <span className="fw-semibold">
                                                                    {ImageItem.UploadeDate
                                                                        ? ImageItem.UploadeDate
                                                                        : ""}
                                                                </span>
                                                                <span className="mx-1">
                                                                    <img
                                                                        className="imgAuthor"
                                                                        title={ImageItem.UserName}
                                                                        src={
                                                                            ImageItem.UserImage
                                                                                ? ImageItem.UserImage
                                                                                : ""
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='Move-data-current-to-new text-center' style={{ width: "7%" }} title='Swipe data left to right' ><BsArrowRightSquare onClick={() => swipeImageFunction(ImageItem, Index)} /></div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div style={{ width: "50%" }}>
                                    {CreateTaskInfo?.UploadedImage?.length > 0 ?
                                        <>
                                            {CreateTaskInfo?.UploadedImage?.map((ImageItem: any, Index: number) => {
                                                return (
                                                    <div className='d-flex mt-2' style={{ width: "100%" }} >
                                                        <div>{Index + 1}.</div>
                                                        <div className='border p-2 mx-3'>
                                                            <img src={ImageItem?.ImageUrl} className='img-fluid' alt={ImageItem?.ImageName} />
                                                            <div className="card-footer alignCenter justify-content-between">
                                                                <div className="alignCenter">
                                                                    <span className="fw-semibold" title={ImageItem.ImageName}>
                                                                        {ImageItem.ImageName
                                                                            ? ImageItem.ImageName.slice(0, 15) + "..."
                                                                            : ""}
                                                                    </span>
                                                                    <span className='mx-1'>{" "} |</span>
                                                                    <span className="fw-semibold">
                                                                        {ImageItem.UploadeDate
                                                                            ? ImageItem.UploadeDate
                                                                            : ""}
                                                                    </span>
                                                                </div>
                                                                <div className="alignCenter">
                                                                    <span
                                                                        className="hover-text"
                                                                        onClick={() => DeleteUploadedImage(ImageItem.ImageName)}
                                                                    >
                                                                        <RiDeleteBin6Line />
                                                                        <span className="tooltip-text pop-right">
                                                                            Delete
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {UploadBtnStatus ? null :
                                                <span className='float-end me-3 mt-2 siteColor' onClick={() => setUploadBtnStatus(!UploadBtnStatus)}>Add New Image</span>}
                                        </> :
                                        <div className='ms-3 mx-2 p-2'>
                                            <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />
                                        </div>
                                    }
                                    {UploadBtnStatus ? <div className='ms-3 mx-2 p-2'><FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} /> </div> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {(isTeamPortfolioPopup || isProjectManagementPopup) && (
                    <ServiceComponentPortfolioPopup
                        props={ItemDetails}
                        Dynamic={RequiredListIds}
                        ComponentType={"Component"}
                        Call={ComponentServicePopupCallBack}
                        selectionType={"Single"}
                        showProject={isProjectManagementPopup}
                    />
                )}
                {LoaderStatus ? <PageLoader /> : null}
            </Panel>
        </div>
    )
}
export default CreateTaskCompareTool;
