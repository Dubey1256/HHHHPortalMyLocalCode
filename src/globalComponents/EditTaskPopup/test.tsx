import * as React from "react";
import FlorarImageUploadComponent from '../FlorarComponents/UploadImageForBackground';
import { useState, useCallback } from 'react';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import { Web } from "sp-pnp-js";
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { Avatar } from "@fluentui/react-components";
import { set } from "@microsoft/sp-lodash-subset";
import { Mms } from "@material-ui/icons";
const BackgroundCommentComponent = (Props: any) => {
    const [BackgroundComment, setBackgroundComment] = useState('');
    const [EditCommentPanel, setEditCommentPanel] = useState(false);
    const [editTypeUsedFor, setEditTypeUsedFor] = useState("")
    const [BackgroundComments, setBackgroundComments] = useState(Props.TaskData?.BackgroundComments != undefined ? Props.TaskData?.BackgroundComments : []);
    const [EODPendingComment, setEODPendingComment] = useState('');
    const [EODAchiviedComment, setEODAchiviedComment] = useState('');
    const [oneEODReport,setOneEODReport]=useState(true)
    const [taskInfo, setTaskInfo] = useState(Props.TaskData) 
    const [uploadImageContainer, setuploadImageContainer] = useState(false);
    const [UpdateCommentData, setUpdateCommentData] = useState('');
    const [CurrentIndex, setCurrentIndex] = useState<any>();

    const currentUserData: any = Props.CurrentUser;
    var BackgroundImageData: any = Props.TaskData?.BackgroundImages != undefined ? Props.TaskData?.BackgroundImages : [];
    const [BackgroundImageJSON, setBackgroundImageJSON] = useState(BackgroundImageData)
    const Context = Props.Context;
    const siteUrls = Props.siteUrls;

    // React.useEffect(()=>{
    //     CheckOneEodReport()
    // },[])

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
            let uniqueId=generateUniqueId()
            if (currentUserData?.length > 0) {
                CurrentUser = currentUserData[0];
            }
            let CommentJSON = {
                AuthorId: CurrentUser?.AssingedToUserId != undefined ? CurrentUser?.AssingedToUserId : 0,
                editable: false,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Body: BackgroundComment,
                AuthorImage: CurrentUser?.Item_x0020_Cover != null ? CurrentUser?.Item_x0020_Cover?.Url : null,
                AuthorName: CurrentUser?.Title != undefined ? CurrentUser?.Title : Context?.pageContext?._user.displayName,
                ID: (uniqueId != undefined ? uniqueId: BackgroundComments?.length + 1)
            }
            BackgroundComments.push(CommentJSON);
            setBackgroundComments(BackgroundComments);
            setBackgroundComment("");
            updateCommentFunction(BackgroundComments, "OffshoreComments");
        } else {
            alert("Please Enter Your Comment First!")
        }
    }
    // Code by Udbhav related to the EOD report Comments Add
    function generateUniqueId() {
        let newId = BackgroundComments?.length;
    
        BackgroundComments.forEach((uniqueId: any) => {
            while (uniqueId.ID == newId) {
                newId++;
            }
        });
    
        return newId;
    }

    const AddEODComent = () => {
        if (EODPendingComment?.length > 0 || EODAchiviedComment?.length > 0) {
            let CurrentUser: any
            let uniqueId=generateUniqueId()
            if (currentUserData?.length > 0) {
                CurrentUser = currentUserData[0];
            }
            let CommentJSON = {
                AuthorId: CurrentUser?.AssingedToUserId != undefined ? CurrentUser?.AssingedToUserId : 0,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                AuthorImage: CurrentUser?.Item_x0020_Cover != null ? CurrentUser?.Item_x0020_Cover?.Url : null,
                AuthorName: CurrentUser?.Title != undefined ? CurrentUser?.Title : Context?.pageContext?._user.displayName,
                Type: "EODReport",
                isEodTask:false,
                Title: taskInfo?.Title,
                ProjectID: taskInfo?.Project?.Id,
                ProjectName: taskInfo?.Project?.Title,
                Achieved: EODAchiviedComment,
                Pending: EODPendingComment,
                ID: (uniqueId != undefined ? uniqueId: BackgroundComments?.length + 1)
            }
            BackgroundComments.push(CommentJSON);
            setBackgroundComments(BackgroundComments)
            setEODAchiviedComment('')
            setEODPendingComment('')
            // setOneEODReport(false)
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
  // Code by Udbhav for delete EOD Comment

    const DeleteEODComment = (CommentId: any, Comment: any, UsedFor: any) => {
        let tempArray:any=BackgroundComments
        tempArray?.map((EODComment: any, index: any) => {
            if (EODComment.ID == CommentId) {
                if (UsedFor == "Achieved") {
                    if (EODComment?.Achieved == Comment) {
                        delete EODComment.Achieved;
                    }
                }
                 if (UsedFor == "Pending") {
                    if (EODComment?.Pending == Comment) {
                        delete EODComment.Pending;
                    }
                }
                 if (EODComment?.Pending == undefined && EODComment?.Achieved == undefined) {
                    tempArray?.splice(index, 1)
                }

            }

        })
        updateCommentFunction(tempArray, "OffshoreComments");
        setBackgroundComments([...tempArray]);
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
    const openEditModal = (Index: any, Body: any, UsedFor: any) => {
        setEditTypeUsedFor(UsedFor)
        setEditCommentPanel(true);
        setUpdateCommentData(Body);
        setCurrentIndex(Index);
    }
    // const CheckOneEodReport=()=>{
    //     const currentDate = Moment();
    //     let taskDetail=[];
    //     try{
    //         taskDetail=JSON.parse(taskInfo?.OffshoreComments);
    //     }
    //     catch{
    //         console.log("undefined json")
    //     }
        
    //     const hasTodayEODReport = taskDetail?.some((item: any) =>{
    //         return(item.Type=="EODReport" && Moment(currentDate)?.format('DD/MM/YYYY')==Moment(item?.Created)?.format('DD/MM/YYYY'))
    //     }   
    //     );
    
    //     if (hasTodayEODReport) {
    //         setOneEODReport(false);
    //     }
    // } 
    const ChangeCommentFunction = () => {
        if (BackgroundComments != undefined && BackgroundComments.length > 0) {
            if (editTypeUsedFor === "Achieved" || editTypeUsedFor === "Pending") {
                if (editTypeUsedFor === "Achieved") {
                    BackgroundComments[CurrentIndex].Achieved = UpdateCommentData;
                    BackgroundComments[CurrentIndex].Created= Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                    BackgroundComments[CurrentIndex].AuthorImage=currentUserData[0]?.Item_x0020_Cover != null ? currentUserData[0]?.Item_x0020_Cover?.Url : null,
                    BackgroundComments[CurrentIndex].AuthorName=currentUserData[0]?.Title != undefined ? currentUserData[0]?.Title : Context?.pageContext?._user.displayName
                } else {
                    BackgroundComments[CurrentIndex].Pending = UpdateCommentData;
                    BackgroundComments[CurrentIndex].Created= Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                    BackgroundComments[CurrentIndex].AuthorImage=currentUserData[0]?.Item_x0020_Cover != null ? currentUserData[0]?.Item_x0020_Cover?.Url : null,
                    BackgroundComments[CurrentIndex].AuthorName=currentUserData[0]?.Title != undefined ? currentUserData[0]?.Title : Context?.pageContext?._user.displayName
                }
                updateCommentFunction(BackgroundComments, "OffshoreComments");
                setUpdateCommentData("");
            } else {
                BackgroundComments[CurrentIndex].Body = UpdateCommentData;
                updateCommentFunction(BackgroundComments, "OffshoreComments");
                setUpdateCommentData("");
            }

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
                                                <Avatar
                                                    className="UserImage"
                                                    title={ImageDtl?.UserName}
                                                    name={ImageDtl?.UserName}
                                                    image={ImageDtl?.UserImage != undefined && ImageDtl?.UserImage != '' ? {
                                                        src: ImageDtl?.UserImage,
                                                    } : undefined}
                                                    initials={ImageDtl?.UserImage == undefined && ImageDtl?.Suffix != undefined ? ImageDtl?.Suffix : undefined}
                                                />
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
                        (dataItem.Type == undefined || dataItem.Type == null) &&
                            <div className={`col-12 d-flex float-end add_cmnt my-1 `}>
                                <div className="">
                                    <Avatar
                                        className="UserImage"
                                        title={dataItem?.AuthorName}
                                        name={dataItem?.AuthorName}
                                        image={dataItem.AuthorImage != undefined ? {
                                            src: dataItem.AuthorImage,
                                        } : undefined}
                                        initials={dataItem.AuthorImage == undefined && dataItem?.Suffix != undefined ? dataItem?.Suffix : undefined}
                                    />
                                </div>
                                <div className="col-11 ms-3 pe-0 text-break" >
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <span className="siteColor font-weight-normal">
                                            {dataItem.AuthorName} - {dataItem.Created}
                                        </span>
                                        <span className="alignCenter">
                                            {/* <img src={require('../../Assets/ICON/edit_page.svg')} width="25" /> */}
                                            <span onClick={() => openEditModal(Index, dataItem.Body, "backGroundComment")} title="Edit Comment" className="svg__iconbox hreflink svg__icon--edit"></span>

                                            {/* <img src={require('../../Assets/ICON/cross.svg')} width="25">
                                        </img> */}
                                            <span onClick={() => DeleteBackgroundCommentFunction(dataItem.ID, dataItem.Body)} title="Delete Comment" className="svg__iconbox hreflink ms-1 svg__icon--trash"></span>

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
                className="commented-data-sections my-2 p-1" >
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
                {/* Code by Udbhav realted EOD report */}
                {(currentUserData[0]?.UserGroup?.Title=="Portfolio Lead Team" ||currentUserData[0]?.UserGroup?.Title=="Smalsus Lead Team"||currentUserData[0]?.UserGroup?.Title=="Junior Task Management"||currentUserData[0]?.UserGroup?.Title=="Design Team" ||currentUserData[0]?.UserGroup?.Title=="QA Team" ||currentUserData[0]?.AssingedToUserId=='328' ) && 
               <>
               <p className="siteColor mb-0">EOD Report</p>
                {BackgroundComments != undefined && BackgroundComments.length > 0 ? BackgroundComments.map((dataItem: any, Index: any) => {
                    {
                        return (
                            (dataItem.Type === 'EODReport') && <>


                                <div className={`col-12 d-flex float-end add_cmnt my-1 `}>
                                    <div className="">
                                        <Avatar
                                            className="UserImage"
                                            title={dataItem?.AuthorName}
                                            name={dataItem?.AuthorName}
                                            image={dataItem.AuthorImage != undefined ? {
                                                src: dataItem.AuthorImage,
                                            } : undefined}
                                            initials={dataItem.AuthorImage == undefined && dataItem?.Suffix != undefined ? dataItem?.Suffix : undefined}
                                        />


                                    </div>
                                    <div className="col ms-3 pe-0" >
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <span className="siteColor font-weight-normal">
                                                {dataItem.AuthorName} - {dataItem.Created}
                                            </span>
                                            
                                        </div>
                                        <div className="d-flex flex-column gap-1">


                                            {dataItem.Achieved != undefined &&
                                                <div className="d-flex gap-2">
                                                    <span  style={{ minWidth: '75px' }}> Completed- </span>
                                                    <span>{dataItem.Achieved}</span>
                                                    <span className="d-flex">
                                                    <span onClick={() => openEditModal(Index, dataItem.Achieved, "Achieved")} title="Edit Comment" className="svg__iconbox svg__icon--edit"></span>
                                                    <span onClick={() => DeleteEODComment(dataItem.ID, dataItem.Achieved, "Achieved")} title="Delete Comment" className="svg__iconbox ms-1 svg__icon--trash"></span>
                                                    </span>
                                                </div>
                                            }
                                            {dataItem.Pending != undefined &&
                                           <div className="d-flex gap-2">
                                                <span  style={{ minWidth: '75px' }}> Pending-</span>
                                                <span>{dataItem.Pending}</span>
                                                <span className="d-flex">
                                                <span onClick={() => openEditModal(Index, dataItem.Pending, "Pending")} title="Edit Comment" className="svg__iconbox svg__icon--edit"></span>
                                                <span onClick={() => DeleteEODComment(dataItem.ID, dataItem.Pending, "Pending")} title="Delete Comment" className="svg__iconbox ms-1 svg__icon--trash"></span>
                                                </span>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </> 
                        )
                    }


                }) : <div
                className="commented-data-sections my-2 p-1"
            >
                There is no EOD comments
            </div>
                }

              {oneEODReport &&<>
                <p className="siteColor mb-0">PENDING COMMENT</p>
                <div className="enter-comment-data-section">
                    <textarea
                        value={EODPendingComment}
                        onChange={(e) => setEODPendingComment(e.target.value)}
                        placeholder="Enter  what is pending in Task ?"
                    >
                    </textarea>
                   {EODPendingComment==''&& <p style={{color:"red"}} className="mb-0">Please fill the Pending comment </p>}
                </div>
                <p className="siteColor mb-0">ACHIEVED COMMENT</p>
                <div className="enter-comment-data-section">
                    <textarea
                        value={EODAchiviedComment}
                        onChange={(e) => setEODAchiviedComment(e.target.value)}
                        placeholder="'Enter  What has been Completed in task ?'"
                    >
                    </textarea>
                    {EODAchiviedComment==''&& <p style={{color:"red"}} className="mb-0">Please fill the complete comment </p>}

                </div>
                <button className="btn btn-primary float-end" onClick={AddEODComent} disabled={EODAchiviedComment === "" || EODPendingComment === ""}>
  Post EOD Comment
</button>
                </>
                }
               </> 
                }
                



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