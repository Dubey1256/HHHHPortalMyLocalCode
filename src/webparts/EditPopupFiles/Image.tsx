import * as React from 'react';
import Tab from './Tabs/Tab';
import ImageUploading, { ImageListType } from "react-images-uploading";
import Tabs from './Tabs/Tabs';
import { RiDeleteBin6Line } from 'react-icons/ri'
import { TbReplace } from 'react-icons/tb'
// import './Tabs/styles.scss';
import "bootstrap/js/dist/tab.js";
import { AiOutlineFullscreen } from 'react-icons/ai'
import "bootstrap/dist/css/bootstrap.min.css";
import './Tabs/styles.scss'
export default function ImagesC({ id }: any) {
    const [imgdata, setimgdata] = React.useState([]);
    const [SelectedImages, setSelectedImages] = React.useState([]);
    const [TaskImages, setTaskImages] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const maxNumber = 69;

    const [vars, setvars] = React.useState('/sites/HHHH/PublishingImages/Portraits');
    React.useEffect(() => {
        // var url = `https://hhhhteams.sharepoint.com/sites/HHHH/_api/lists/getbyid('655B3B68-88EC-4F7F-9767-49C18EEDE5D5')/items?$select=Id,Title,Created,FileLeafRef,EncodedAbsUrl,FileDirRef,Modified,Author/Title,Editor/Title&$expand=Author,Editor&$top=4999&$filter=(FSObjType%20eq%200)and(FileDirRef%20eq%20%27/sites/HHHH/PublishingImages/Portraits%27)&$orderby=Created%20deschttps://hhhhteams.sharepoint.com/sites/HHHH/_api/lists/getbyid('655B3B68-88EC-4F7F-9767-49C18EEDE5D5')/items?$select=Id,Title,Created,FileLeafRef,EncodedAbsUrl,FileDirRef,Modified,Author/Title,Editor/Title&$expand=Author,Editor&$top=4999&$filter=(FileDirRef%20eq%20%27/sites/HHHH/PublishingImages/Portraits%27)&$orderby=Created%20desc`
        var url = `https://hhhhteams.sharepoint.com/sites/HHHH/_api/lists/getbyid('655B3B68-88EC-4F7F-9767-49C18EEDE5D5')/items?$select=Id,Title,Created,FileLeafRef,EncodedAbsUrl,FileDirRef,Modified,Author/Title,Editor/Title&$expand=Author,Editor&$top=4999&$filter=FSObjType%20eq%200&$orderby=Created%20desc`;
        var response: any = [];  // this variable is used for storing list items
        function GetImageItems() {
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (imgdata) {
                    response = response.concat(imgdata.d.results);
                    if (imgdata.d.__next) {
                        url = imgdata.d.__next;
                        GetImageItems();
                    } else setimgdata(response);
                    console.log(response);
                },
                error: function (error) {
                    console.log(error);
                    // error handler code goes here
                }
            });
        }
        GetImageItems();
    },
        []);
    const uploadImageFunction = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        imageList?.map((imgItem) => {
            if (imgItem.dataURL != undefined && imgItem.file != undefined) {
                let ImgArray = [{
                    ImageName: imgItem.file.name,
                    ImageUrl: id.props?.siteUrl + '/Lists/' + id.props?.siteType + '/Attachments/' + id.props?.Id + '/' + imgItem.file.name,
                    UploadeDate: new Date(),
                    UserImage: id.props.Author?.Title,
                    UserName: id.props.Author?.Title
                }];
                TaskImages.push(ImgArray);

            } else {
                TaskImages.push(imgItem);
            }
        })
        setImages(imageList as never[]);

    }
    function Portraits() {
        setvars("/sites/HHHH/PublishingImages/Portraits");
    }
    function PageI() {
        setvars("/sites/HHHH/PublishingImages/Page-Images");
    }
    function ICONS() {
        setvars("/sites/HHHH/PublishingImages/ICONS");
    }
    var SelectedImagess: any[] = [];
    function selectImage(imgd: any) {
        SelectedImagess.push(imgd);
        setSelectedImages(SelectedImagess);
    }
    var imagUrls: any[] = [];
    {
        SelectedImages.map((imgdata) => {
            imagUrls.push(imgdata.EncodedAbsUrl);
        }
        )
    }
    return (
        <div id="ImageInfo"  >
            
            <div className=" mt20 link-tab">
                <div className="col-md-10 col-md-offset-2 padL-0 PadR0 pull-right form-group ">
                    <div className="pull-right">
                        <a className="hreflink" ng-click="clearselectedimage();">Clear</a>
                    </div>
                    <input type="text" className="form-control" placeholder="Search"
                        title={imagUrls[0]} defaultValue={imagUrls} />
                </div>
            </div>
            <div className="" id="img-part">
                <div className="col-sm-12" style={{ display: "inline-flex" }}>
                    <div className="left-section col-md-2">
                        <div className="exTab3 mb-20">
                            <ul className="nav nav-pills">
                                <li className="Tab-length">
                                    <a href="#Active_tab" data-toggle="pill"
                                        onClick={() => ICONS()}  >&nbsp;Logos</a>
                                </li>
                                <li className="Tab-length">
                                    <a href="#Active_tab" data-toggle="pill"
                                        onClick={() => PageI()}  >&nbsp;Images</a>
                                </li>
                                <li className="active Tab-length">
                                    <a href="#Active_tab" data-toggle="pill"
                                        onClick={() => Portraits()}   >&nbsp;Portrait</a>
                                </li>
                            </ul>
                        </div>
                        <div className="row" ng-show="selectedImageUrl != undefined">
                            {SelectedImages.map(imgds =>
                                <div className="col-sm-12">
                                    <div className="img">
                                        <img id="selectedimage"
                                            //  src="{{selectedImageUrl}}?RenditionID=12"
                                            src={imgds.EncodedAbsUrl}
                                            title={imgds.FileLeafRef} />
                                    </div>
                                    <div>
                                        {/* selectedImage.FileLeafRef */}
                                        {imgds.FileLeafRef}
                                    </div>
                                    <div className="para">
                                        <a target="_blank"
                                            href={`https://hhhhteams.sharepoint.com/${imgds.FileDirRef}`}>
                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/15/images/folder.gif"
                                            /> Image
                                            Folder
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                <button className="nav-link active" id="BASIC-INFORMATION" data-bs-toggle="tab" data-bs-target="#BASICINFORMATION" type="button" role="tab" aria-controls="BASICINFORMATION" aria-selected="true">
                    Choose from existing
                </button>
                <button className="nav-link" id="NEW-TIME-SHEET" data-bs-toggle="tab" data-bs-target="#NEWTIMESHEET" type="button" role="tab" aria-controls="NEWTIMESHEET" aria-selected="false">Upload</button>
                <button className="nav-link" id="NEW-TIME-SHEET2" data-bs-toggle="tab" data-bs-target="#NEWTIMESHEET2" type="button" role="tab" aria-controls="NEWTIMESHEET2" aria-selected="false">Copy & Paste</button>
            </ul>
                    <div className="bg-f5f5 col-md-10 padL-0 PadR0 fix-height inner-tabb">
                        <div className="tab-pane active">
                            <div className="">
                                <div>
                                    <div className="tabbable-panel">
                                        <div className="tabbable-line exTab3">
                                            <div className="pad_tab-content imageinfo_border"
                                            >
                                                {/* id="tab_default_1" */}
                                               
                                                    {/* Image Name */}
                                                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                                                    <div className="tab-pane  show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                                                        <div ng-show="copycover"
                                                            className="form-group pad_tab-content active"
                                                            id="coverhide1">
                                                            <div className="form-group" id="pasteitemcover">
                                                                <div className="col-sm-12">
                                                                    <label className="full_width">
                                                                        Image
                                                                        Name
                                                                    </label>
                                                                    {SelectedImages.map(imgds =>
                                                                        <input type="text"
                                                                            ng-required="true"
                                                                            name="imagename"
                                                                            className="form-control"
                                                                            //    ng-model="prefix"
                                                                            defaultValue={imgds.FileLeafRef}
                                                                            placeholder=".jpg" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="fr-wrapper show-placeholder" dir="auto" style={{ maxHeight: "500px", overflow: "auto" }}>
                                                                <div className="fr-element fr-view" dir="auto" aria-disabled="false" style={{ minHeight: "250px" }} spellCheck="true">
                                                                    <span className="fr-placeholder" style={{ fontSize: "13px", lineHeight: "18.5714px", marginTop: "0px", paddingTop: "16px", paddingLeft: "16px", marginLeft: "0px", paddingRight: "16px", marginRight: "0px", textAlign: "start" }}>
                                                                        Copy &amp; Paste Image
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Choose from Existing */}
                                                    <div className="tab-pane " id="NEWTIMESHEET" role="tabpanel" aria-labelledby="NEWTIMESHEET">
                                                        <div className="form-group search-image"
                                                            ng-show="existingcover && Images !=null && Images != undefined && Images.length>0">
                                                            <a className="hreflink pull-right mt-3 ml-1"
                                                                ng-click="ShowImagesOOTB()"
                                                                target="_blank">
                                                                Find in shareweb picture
                                                                library
                                                            </a><img src="/_layouts/15/images/folder.gif"
                                                                className="pull-right mt-3" />
                                                            <input type="text" className="form-control"
                                                                ng-model="searchImage"
                                                                placeholder="Search all images here..." />
                                                        </div>
                                                        <div style={{ width: "935px", height: "400px", lineHeight: "3em", overflow: "scroll", border: "thin #000 solid", padding: "5px" }}>

                                                            <span className="gallery"
                                                                id="coverImages"
                                                                ng-show="selectedImageType == 'cover'">

                                                                <ul className="imageinfo-gallery d-flex">
                                                                    {imgdata.map((imgd) => {
                                                                        return (
                                                                            <>
                                                                                {imgd.FileDirRef === vars &&
                                                                                    <>
                                                                                        <li>
                                                                                            <a className="hreflink preview"
                                                                                                rel={imgd.EncodedAbsUrl}
                                                                                                id="coverImages"
                                                                                                title={imgd.FileLeafRef}>
                                                                                                <img
                                                                                                    src={imgd.EncodedAbsUrl}
                                                                                                    onClick={() => selectImage(imgd)}
                                                                                                    className="coverimage" />
                                                                                            </a>
                                                                                            <div className="img-bottom ">
                                                                                                <img className="pull-right setting-icon"
                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/settings.png"
                                                                                                    ng-click="Replaceselectedimage(img);" />
                                                                                            </div>
                                                                                        </li>
                                                                                    </>
                                                                                }
                                                                            </>
                                                                        )
                                                                    }

                                                                    )}
                                                                </ul>

                                                            </span>

                                                        </div>
                                                    </div>
                                                    <div className="tab-pane " id="NEWTIMESHEET2" role="tabpanel" aria-labelledby="NEWTIMESHEET2">
                                                        {/*upload from computer  */}
                                                        <div ng-show="uploadcover1==true"
                                                            className="tab-pane pad_tab-content"
                                                            id="showUpload">
                                                            <div className="" id="fixedHieght">
                                                                <div className="">
                                                                    <div id="itemcover12">
                                                                        <div className="col-sm-12">
                                                                            <label className="full_width">
                                                                                Upload
                                                                                from Computer:
                                                                            </label>
                                                                            <br />
                                                                            <input className="form-control"
                                                                                ng-model="uploadFile"
                                                                                type="file"
                                                                                id="uploadFile"
                                                                                accept="image/*"
                                                                                valid-file />
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <br />
                                                                            <button type="button"
                                                                                className="btn btn-primary pull-right va"
                                                                                ng-click="uploadCoverImage()">
                                                                                Upload
                                                                            </button>
                                                                        </div>
                                                                        <div className="image-upload">
                                                                            <ImageUploading
                                                                                multiple
                                                                                value={TaskImages}
                                                                                onChange={uploadImageFunction}
                                                                                maxNumber={maxNumber}
                                                                            >
                                                                                {({
                                                                                    imageList = TaskImages,
                                                                                    onImageUpload,
                                                                                    onImageRemoveAll,
                                                                                    onImageUpdate,
                                                                                    onImageRemove,
                                                                                    isDragging,
                                                                                    dragProps
                                                                                }: any) => (
                                                                                    <div className="upload__image-wrapper">
                                                                                        {imageList ?
                                                                                            <div>{imageList?.map((ImageDtl: any, index: any) => {
                                                                                                return (
                                                                                                    <div>
                                                                                                        <div className="my-1" style={{ width: "18rem" }}>
                                                                                                            <img src={ImageDtl.ImageUrl ? ImageDtl.ImageUrl : ''} className="card-img-top" />
                                                                                                            <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                                                                                <div>
                                                                                                                    <input type="checkbox" />
                                                                                                                    <span className="mx-1">{ImageDtl.ImageName ? ImageDtl.ImageName.slice(0, 6) : ''}</span>
                                                                                                                    <span className="fw-semibold">{ImageDtl.UploadeDate ? ImageDtl.UploadeDate : ''}</span>
                                                                                                                    <span className="mx-1">
                                                                                                                        <img style={{ width: "25px" }} src={ImageDtl.UserImage ? ImageDtl.UserImage : ''} />
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                    <span><AiOutlineFullscreen /></span>
                                                                                                                    <span className="mx-1" onClick={() => onImageUpdate(index)}>| <TbReplace /> |</span>
                                                                                                                    <span><RiDeleteBin6Line onClick={() => onImageRemove(index)} /></span>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            })}
                                                                                            </div>
                                                                                            : null}
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <a
                                                                                                style={isDragging ? { color: "red" } : { color: "darkblue" }}
                                                                                                onClick={onImageUpload}
                                                                                                {...dragProps}
                                                                                            >
                                                                                                Upload Image
                                                                                            </a>
                                                                                            &nbsp;
                                                                                            <a className="hreflink" onClick={onImageRemoveAll}> Remove all images</a>
                                                                                        </div>

                                                                                    </div>
                                                                                )}
                                                                            </ImageUploading>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                               
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
