import * as React from "react";
import FlorarImageUploadComponent from '../FlorarComponents/UploadImageForBackground';
import { useState, useCallback } from 'react';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import { Web } from "sp-pnp-js";
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';

const BackgroundCommentComponent = (Props: any) => {
    const [BackgroundComment, setBackgroundComment] = useState('');
    const [EditCommentPanel, setEditCommentPanel] = useState(false);
    const [BackgroundComments, setBackgroundComments] = useState(Props.TaskData?.BackgroundComments != undefined ? Props.TaskData?.BackgroundComments : []);
    const [uploadImageContainer, setuploadImageContainer] = useState(false);
    const [UpdateCommentData, setUpdateCommentData] = useState('');
    const [CurrentIndex, setCurrentIndex] = useState<any>();

    const currentUserData: any = Props.CurrentUser;
    var BackgroundImageData: any = Props.TaskData?.BackgroundImages != undefined ? Props.TaskData?.BackgroundImages : [];
    const [BackgroundImageJSON, setBackgroundImageJSON] = useState(BackgroundImageData)
    const Context = Props.Context;
    const siteUrls = Props.siteUrls;
    // This is used for Upload Background Images section and callback functions
    const FlorarImageReplaceComponentCallBack = (dt: any) => {
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg",
            fileName: `Cover_Image_${BackgroundImageData?.length + 1}_${Props.TaskData.Id}_${Props.TaskData.siteType}.jpg`
        }
        let ReplaceImageData = DataObject;
        uploadImageFolder(ReplaceImageData)
    }
    const uploadImageFolder = (Data: any) => {
        var src = Data.data_url?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }

        const web = new Web(siteUrls);
        const folder = web.getFolderByServerRelativeUrl(`PublishingImages/Covers`);
        folder.files.add(Data.fileName, data).then(async (item: any) => {
            let imageURL: string = `${Context._pageContext._web.absoluteUrl.split(Context.pageContext._web.serverRelativeUrl)[0]}${item.data.ServerRelativeUrl}`;
            await web.getFileByServerRelativeUrl(`${Context?._pageContext?._web?.serverRelativeUrl}/PublishingImages/Covers/${Data.fileName}`).getItem()
                .then(async (res: any) => {
                    console.log(res);
                    let obj = {
                        "AdminTab": "Admin",
                        "Id": res.Id,
                        "Url": imageURL,
                        "counter": BackgroundImageData?.length,
                        "UploadeDate": Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY'),
                        "UserName": Context._pageContext._user.displayName,
                        "ImageName": Data.fileName,
                        "UserImage": currentUserData?.length > 0 ? currentUserData[0].Item_x0020_Cover?.Url : ""
                    }
                    console.log(obj)
                    BackgroundImageData.push(obj);
                    setBackgroundImageJSON(BackgroundImageData);
                    updateCommentFunction(BackgroundImageData, "OffshoreImageUrl");
                    setuploadImageContainer(false);

                }).catch((error: any) => {
                    console.log(error)
                })
        })
            .catch((error: any) => {
                console.log(error)
            })
    }
    // This is used for Adding Background Comments 
    const AddBackgroundCommentFunction = async () => {
        if (BackgroundComment.length > 0) {
            let CurrentUser: any
            if (currentUserData?.length > 0) {
                CurrentUser = currentUserData[0];
            }
            let CommentJSON = {
                AuthorId: CurrentUser?.AssingedToUserId != undefined ? CurrentUser?.AssingedToUserId : 0,
                editable: false,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Body: BackgroundComment,
                AuthorImage: CurrentUser.Item_x0020_Cover != null ? CurrentUser.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                AuthorName: CurrentUser.Title != undefined ? CurrentUser.Title : Context.pageContext._user.displayName,
                ID: (BackgroundComments != undefined ? BackgroundComments?.length + 1 : 0)
            }
            BackgroundComments.push(CommentJSON);
            setBackgroundComments(BackgroundComments);
            setBackgroundComment("");
            updateCommentFunction(BackgroundComments, "OffshoreComments");
        } else {
            alert("Please Enter Your Comment First!")
        }
    }
    // This is used for Deleteing Background Comments 
    const DeleteBackgroundCommentFunction = (ID: any, Body: any) => {
        let tempArray: any = [];
        if (BackgroundComments != undefined && BackgroundComments.length > 0) {
            BackgroundComments.map((CommentData: any) => {
                if (ID != undefined) {
                    if (CommentData.ID != ID) {
                        tempArray.push(CommentData)
                    }
                } else {
                    if (CommentData.Body != Body) {
                        tempArray.push(CommentData)
                    }
                }
            })
        }
        setBackgroundComments(tempArray);
        updateCommentFunction(tempArray, "OffshoreComments");
        tempArray = [];
    }

    const deletebackgroundImageFunction = async (ItemData: any) => {

        let tempArray: any = [];
        const web = new Web(Props.Context.pageContext.web.absoluteUrl);
        var text: any = "Are you sure want to delete this image";
        if (confirm(text) == true) {
            web.getFileByServerRelativeUrl(`${Props?.Context?._pageContext?.web?.serverRelativeUrl}/PublishingImages/Covers/${ItemData.ImageName}`)
                .recycle()
                .then((res: any) => {
                    console.log(res);
                    if (BackgroundImageJSON?.length > 0) {
                        BackgroundImageJSON.map((ImageData: any) => {
                            if (ImageData.ImageName != ItemData.ImageName) {
                                tempArray.push(ImageData);
                            }
                        })
                        updateCommentFunction(tempArray, "OffshoreImageUrl");
                        setBackgroundImageJSON(tempArray);
                        BackgroundImageData = tempArray;
                    } else {
                        updateCommentFunction([], "OffshoreImageUrl");
                        setBackgroundImageJSON([]);
                        BackgroundImageData = []
                    }

                }).catch((error: any) => {
                    console.log(error)
                })
        }
    }


    // This is common function for  Update Commnent on Backend Side 
    const updateCommentFunction = async (UpdateData: any, columnName: any) => {
        try {
            let web = new Web(siteUrls);
            let tempObject: any = {}
            if (columnName == "OffshoreComments") {
                tempObject = {
                    OffshoreComments: UpdateData != undefined && UpdateData.length > 0 ? JSON.stringify(UpdateData) : null
                }
            } else {
                tempObject = {
                    OffshoreImageUrl: UpdateData != undefined && UpdateData.length > 0 ? JSON.stringify(UpdateData) : null
                }
            }
            await web.lists.getById(Props.TaskData.listId).items.getById(Props.TaskData.Id).update(tempObject).then(() => {
                console.log("Background Comment Updated !!!")
            })
        } catch (error) {
            console.log("Error : ", error.message)
        }
    }
    const editPostCloseFunction = () => {
        setEditCommentPanel(false);
    }
    const openEditModal = (Index: any, Body: any) => {
        setEditCommentPanel(true);
        setUpdateCommentData(Body);
        setCurrentIndex(Index);
    }
    const ChangeCommentFunction = () => {
        if (BackgroundComments != undefined && BackgroundComments.length > 0) {
            BackgroundComments[CurrentIndex].Body = UpdateCommentData;
            updateCommentFunction(BackgroundComments, "OffshoreComments");
            setUpdateCommentData("");
        }
        setEditCommentPanel(false);

    }

    const onRenderCustomHeader = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div className="subheading siteColor">
                    {`Update Comment`}
                </div>
                <Tooltip ComponentId='1683' />
            </div>
        )
    }
    return (
        <div className="d-flex justify-content-between">
            <div className="Background_Image col-4">
                {BackgroundImageJSON != undefined && BackgroundImageJSON.length > 0 ?
                    <div> {BackgroundImageJSON.map((ImageDtl: any, index: number) => {
                        return (
                            <div key={index} className="image-item">
                                <div className="my-1">
                                    <div>
                                        {ImageDtl.ImageName ? ImageDtl.ImageName.slice(0, 50) : ''}
                                    </div>
                                    <a href={ImageDtl.Url} target="_blank" data-interception="off">
                                        <img src={ImageDtl.Url ? ImageDtl.Url : ''}
                                            className="border card-img-top" />
                                    </a>

                                    <div className=" bg-fxdark d-flex p-1 justify-content-between">
                                        <div className="alignCenter">
                                            <span className="fw-semibold">{ImageDtl.UploadeDate ? ImageDtl.UploadeDate : ''}</span>
                                            <span className="mx-1">
                                                <img className="imgAuthor" title={ImageDtl.UserName} src={ImageDtl.UserImage ? ImageDtl.UserImage : ''} />
                                            </span>
                                        </div>
                                        <div className="alignCenter mt--10">
                                            <span className="mx-1 alignIcon" title="Delete"
                                                onClick={() => deletebackgroundImageFunction(ImageDtl)}>
                                                <span className="svg__iconbox hreflink mini svg__icon--trash"></span>
                                                | </span>
                                            <span title="Open Image In Another Tab" className="mt-1">
                                                <a href={ImageDtl.Url} target="_blank" data-interception="off">
                                                    <HiOutlineArrowTopRightOnSquare />
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    </div>
                    :
                    <FlorarImageUploadComponent callBack={FlorarImageReplaceComponentCallBack} />
                }
                {uploadImageContainer ? <FlorarImageUploadComponent callBack={FlorarImageReplaceComponentCallBack} /> : null}
                <div className="Background_Image_footer d-flex justify-content-between my-1 ">
                    {BackgroundImageJSON != undefined && BackgroundImageJSON.length > 0 ?
                        <span className="hreflink ms-0 ps-0 siteColor" onClick={() => setuploadImageContainer(true)}>Add New Image</span> : null
                    }
                </div>
            </div>
            <div className="Background_Comment col-8 ps-3">
                <p className="siteColor mb-0">Comments</p>
                {BackgroundComments != undefined && BackgroundComments.length > 0 ? BackgroundComments.map((dataItem: any, Index: any) => {
                    return (
                        <div className={`col-12 d-flex float-end add_cmnt my-1 `}>
                            <div className="">
                                <img className="workmember"
                                    src={dataItem.AuthorImage != undefined && dataItem.AuthorImage != '' ?
                                        dataItem.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                            </div>
                            <div className="col-11 pe-0 ms-3" >
                                <div className='d-flex justify-content-between align-items-center'>
                                    <span className="siteColor font-weight-normal">
                                        {dataItem.AuthorName} - {dataItem.Created}
                                    </span>
                                    <span className="alignCenter">
                                        {/* <img src={require('../../Assets/ICON/edit_page.svg')} width="25" /> */}
                                        <span onClick={() => openEditModal(Index, dataItem.Body)} title="Edit Comment" className="svg__iconbox hreflink svg__icon--edit"></span>
                                    
                                        {/* <img src={require('../../Assets/ICON/cross.svg')} width="25">
                                        </img> */}
                                        <span  onClick={() => DeleteBackgroundCommentFunction(dataItem.ID, dataItem.Body)} title="Delete Comment" className="svg__iconbox hreflink ms-1 svg__icon--trash"></span>
                                    
                                    </span>
                                </div>
                                <div>
                                    <span dangerouslySetInnerHTML={{ __html: dataItem.Body }}></span>
                                </div>
                            </div>
                        </div>
                    )
                }) :
                    <div
                        className="commented-data-sections my-2 p-1"
                    >
                        There is no comments
                    </div>
                }
                <div className="enter-comment-data-section">
                    <textarea
                        value={BackgroundComment}
                        onChange={(e) => setBackgroundComment(e.target.value)}
                        placeholder="Enter Your Comment Here"
                    >
                    </textarea>
                </div>
                <button className="btn btn-primary float-end" onClick={AddBackgroundCommentFunction}>
                    Post Comment
                </button>
            </div>
            <section className="Update-FeedBack-section SiteColor">
                <Panel
                    onRenderHeader={onRenderCustomHeader}
                    isOpen={EditCommentPanel}
                    onDismiss={editPostCloseFunction}
                    isBlocking={EditCommentPanel}
                    type={PanelType.custom}
                    customWidth="500px"
                >
                    <div className="parentDiv p-0 pt-1">
                        <div
                        >
                            <textarea className="full-width"
                                id="txtUpdateComment"
                                rows={6}
                                defaultValue={UpdateCommentData}
                                onChange={(e) => setUpdateCommentData(e.target.value)}
                            >
                            </textarea>
                        </div>
                        <footer className="d-flex justify-content-between ms-3 float-end">
                            <div>
                                <button className="btn btnPrimary mx-1" onClick={ChangeCommentFunction}>
                                    Save
                                </button>
                                <button className='btn btn-default' onClick={editPostCloseFunction}>
                                    Cancel
                                </button>

                            </div>
                        </footer>
                    </div>
                </Panel>
            </section>
        </div >
    )
}
export default BackgroundCommentComponent;