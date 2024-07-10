import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from "react";
import Example from "./FroalaCommnetBoxes";
import CommentBoxComponent from './CommentBoxComponent';
import UXFeedbackComponent from './UXFeedbackComponent';
import { Panel, PanelType } from "office-ui-fabric-react";
import Tooltip from '../Tooltip';
import FlorarImageUploadComponent from "../FlorarComponents/FlorarImageUploadComponent";
import moment from 'moment';
import { Web } from 'sp-pnp-js';
import { BiInfoCircle } from 'react-icons/bi';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Accordion, AccordionHeader,AccordionItem, AccordionPanel, AccordionToggleEventHandler, } from "@fluentui/react-components";
import Slider from 'react-slick';
var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <FaAngleLeft />,
    nextArrow: <FaAngleRight />
};

const UXDesignPopupTemplate = (props: any) => {
    const [openAddMoreImagePopup, setopenAddMoreImagePopup] = useState(false)
    const [imageIndex, setImageIndex]: any = useState()
    const [TaskImages, setTaskImages] = useState([]);
    const [openItems, setOpenItems] = React.useState(["1"]);
    let firstIndexData: any = [props?.data[0]]
    let copyTemplatesData: any = [];
    useEffect(() => {
        let secondIndex: any = []
        props?.data?.map((data: any, index: any) => {
            if (index > 0) {
                secondIndex.push(data)
            }

        })
        copyTemplatesData = secondIndex
    })


    const ObjectiveDataCallback = (objectiveData: any) => {
        firstIndexData = objectiveData
        if (copyTemplatesData?.length > 0) {
            props.DesignTemplatesCallback(firstIndexData.concat(copyTemplatesData))
        } else {
            props.DesignTemplatesCallback(firstIndexData)
        }

    }
    const setDesignNewTemplatesCallback = (TemplatesData: any) => {
        copyTemplatesData = []
        if (firstIndexData?.length > 0) {
            copyTemplatesData = firstIndexData.concat(TemplatesData);
        } else {
            copyTemplatesData = TemplatesData;
        }
        props.DesignTemplatesCallback(copyTemplatesData)
    }

    // ==============Add more image Function Start ====================


    const FlorarAddMoreImageComponentCallBack = (dt: any, imageIndex: any) => {
        let TaskImages = []
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg",
        };

        TaskImages.push(DataObject);
        if (dt.length > 0) {
            onUploadImageFunction(TaskImages, imageIndex, true);
        }
    }
    const onUploadImageFunction = async (imageList: any, addUpdateIndex: any, AddMoreImage: any) => {
        let lastindexArray = imageList[imageList.length - 1];
        let fileName: any = "";
        let tempArray: any = [];
        let SiteUrl = props?.EditData?.SiteUrl;
        let CurrentSiteName: any = '';
        if (props?.EditData?.siteType == "Offshore%20Tasks" || props?.EditData?.siteType == "Offshore Tasks") {
            CurrentSiteName = "SharewebQA";
        } else {
            CurrentSiteName = props?.EditData?.siteType;
        }

        imageList?.map(async (imgItem: any, index: number) => {
            if (imgItem.data_url != undefined && imgItem.file != undefined) {
                let date = new Date();
                let timeStamp = date.getTime();
                let imageIndex = addUpdateIndex + 2;
                fileName =
                    "T" +
                    props?.EditData?.Id +
                    "-Image" +
                    imageIndex +
                    "-" +
                    props?.EditData?.Title?.replace(/["/':?%]/g, "")?.slice(0, 40) +
                    " " +
                    timeStamp +
                    ".jpg";
                let currentUserDataObject: any;
                if (
                    props?.currentUserBackupArray != null &&
                    props?.currentUserBackupArray.length > 0
                ) {
                    currentUserDataObject = props?.currentUserBackupArray[0];
                }
                let ImgArray = {
                    ImageName: fileName,
                    UploadeDate: moment(new Date()).format("DD/MM/YYYY"),
                    imageDataUrl:
                        props?.EditData?.siteUrl +
                        "/Lists/" +
                        CurrentSiteName +
                        "/Attachments/" +
                        props?.EditData?.Id +
                        "/" +
                        fileName,
                    ImageUrl: props?.EditData?.siteUrl +
                        "/Lists/" +
                        CurrentSiteName +
                        "/Attachments/" +
                        props?.EditData?.Id +
                        "/" +
                        fileName,
                    UserImage:
                        currentUserDataObject != undefined &&
                            currentUserDataObject.Item_x0020_Cover?.Url?.length > 0
                            ? currentUserDataObject.Item_x0020_Cover?.Url
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                    UserName:
                        currentUserDataObject != undefined &&
                            currentUserDataObject.Title?.length > 0
                            ? currentUserDataObject.Title
                            : props?.Context?.pageContext._user.displayName,
                    Description:
                        imgItem.Description != undefined ? imgItem.Description : "",
                };
                tempArray.push(ImgArray);
            } else {
                imgItem.Description =
                    imgItem.Description != undefined ? imgItem.Description : "";
                tempArray.push(imgItem);
            }
        });
        tempArray?.map((tempItem: any) => {
            tempItem.Checked = false;
        });
        setTaskImages(tempArray);
        // UploadImageFunction(lastindexArray, fileName);
        if (addUpdateIndex != undefined) {
            let updateIndex: any = addUpdateIndex[0];
            let updateImage: any = imageList[updateIndex];

            UploadImageFunction(lastindexArray, fileName, tempArray, addUpdateIndex, AddMoreImage);

        }
    };
    const UploadImageFunction = (Data: any, imageName: any, DataJson: any, imageIndex: any, AddMoreImage: any): Promise<any> => {
        return new Promise<void>(async (resolve, reject) => {

            let listId = props?.EditData.listId;
            let listName = props?.EditData?.listName;
            let Id = props?.EditData?.Id;
            var src = Data.data_url?.split(",")[1];
            var byteArray = new Uint8Array(
                atob(src)
                    ?.split("")
                    ?.map(function (c) {
                        return c.charCodeAt(0);
                    })
            );
            const data = byteArray;
            var fileData = "";
            for (var i = 0; i < byteArray.byteLength; i++) {
                fileData += String.fromCharCode(byteArray[i]);
            }
            setTimeout(() => {
                if (props?.EditData?.listId != undefined) {
                    (async () => {
                        try {
                            let web = new Web(props?.EditData?.siteUrl);
                            let item = web.lists.getById(listId).items.getById(Id);
                            await item.attachmentFiles.add(imageName, data);
                            console.log("Attachment added");
                            console.log(DataJson)
                            console.log(TaskImages)
                            if (props?.data[0]?.setImagesInfo?.length > 0) {
                                props?.data[0]?.setImagesInfo.push(DataJson[0])
                            } else {
                                props.data[0].setImagesInfo = [];
                                props?.data[0].setImagesInfo.push(DataJson[0])
                            }

                        }
                        catch (error) {
                            reject(error);
                        }
                    })();
                } else {
                    (async () => {
                        try {
                            let web = new Web(props?.EditData?.siteUrl);
                            let item = web.lists.getByTitle(listName).items.getById(Id);
                            await item.attachmentFiles.add(imageName, data);
                            if (props?.data[0]?.setImagesInfo?.length > 0) {
                                props?.data[0]?.setImagesInfo.push(DataJson[0])
                            } else {
                                props.data[0].setImagesInfo = [];
                                props?.data[0]?.setImagesInfo.push(DataJson[0])
                            }

                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    })();
                }
            }, 2000);
        });
    };
    const AddMoreImages = (index: any) => {
        setImageIndex(index)
        setopenAddMoreImagePopup(true)
    }

    const UpdateMoreImage = () => {
        // UpdatedFeedBackParentArray = State;
        // UpdatedFeedBackParentArray[copyCurrentActiveTab].setImagesInfo.push(TaskImages[0])
        // designTemplatesArray=UpdatedFeedBackParentArray
        // setState(UpdatedFeedBackParentArray);
        // callBack(UpdatedFeedBackParentArray);
        setopenAddMoreImagePopup(false)
    }
    const onRenderCustomAddMoreImageHeader = () => {
        return (
            <div
                className="d-flex full-width pb-1"

            >
                <div className="subheading siteColor">Add More Image</div>
                <Tooltip ComponentId="12134" />
            </div>
        );
    };


    // ================End   more image Functionality ======================
    const handleToggle: AccordionToggleEventHandler<string> = (event, data) => {
        setOpenItems(data.openItems);
      };
    return (
        <>
            <div>

                <Accordion className='taskacordion' collapsible openItems={openItems}  onToggle={handleToggle} >
                    <AccordionItem value="1"  className='position-relative'>
                        <AccordionHeader className='objheader'> <span className='fw-semibold'>Objective</span></AccordionHeader>
                        <AccordionPanel>
                            <div>         <CommentBoxComponent
                                data={props?.data}
                                callBack={ObjectiveDataCallback}
                                allUsers={props?.allUsers}
                                ApprovalStatus={props?.ApprovalStatus}
                                SmartLightStatus={props?.SmartLightStatus}
                                SmartLightPercentStatus={props?.SmartLightPercentStatus}
                                Context={props?.Context}
                                FeedbackCount={props?.FeedbackCount}
                            />
                            <div className="AddImageFirstIndex text-end"  onClick={() => AddMoreImages(0)}>
                                <a className='hyperlink' > <span className="alignIcon hreflink mini svg__icon--Plus svg__iconbox " title="Add set"></span> Add Image</a>
                                 </div>
                               
                                <div>
                                    <div className={`carouselSlider taskImgTemplate ${props.data[0]?.setImagesInfo?.length == 1 ? "ArrowIconHide" : ""}`} >
                                        <Slider {...settings}>
                                            {props.data[0]?.setImagesInfo?.map((imgData: any, indeximage: any) => {

                                                return (
                                                    <div key={indeximage} className='carouselHeight'>
                                                        <img className="img-fluid"
                                                            alt={imgData?.ImageName}
                                                            src={imgData?.ImageUrl}
                                                            loading="lazy"
                                                        ></img>
                                                        <div className="Footerimg d-flex align-items-center justify-content-between p-1 ">
                                                            <div className='usericons'>

                                                                <div className="d-flex">

                                                                    <span className="mx-2" >{imgData?.UploadeDate}</span>
                                                                    <span className='round px-1'>
                                                                        {imgData?.UserImage != null && imgData?.UserImage != "" ?
                                                                            <img className='align-self-start hreflink ' title={imgData?.UserName} src={imgData?.UserImage} />
                                                                            : <span title={imgData?.UserName != undefined ? imgData?.UserName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
                                                                        }
                                                                    </span>
                                                                    {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                                                        <BiInfoCircle />
                                                                    </span>}

                                                                </div>
                                                            </div>
                                                            <div className="expandicon">

                                                                <span >
                                                                    {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>
                                                )



                                            })}
                                        </Slider>
                                    </div>

                                </div></div>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>


                <UXFeedbackComponent
                    textItems={props?.data}
                    callBack={setDesignNewTemplatesCallback}
                    allUsers={props?.allUsers}
                    ItemId={props?.EditData.Id}
                    EditData={props?.EditData}
                    SiteUrl={props?.EditData.ComponentLink}
                    ApprovalStatus={props?.ApprovalStatus}
                    SmartLightStatus={props?.SmartLightStatus}
                    SmartLightPercentStatus={props?.SmartLightPercentStatus}
                    Context={props?.Context}
                    FeedbackCount={props?.FeedbackCount}
                    TaskListDetails={props?.TaskListDetails}
                    taskCreatedCallback={props?.taskCreatedCallback}
                    UXStatus={props?.UXStatus}
                    currentUserBackupArray={props?.currentUserBackupArray}
                />
            </div>
            {/* ********************* this is Add more  Image panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomAddMoreImageHeader}
                isOpen={openAddMoreImagePopup}
                onDismiss={() => setopenAddMoreImagePopup(false)}
                isBlocking={true}
                type={PanelType.custom}
                customWidth="500px"
            >
                <div>
                    <div className="modal-body">
                        <FlorarImageUploadComponent callBack={FlorarAddMoreImageComponentCallBack} imageIndex={imageIndex}
                        />
                    </div>
                    <footer className="float-end mt-1">
                        <button
                            type="button"
                            className="btn btn-primary px-3 mx-1"
                            onClick={() => UpdateMoreImage()}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-default px-3"
                            onClick={() => setopenAddMoreImagePopup(false)}
                        >
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>
            {/**************End************************************* */}
        </>
    )
}
export default UXDesignPopupTemplate;