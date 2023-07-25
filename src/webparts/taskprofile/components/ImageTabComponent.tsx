import * as React from 'react'
import { SPFI } from "@pnp/sp";
import DragDrop from'./FlorarImagetab'
import { Tabs, Tab, Col, Nav, Row, Button } from 'react-bootstrap';
import pnp, { sp, Web } from "sp-pnp-js";
import { useState } from 'react';
import "@pnp/sp/folders";


const ImagetabFunction = (props: any) => {
const [editData,setEditData]=useState(props.EditdocumentsData)
    const [selectfolder, setSelectfolder] = useState("Logos");
    const [chooseExistingFile, setChooseExistingFile] = useState({
        ChooseExistinglogo: [], ChooseExistingCover: [], ChooseExistingImages1: []
    });
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    console.log(props)
    console.log(props)
    React.useEffect(() => {

        getAllImageData();
    }, [])
    // const getimageData = async () => {
    //     const web=new Web(props.Context.pageContext._site.absoluteUrl);
    //     var selectfolder2 = ""
    //     if (selectfolder == "Logos") {
    //         selectfolder2 = "Logos"
    //     }
    //     if (selectfolder == "Covers") {
    //         selectfolder2 = "Covers"
    //     }
    //     if (selectfolder == "Images1") {
    //         selectfolder2 = "Page-Images"
    //     }
    //     await web.getFolderByServerRelativeUrl(`${props?.Context?._pageContext?._site?.serverRelativeUrl}/PublishingImages/${selectfolder2}`).files.get()
    //         .then(async(data: any) => {
    //             console.log(data)
    //             if (data != undefined && data.length > 0) {
    //                 if (selectfolder == "Logos") {
    //                     setChooseExistingFile({ ...chooseExistingFile, ChooseExistinglogo: data })
    //                 }
    //                 if (selectfolder == "Covers") {
    //                     setChooseExistingFile({ ...chooseExistingFile, ChooseExistingCover: data })
    //                 }
    //                 if (selectfolder == "Images1") {
    //                     setChooseExistingFile({ ...chooseExistingFile, ChooseExistingImages1: data })
    //                 }

    //             }
             
    //         }).catch((err: any) => {
    //             console.log(err.message);

    //         });
    // }
    const getAllImageData=async()=>{
        const web=new Web(props.Context.pageContext.web.absoluteUrl);
        var data=[ "Logos", "Covers","Page-Images"]
        let ChooseExistinglogoarray: any=[];
        let ChooseExistingCoverarray: any=[];
        let ChooseExistingImages1array: any=[];
        for(let i=0;i<data.length;i++){
            await web.getFolderByServerRelativeUrl(`${props?.Context?._pageContext?._site?.serverRelativeUrl}/PublishingImages/${data[i]}`).files.get()
            .then(async(dataimage: any) => {
                if (data[i] == "Logos") {
                    ChooseExistinglogoarray=dataimage;
                  //  setChooseExistingFile({ ...chooseExistingFile, ChooseExistinglogo: dataimage })
                }
                if (data[i] == "Covers") {
                    ChooseExistingCoverarray=dataimage
                   // setChooseExistingFile({ ...chooseExistingFile, ChooseExistingCover: dataimage })
                }
                if (data[i] == "Page-Images") {
                    ChooseExistingImages1array=dataimage
                    //setChooseExistingFile({ ...chooseExistingFile, ChooseExistingImages1: dataimage })
                }
            }).catch((err: any) => {
                console.log(err.message);

            });
        }
        setChooseExistingFile({ ...chooseExistingFile, ChooseExistinglogo: ChooseExistinglogoarray,ChooseExistingCover:ChooseExistingCoverarray, ChooseExistingImages1:ChooseExistingImages1array})
       }
    const florarImageUploadCallBackFunction = (item: any,FileName:any) => {
        console.log(item)
        let DataObject: any = {
            fileURL: item,
            file: "Image/jpg",
            fileName:FileName
        }
        
        setUploadedImage(DataObject);
        

    }
    const changesTabFunction = (selecttab: any) => {

        setSelectfolder(selecttab);
    }
// =============image upload input box ===================
    const UploadImageValue = (e: any, selectTab: any) => {
        console.log(e);
        console.log(e.target.files)
        let files = e.target.files;

        const file = files[0];
       
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ()=>{
            let uploadedImage = {
                fileURL: reader.result as string,
                fileName: file.name
            }
            setUploadedImage(uploadedImage);
        }
    
      
    }
    // =====================upload image function ==========================
    const uploadImage = async () => {
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
        
      const web=new Web(props.Context.pageContext._site.absoluteUrl);
     const folder = web.getFolderByServerRelativeUrl(`${selectfolder2}`);
     
        folder.files.add(uploadedImage.fileName, data).then(async(item: any) => {
          console.log(item)
        //   let hostWebURL = props.Context.pageContext._site.absoluteUrl.replace(props.Context.pageContext._site.absoluteUrl,"");
              let imageURL: string = `${props.Context._pageContext._web.absoluteUrl.split(props.Context.pageContext._web.serverRelativeUrl)[0]}${item.data.ServerRelativeUrl}`;
              console.log(imageURL)
           // =========get pic data and its Id=============
      
            await web.getFileByServerRelativeUrl(`${props?.Context?._pageContext?._site?.serverRelativeUrl}/${selectfolder2}/${uploadedImage.fileName}`).getItem()
            .then(async (res: any) => {
              console.log(res);
              let taskItem = {...editData};
              var recentUploadPic={
                Url :`${imageURL}?updated=${res.Id}`,
                itemCoverId : res.Id,
                itemCoverName:uploadedImage.fileName,
                itemFolderurl:`${props?.Context?._pageContext?._site?.absoluteUrl}/${selectfolder2}`,
                itemFolderName:selectfolder2
              }
              taskItem.Item_x0020_Cover=recentUploadPic
             
             setEditData(taskItem)
            props.callBack(taskItem);
         
            }).catch((error:any)=>{
              console.log(error)
            })
          }).catch((error) => {
          console.log(error);
        });
    
    }
//================== delete the pic =====
    const clearImage= async(itemcoverId:any)=>{
       if(itemcoverId!=null){
    const web = new Web(props.Context.pageContext._site.absoluteUrl);
    // await web.lists.getByTitle("SmartInformation")
    var text: any = "are you sure want to Delete";
    if (confirm(text) == true) {
      await web.getFileByServerRelativeUrl(`${props?.Context?._pageContext?._site?.serverRelativeUrl}/${editData?.Item_x0020_Cover?.itemFolderName}/${editData?.Item_x0020_Cover?.itemCoverName}`)
       .recycle()
        .then((res: any) => {
          console.log(res);
          let taskItem = {...editData};
          taskItem.Item_x0020_Cover=null;
          setEditData(taskItem)
          props.callBack(taskItem);
        })
        .catch((err) => {
          console.log(err.message);
        });
 }
    }
}
    return (
        <>
            <div className='d-flex '>
                <div className="input-group "><label className=" full-width ">Image Url </label>
                    <input type="text" className="form-control" placeholder='Serach' value={editData?.Item_x0020_Cover!=null?editData?.Item_x0020_Cover?.Url:""}/>
                </div>


                <div className="input-group mx-3">
                    <label className=" full-width "></label>
                    <input type="text" className="form-control" placeholder='Alt text' />
                </div>
            </div>

            <div className="col-sm-12 mt-3 mb-2 ps-3 pe-4 imgTab">
                <Tab.Container id="left-tabs-example" defaultActiveKey="Logos">
                    <Row>
                        <Col sm={2} className='mt-5 p-0' >
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
                               <div className='mt-3 mx-4'>
                               {editData.Item_x0020_Cover!=undefined &&<div><div><img src={editData?.Item_x0020_Cover?.Url}/></div>
                                    <span><a  href={editData?.Item_x0020_Cover?.Url}target="_blank" data-interception="off"><span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span></a></span>
                                    </div>}
                                  <ul className='alignCenter list-none'>
                                        <li>
                                            <span><a href={`${props.EditdocumentsData.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off">
                                                {props.EditdocumentsData?.File_x0020_Type == "pdf" && <span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "docx" && <span className='svg__iconbox svg__icon--docx' title="docx"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "csv" || props.EditdocumentsData?.File_x0020_Type == "xlsx" && <span className='svg__iconbox svg__icon--csv' title="csv"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "jpeg" || props.EditdocumentsData?.File_x0020_Type == "jpg " && <span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "ppt" || props.EditdocumentsData?.File_x0020_Type == "pptx" && <span className='svg__iconbox svg__icon--ppt' title="ppt"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "svg" && <span className='svg__iconbox svg__icon--svg' title="svg"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "zip" && <span className='svg__iconbox svg__icon--zip' title="zip"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "png" && <span className='svg__iconbox svg__icon--png' title="png"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "txt" && <span className='svg__iconbox svg__icon--txt' title="txt"></span>}
                                                {props.EditdocumentsData?.File_x0020_Type == "smg" && <span className='svg__iconbox svg__icon--smg' title="smg"></span>}
                                                {props.EditdocumentsData.Url != null && <span className='svg__iconbox svg__icon--link' title="smg"></span>}
                                            </a>Open this Document</span>
                                        </li>
                                    </ul>
                                    {/* <span> <a href={`${props.EditdocumentsData.EncodedAbsUrl}?web=1`}>Open this Document</a></span> */}
                                </div>
                                <div className='mt-2 mx-4'><span className="svg__iconbox svg__icon--trash" onClick={()=>clearImage(editData?.Item_x0020_Cover?.Description)}></span>Clear Image</div>
                            </Nav>
                        </Col>
                        <Col sm={10} className='p-0'>
                            <Tab.Content>
                                <Tab.Pane eventKey="Logos">
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
                                                    <DragDrop callBack={florarImageUploadCallBackFunction}></DragDrop>
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2' onClick={() => uploadImage()}>Upload</Button></div>
                                                </div>
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
                                            <div className='border border-top-0 ImageSec p-2 scrollbar maXh-500'>
                                                {chooseExistingFile?.ChooseExistinglogo != undefined && chooseExistingFile.ChooseExistinglogo.length > 0 && chooseExistingFile?.ChooseExistinglogo?.map((imagesData: any) => {
                                                    return (
                                                        <>
                                                            <img src={`${imagesData?.ServerRelativeUrl}`}></img></>
                                                    )
                                                })}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Covers">
                                    <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="Copy & Paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control"value={props?.EditdocumentsData?.Title} placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <DragDrop callBack={florarImageUploadCallBackFunction}></DragDrop>
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2' onClick={() => uploadImage()}>Upload</Button></div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0  p-2'>
                                                <div className='mt-3' style={{ height: "500px" }}>
                                                    <input type="file" multiple accept='image/*' className='full-width' onChange={(e) => UploadImageValue(e, "upload")} />
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2 btn btn-primary' onClick={() => uploadImage()}>Upload</Button></div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title={`Choose from existing (${chooseExistingFile?.ChooseExistingCover.length})`}>
                                            <div className='border border-top-0 ImageSec p-2 scrollbar maXh-500'>
                                                {chooseExistingFile?.ChooseExistingCover != undefined && chooseExistingFile?.ChooseExistingCover?.length > 0 && chooseExistingFile?.ChooseExistingCover?.map((imagesData: any) => {
                                                    return (
                                                        <>
                                                            <img src={`${imagesData?.ServerRelativeUrl}`}></img></>
                                                    )
                                                })}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Images1">

                                    <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="Copy & Paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control"  value={props?.EditdocumentsData?.Title}  placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <DragDrop callBack={florarImageUploadCallBackFunction}></DragDrop>
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2 btn btn-primary'>Upload</Button></div> 
                                                </div>
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
                                            <div className='border border-top-0 ImageSec p-2 scrollbar maXh-500'>
                                                {chooseExistingFile?.ChooseExistingImages1 != undefined && chooseExistingFile?.ChooseExistingImages1?.length > 0 && chooseExistingFile?.ChooseExistingImages1?.map((imagesData: any) => {
                                                    return (
                                                        <>
                                                            <img src={`${imagesData?.ServerRelativeUrl}`}></img></>
                                                    )
                                                })}
                                            </div>
                                        </Tab>
                                    </Tabs>

                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        </>
    )
}
export default ImagetabFunction;