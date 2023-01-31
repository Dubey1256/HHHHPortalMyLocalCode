import * as React from 'react';
import Tab from './Tabs/Tab';
import Tabs from './Tabs/Tabs';
// import './Tabs/styles.scss';
import './Tabs/styles.scss'
export default function ImagesC({id}:any) {
    const [imgdata, setimgdata] = React.useState([]);
    const [SelectedImages, setSelectedImages] = React.useState([]);
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
        // "/sites/HHHH/PublishingImages/Portraits"
        // "/sites/HHHH/PublishingImages/Page-Images"
      function Portraits(){
        setvars("/sites/HHHH/PublishingImages/Portraits");
      }
      function PageI(){
        setvars("/sites/HHHH/PublishingImages/Page-Images");
      }
      function ICONS(){
        setvars("/sites/HHHH/PublishingImages/ICONS");
      }
 var SelectedImagess: any[] = [];
function selectImage(imgd: any) {
    SelectedImagess.push(imgd);
    setSelectedImages(SelectedImagess);
}
var imagUrls:any[]=[];
{SelectedImages.map((imgdata) =>
    {
        imagUrls.push(imgdata.EncodedAbsUrl);
    }
    )}
    return (
        <div id="ImageInfo"  >
            <div className=" mt20 link-tab">
                <div className="col-md-10 col-md-offset-2 padL-0 PadR0 pull-right form-group ">
                    <div className="pull-right">
                        <a className="hreflink" ng-click="clearselectedimage();">Clear</a>
                    </div>
                    <input type="text" className="form-control" placeholder="Search"
                        title={imagUrls[0]}  defaultValue={imagUrls} />
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
                                        src= {imgds.EncodedAbsUrl} 
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
                    <div className="bg-f5f5 col-md-10 padL-0 PadR0 fix-height inner-tabb">
                        <div className="tab-pane active">
                            <div className="">
                                <div>
                                    <div className="tabbable-panel">
                                        <div className="tabbable-line exTab3">
                                            <div className="pad_tab-content imageinfo_border"
                                                >
                                                    {/* id="tab_default_1" */}
                                                <Tabs>
                                                    {/* Image Name */}
                                                    <Tab title='Copy & Paste'>
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
                                                    </Tab>
                                                    {/* Choose from Existing */}
                                                    <Tab title='Choose from existing'>
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
                                                                            return(
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
                                                                            )}
                                                                             
                                                                             )}
                                                                        </ul>
                                                                    
                                                                </span>
                                                           
                                                        </div>
                                                    </Tab>
                                                    <Tab title='Upload'>
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                </Tabs>
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
