import * as React from 'react'
import { SPFI } from "@pnp/sp";
import FlorarImagetabportfolio from './FlorarImagetabportfolio'
import { Tabs, Tab, Col, Nav, Row, Button } from 'react-bootstrap';
import pnp, { sp, Web } from "sp-pnp-js";
import { useState } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import "@pnp/sp/folders";
import ShowImagesOOTB from './showImagesootb'
let imageOTT = false;

let Imageshow: number;
let imgdefaultContent = "";

let count = 18;
const ImagetabFunction = (props: any) => {
    const [editData, setEditData] = useState<any>(props?.EditdocumentsData)
    const Item_x002d_Image = {Item_x002d_Image:props?.EditdocumentsData};
    const [selectfolder, setSelectfolder] = useState("Logos");
    const [chooseExistingFile, setChooseExistingFile] = useState({
        ChooseExistinglogo: [], ChooseExistingCover: [], ChooseExistingImages1: []
    });
    const [showImagesOOTB, setShowImagesOOTB] = useState(null)
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [loadedImages, setLoadedImages] = useState([]);
    React.useEffect(() => {
        getAllImageData()
    }, []);


    const getAllImageData = async () => {
        const web = new Web(props.Context.pageContext.web.absoluteUrl);
        var data = ["Logos", "Covers", "Page-Images"]
        let ChooseExistinglogoarray: any = [];
        let ChooseExistingCoverarray: any = [];
        let ChooseExistingImages1array: any = [];
        for (let i = 0; i < data.length; i++) {
            await web.getFolderByServerRelativeUrl(`${props?.Context?._pageContext?.web?.serverRelativeUrl}/PublishingImages/${data[i]}`).files.get()
                .then(async (dataimage: any) => {
                    try {
                        if (data[i] == "Logos") {
                            ChooseExistinglogoarray = dataimage;
                            setLoadedImages(ChooseExistinglogoarray)

                        }
                        if (data[i] == "Covers") {
                            ChooseExistingCoverarray = dataimage
                            // let temp: any[] = []
                            // if (ChooseExistingCoverarray != undefined && ChooseExistingCoverarray?.length > 0) {
                            //     for (let i = 0; i < 10; i++) {
                            //         temp.push(ChooseExistingCoverarray[i])
                            //     }
                            // }
                            // setLoadedImages(temp)
                        }
                        if (data[i] == "Page-Images") {
                            ChooseExistingImages1array = dataimage
                            // let temp: any[] = []
                            // if (ChooseExistingImages1array != undefined && ChooseExistingImages1array?.length > 0) {
                            //     for (let i = 0; i < 10; i++) {
                            //         temp.push(ChooseExistingImages1array[i])
                            //     }
                            // }
                            // setLoadedImages(temp)
                        }
                    } catch (e) { console.log(e) }
                }).catch((err: any) => {
                    console.log(err.message);

                });
        }

        setChooseExistingFile({ ...chooseExistingFile, ChooseExistinglogo: ChooseExistinglogoarray, ChooseExistingCover: ChooseExistingCoverarray, ChooseExistingImages1: ChooseExistingImages1array })
    }


    const florarImageUploadCallBackFunction = (item: any, FileName: any) => {
        imgdefaultContent = item;
        console.log(item)
        let DataObject: any = {
            fileURL: item,
            file: "Image/jpg",
            fileName: FileName
        }
        if (FileName == null || FileName == undefined) {
            DataObject.fileName = `${props?.EditdocumentsData?.Title}${Math.random()}.jpg`
        }

        setUploadedImage(DataObject);
    }
    const changesTabFunction = (selecttab: any) => {
        imgdefaultContent = ""
        setSelectfolder(selecttab);
        if (selecttab == "Images1") {
            let imagesData: any[] = [];
            let myimagedata: any[] = [];
            imagesData = chooseExistingFile?.ChooseExistingImages1
            for (let i = 0; i < 18; i++) {
                if (imagesData[i] != undefined)
                    myimagedata?.push(imagesData[i]);
            }
            setLoadedImages(myimagedata);

        }

        if (selecttab == "Covers") {
            let imagesData: any[] = [];
            let myimagedata: any[] = [];
            imagesData = chooseExistingFile?.ChooseExistingCover
            for (let i = 0; i < 18; i++) {
                if (imagesData[i] != undefined)
                    myimagedata?.push(imagesData[i]);
            }
            setLoadedImages(myimagedata);

        }
        if (selecttab == "Logos") {
            let imagesData: any[] = [];
            let myimagedata: any[] = [];
            imagesData = chooseExistingFile?.ChooseExistinglogo
            if (imagesData.length > 14) {
                for (let i = 0; i < 18; i++) {
                    if (imagesData[i] != undefined)
                        myimagedata?.push(imagesData[i]);
                }
                setLoadedImages(myimagedata);

            }
            else {
                setLoadedImages(imagesData);
            }
        }

    }
    // =============image upload input box ===================
    const UploadImageValue = (e: any, selectTab: any) => {

        console.log(e);
        console.log(e.target.files)
        let files = e.target.files;

        const file = files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            let uploadedImage = {
                fileURL: reader.result as string,
                fileName: file.name
            }
            setUploadedImage(uploadedImage);
        }


    }
    // =====================upload image function ==========================
    const uploadImage = async () => {
        imgdefaultContent = ""
        var src = uploadedImage.fileURL?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        let resImageAdd;
        var selectfolder2 = ""
        if (selectfolder == "Logos") {
            selectfolder2 = "PublishingImages/Logos"
        }
        if (selectfolder == "Covers") {
            selectfolder2 = "PublishingImages/Covers"
        }
        if (selectfolder == "Images1") {
            selectfolder2 = "PublishingImages/Page-Images"
        }

        const web = new Web(props.Context.pageContext.web.absoluteUrl);
        const folder = web.getFolderByServerRelativeUrl(`${selectfolder2}`);

        folder.files.add(uploadedImage.fileName, data).then(async (item: any) => {
            console.log(item)
            //   let hostWebURL = props.Context.pageContext._site.absoluteUrl.replace(props.Context.pageContext._site.absoluteUrl,"");
            let imageURL: string = `${props.Context._pageContext._web.absoluteUrl.split(props.Context.pageContext.web.serverRelativeUrl)[0]}${item.data.ServerRelativeUrl}`;
            console.log(imageURL)
            // =========get pic data and its Id=============

            await web.getFileByServerRelativeUrl(`${props?.Context?._pageContext?.web?.serverRelativeUrl}/${selectfolder2}/${uploadedImage.fileName}`).getItem()
                .then(async (res: any) => {
                    console.log(res);
                    let taskItem = { ...editData };

                    var recentUploadPic = {
                        Url: `${imageURL}`,
                        itemCoverId: res.Id,
                        itemCoverName: uploadedImage.fileName,
                        itemFolderurl: `${props?.Context?._pageContext?.web?.absoluteUrl}/${selectfolder2}`,
                        itemFolderName: selectfolder2
                    }
                    taskItem.Item_x002d_Image = recentUploadPic
                    taskItem.Item_x0020_Cover = recentUploadPic
                    taskItem.ItemCover = recentUploadPic
                    //   props.EditdocumentsData=taskItem
                    setEditData(taskItem)
                    props.setData(taskItem)
                    imgdefaultContent = ""
                    // props.callBack(taskItem);

                }).catch((error: any) => {
                    console.log(error)
                })
        }).catch((error) => {
            console.log(error);
        });

    }
    //================== delete the pic =====
    const clearImage = async (itemcoverId: any) => {
        if (itemcoverId != null) {
            const web = new Web(props.Context.pageContext.web.absoluteUrl);
            // await web.lists.getByTitle("SmartInformation")
            var text: any = "are you sure want to Delete";
            if (confirm(text) == true) {
                await web.getFileByServerRelativeUrl(`${props?.Context?._pageContext?.web?.serverRelativeUrl}/${editData?.Item_x002d_Image?.itemFolderName}/${editData?.Item_x002d_Image?.itemCoverName}`)
                    .recycle()
                    .then((res: any) => {
                        console.log(res);
                        let taskItem = { ...editData };
                        taskItem.Item_x002d_Image = null;
                        setEditData(taskItem)
                        props.setData(taskItem)
                        imgdefaultContent = ""
                        //   props.callBack(taskItem);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }
        } else {
            let taskItem = { ...editData };
            taskItem.Item_x002d_Image = null;
            taskItem.Item_x0020_Cover = null;
            taskItem.ItemCover = null;
            setEditData(taskItem)
            props.setData(taskItem)
            props.setToUpdate.Item_x0020_Cover = null;
               
            // props.setToUpdate((prev:any) => [...prev, {...prev, Item_x0020_Cover: prev?.Item_x0020_Cover !== null ? null : prev.Item_x0020_Cover}]);
            // props.callBack();   
        }
    }
    //==================existing ImgaeUpload===========================
    const ExistingImageUpload = (Imageurl: any) => {
        let taskItem = { ...editData };

        var ExistingImagePicDetails = {
            Url: `${props.Context._pageContext._legacyPageContext.appBarParams.portalUrl}${Imageurl.ServerRelativeUrl}`,

        }
        taskItem.Item_x002d_Image = ExistingImagePicDetails;
        taskItem.Item_x0020_Cover = ExistingImagePicDetails;
        taskItem.ItemCover = ExistingImagePicDetails;
        setEditData(taskItem)
        props.setData(taskItem)
    }

    //==========imageurl searching===============
    const searchImageUrl = (value: any) => {
        let taskItem = { ...editData };


        if (selectfolder == "Logos") {
            let searchingImageData = chooseExistingFile?.ChooseExistinglogo?.filter((items: any) => items?.ServerRelativeUrl == value)
            //   let taskItem = {...editData};

            var searchImagePicDetails = {
                Url: searchingImageData.length > 0 ? searchingImageData[0]?.ServerRelativeUrl : value

            }
            taskItem.Item_x002d_Image = searchImagePicDetails;
            taskItem.Item_x0020_Cover = searchImagePicDetails;
            taskItem.ItemCover = searchImagePicDetails;
            setEditData(taskItem)
            props.setData(taskItem)

        }
        if (selectfolder == "Covers") {
            let searchingImageData = chooseExistingFile?.ChooseExistingCover?.filter((items: any) => items?.ServerRelativeUrl == value)
            // let taskItem = {...editData};

            var searchImagePicDetails = {
                Url: searchingImageData.length > 0 ? searchingImageData[0]?.ServerRelativeUrl : value

            }
            taskItem.Item_x002d_Image = searchImagePicDetails;
            taskItem.Item_x0020_Cover = searchImagePicDetails;
            taskItem.ItemCover = searchImagePicDetails;
            setEditData(taskItem)
            props.setData(taskItem)
        }
        if (selectfolder == "Images1") {
            let searchingImageData = chooseExistingFile?.ChooseExistingImages1?.filter((items: any) => items?.ServerRelativeUrl == value)
            // let taskItem = {...editData};

            var searchImagePicDetails = {
                Url: searchingImageData.length > 0 ? searchingImageData[0]?.ServerRelativeUrl : value

            }
            taskItem.Item_x002d_Image = searchImagePicDetails;
            taskItem.Item_x0020_Cover = searchImagePicDetails;
            taskItem.ItemCover = searchImagePicDetails;
            setEditData(taskItem)
            props.setData(taskItem)
        }
    }

    //   For handle the throttle \



    const loadMore = async () => {
        // Load the remaining images
        count = count + 18;
        if (selectfolder == "Logos") {
            let imagesData: any = []        
            imagesData = chooseExistingFile?.ChooseExistinglogo;
            if (count != 0 && imagesData?.length > 0) {
                let myimagedata: any[] = [];
                for (let i = 0; i < count; i++) {
                    if (imagesData[i] != undefined)
                        myimagedata?.push(imagesData[i]);
                }
                setLoadedImages(myimagedata)
            }
        } else if (selectfolder == "Covers") {
            let imagesData: any = []
            imagesData = chooseExistingFile?.ChooseExistingCover;
            if (count != 0 && imagesData?.length > 0) {
                let myimagedata: any[] = [];
                for (let i = 0; i < count; i++) {
                    if (imagesData[i] != undefined)
                        myimagedata?.push(imagesData[i]);
                }
                setLoadedImages(myimagedata)
            }
        } else if (selectfolder == "Images1") {
            let imagesData: any = []
            imagesData = chooseExistingFile?.ChooseExistingImages1;
            if (count != 0 && imagesData?.length > 0) {
                let myimagedata: any[] = [];
                for (let i = 0; i < count; i++) {
                    if (imagesData[i] != undefined)
                        myimagedata?.push(imagesData[i]);
                }
                setLoadedImages(myimagedata)
            }
        }




    };

    return (
        <>
            <div className='d-flex pe-2 mt-2'>
                <div className="input-group ps-3"><label className=" full-width ">Image-Url </label>
                    <input type="text" className="form-control" placeholder='Serach' value={editData?.Item_x002d_Image != null ? editData?.Item_x002d_Image?.Url : ""} onChange={(e) => searchImageUrl(e.target.value)} />
                </div>


                <div className="input-group ms-3 pe-1">
                    <label className=" full-width ">Selected image alternate text</label>
                    <input type="text" className="form-control" value={props?.EditdocumentsData?.Title} placeholder='Alt text' />
                </div>
            </div>

            <div className="col-sm-12 mt-3 mb-2 ps-3 pe-4 imgTab">
                <Tab.Container id="left-tabs-example" defaultActiveKey="Logos">
                    <Row>
                        <Col sm={2} className='mt-5 pe-0'>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item >
                                    <Nav.Link eventKey="Logos" onClick={() => changesTabFunction("Logos")}>Logos</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Covers" onClick={() => changesTabFunction("Covers")}> Covers</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Images1" onClick={() => changesTabFunction("Images1")}> Images</Nav.Link>
                                </Nav.Item>

                                <div className='mt-1 me-1'>
                                    {editData?.Item_x002d_Image != undefined && <div><div><img className="img-fluid" src={editData?.Item_x002d_Image?.Url} /></div>
                                        <span><a href={editData?.Item_x002d_Image?.Url} target="_blank" data-interception="off"><span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span></a></span>
                                    </div>}

                                </div>
                                <div className='mt-2 text-center'><span className="alignIcon svg__iconbox svg__icon--cross dark hreflink" onClick={() => clearImage(editData?.Item_x002d_Image?.itemCoverId)}></span>Clear Image</div>
                            </Nav>
                        </Col>
                        <Col sm={10} className='p-0'>
                            <Tab.Content>
                                <Tab.Pane eventKey="Logos" className='p-0'>
                                    <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className="p-0"
                                    >
                                        <Tab eventKey="copy & paste" title="Copy & Paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" value={props?.EditdocumentsData?.Title} placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImagetabportfolio callBack={florarImageUploadCallBackFunction}
                                                        defaultContent={imgdefaultContent}
                                                    />

                                                </div>
                                                <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2' onClick={() => uploadImage()}>Upload</Button></div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0  p-2'>
                                                <div className='mt-3 ' style={{ height: "500px" }}>
                                                    <input type="file" accept="image/*" className='full-width' onChange={(e) => UploadImageValue(e, "upload")} />
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2' onClick={() => uploadImage()}>Upload</Button></div>
                                                </div>

                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title={`Choose from existing (${chooseExistingFile?.ChooseExistinglogo.length})`}>
                                            <div className='border border-top-0 ImageSec p-2 scrollbar maXh-500 hreflink'>
                                                <div className='clearfix'>
                                                    <div className="input-group "><label className=" full-width "><ShowImagesOOTB Context={props.Context}></ShowImagesOOTB></label>
                                                        <input type="text" className="form-control" placeholder='Search Image ' />
                                                    </div>
                                                </div>
                                                <div>

                                                    {loadedImages.map((img) => (<img src={img?.ServerRelativeUrl} onClick={() => ExistingImageUpload(img)} />))}

                                                </div>
                                                {chooseExistingFile?.ChooseExistinglogo.length > 18 && <button onClick={() => loadMore()} type='button' className='btn btn-primary'>Load More</button>}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Covers" className='p-0'>
                                    <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="Copy & Paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" value={props?.EditdocumentsData?.Title} placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImagetabportfolio callBack={florarImageUploadCallBackFunction} defaultContent={imgdefaultContent} />

                                                </div>
                                                <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1' onClick={() => uploadImage()}>Upload</Button></div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0  p-2'>
                                                <div className='mt-3' style={{ height: "500px" }}>
                                                    <input type="file" multiple accept='image/*' className='full-width' onChange={(e) => UploadImageValue(e, "upload")} />
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1' onClick={() => uploadImage()}>Upload</Button></div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title={`Choose from existing (${chooseExistingFile?.ChooseExistingCover.length})`}>

                                            <div className='border border-top-0 ImageSec p-2 scrollbar maXh-500 hreflink'>
                                                <div className='clearfix'>
                                                    <div className="input-group "><label className=" full-width "><ShowImagesOOTB Context={props.Context}></ShowImagesOOTB></label>
                                                        <input type="text" className="form-control" placeholder='Search Image ' />
                                                    </div>
                                                </div>
                                                <div>
                                                    {loadedImages.map((img) => (<img src={img?.ServerRelativeUrl} onClick={() => ExistingImageUpload(img)} />))}
                                                </div>
                                                {chooseExistingFile?.ChooseExistingCover.length > 18 && <button onClick={() => loadMore()} type='button' className='btn btn-primary'>Load More</button>}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Images1" className='p-0'>

                                    <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="Copy & Paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" value={props?.EditdocumentsData?.Title} placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImagetabportfolio callBack={florarImageUploadCallBackFunction} defaultContent={imgdefaultContent} />
                                                </div>
                                                <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2 btn btn-primary' onClick={() => uploadImage()}>Upload</Button></div>

                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0 p-2'>
                                                <div className='mt-3' style={{ height: "500px" }}>
                                                    <input type="file" multiple accept='image/*' className='full-width' onChange={(e) => UploadImageValue(e, "upload")} />
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2 btn btn-primary' onClick={() => uploadImage()}>Upload</Button></div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title={`Choose from existing (${chooseExistingFile?.ChooseExistingImages1?.length})`} >
                                            <div className='border border-top-0 ImageSec p-2 scrollbar maXh-500 hreflink'>
                                                <div className='clearfix'>
                                                    <div className="input-group "><label className=" full-width "><ShowImagesOOTB Context={props.Context}></ShowImagesOOTB></label>
                                                        <input type="text" className="form-control" placeholder='Search Image ' />
                                                    </div>
                                                </div>
                                                <div>

                                                    {loadedImages.map((img) => (<img src={img?.ServerRelativeUrl} onClick={() => ExistingImageUpload(img)} />))}
                                                </div>
                                                {chooseExistingFile?.ChooseExistingImages1.length > 18 && <button onClick={() => loadMore()} type='button' className='btn btn-primary'>Load More</button>}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
            {/* <Panel
                // onRenderHeader={}
                isOpen={showImagesOOTB?.showClose}
                type={PanelType?.custom}
                customWidth={showImagesOOTB?.width}
                onDismiss={closePopupImagesOOTB}
                isBlocking={showImagesOOTB?.showClose}
            // onRenderFooter={customFooter}
            >
                {showImagesOOTB}
                </Panel> */}
        </>
    )
}
export default ImagetabFunction;
