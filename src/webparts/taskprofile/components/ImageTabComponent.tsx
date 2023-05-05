import * as React from 'react'
import FlorarImageUploadComponent from '../../../globalComponents/FlorarComponents/FlorarImageUploadComponent'
import { Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import pnp, { sp, Web } from "sp-pnp-js";
import { useState  } from 'react';
const ImagetabFunction = (props: any) => {
    const [selectfolder,setSelectfolder]=useState("Logos");
    const [chooseExistingImages,setChooseExistingImages ]=useState<any>([]);
    console.log(props)
    console.log(props)
    React.useEffect(()=>{
         
        getimageData();
      }, [selectfolder]) 
    const getimageData=async()=>{
      var  web=props.AllListId.siteUrl;
      var selectfolder2=""
      if(selectfolder=="Logos"){
        selectfolder2="Page-Images"
      }
      if(selectfolder=="Covers"){
        selectfolder2="Covers" 
      }
      if(selectfolder=="Images1"){
        selectfolder2="Portraits" 
      }
      await pnp.sp.web.getFolderByServerRelativeUrl(`${props?.Context?._pageContext?._web?.serverRelativeUrl}/PublishingImages/${selectfolder2}`).files.get()
      .then((data:any)=>{
       console.log(data)
       if(data!=undefined&&data.length>0){
        setChooseExistingImages(data)
       }
       
      }) .catch((err:any) => {
        console.log(err.message);
      
      });
    }
    const florarImageUploadCallBackFunction = (item: any) => {
        console.log(item)
    
    }
    const changesTabFunction=(selecttab:any)=>{

        setSelectfolder(selecttab) ;
    }
    return (
        <>
            <div className='d-flex '>
                <div className="input-group "><label className=" full-width ">Image Url </label>
                    <input type="text" className="form-control" placeholder='Serach' />
                </div>


                <div className="input-group mx-3">
                    <label className=" full-width "></label>
                    <input type="text" className="form-control" placeholder='Alt text' />
                </div>
            </div>

            <div className="col-sm-12 mt-3 row">
                <Tab.Container id="left-tabs-example" defaultActiveKey="Logos">
                    <Row>
                        <        Col sm={3} className='mt-5'>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item >
                                    <Nav.Link eventKey="Logos" onClick={()=>changesTabFunction("Logos")}>Logos</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Covers"onClick={()=>changesTabFunction("Covers")}> Covers</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Images1"onClick={()=>changesTabFunction("Images1")}> Images</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="Logos">
                                    <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="copy & paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImageUploadComponent callBack={florarImageUploadCallBackFunction}></FlorarImageUploadComponent>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0  p-2'>
                                                <div className='mt-3'>
                                                    <input type="file" multiple accept='image/*' className='full-width'/>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title="Choose from existing (0)" >
                                            <div className='border border-top-0 p-2'>
                                                {chooseExistingImages!=undefined&& chooseExistingImages.length>0&&chooseExistingImages.map((imagesData:any)=>{
                                                   return(
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
                                        <Tab eventKey="copy & paste" title="copy & paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImageUploadComponent callBack={florarImageUploadCallBackFunction}></FlorarImageUploadComponent>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0  p-2'>
                                                <div className='mt-3'>
                                                    <input type="file" multiple accept='image/*' className='full-width'/>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title="Choose from existing (0)" >
                                            <div className='border border-top-0  p-2'>
                                            {chooseExistingImages!=undefined&& chooseExistingImages.length>0&&chooseExistingImages.map((imagesData:any)=>{
                                                   return(
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
                                        <Tab eventKey="copy & paste" title="copy & paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImageUploadComponent callBack={florarImageUploadCallBackFunction}></FlorarImageUploadComponent>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0 p-2'>
                                                <div className='mt-3'>
                                                    <input type="file" multiple accept='image/*' className='full-width'/>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title="Choose from existing (0)" >
                                            <div className='border border-top-0  p-2'>
                                            {chooseExistingImages!=undefined&& chooseExistingImages.length>0&&chooseExistingImages.map((imagesData:any)=>{
                                                   return(
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