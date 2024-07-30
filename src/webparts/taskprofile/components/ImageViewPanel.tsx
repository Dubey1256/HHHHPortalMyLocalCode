import moment from 'moment';
import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import { Display, Tooltip } from "@fluentui/react-components";
import { useState, useEffect } from 'react'
import { BiInfoCircle } from 'react-icons/bi'
import * as globalCommon from '../../../globalComponents/globalCommon'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import Rating from 'react-rating';
import { Web } from 'sp-pnp-js';
import TooltipBuger from '../../../globalComponents/Tooltip';
import {Popover,PopoverTrigger,PopoverSurface,} from "@fluentui/react-components";
import { MdOutlineStarBorder, MdOutlineStar  } from 'react-icons/Md';
import { set } from '@microsoft/sp-lodash-subset';
 let checkDataImage:any=[];
 let copyAllImage:any=[];
const ImageViewPanel = (props: any) => {

    //===================slider functiona start=========================
    let sliderRef: any = React.useRef(null);
    var settings = {
        dots: false,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        pauseOnHover: false,
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const next = () => {
        sliderRef.slickNext();
    };
    //===================slider functiona End=========================
    const [allImageData, setAllImageData]: any = useState([])
    const [checked, setChecked] = useState(true);
    const [commentData, setCommentData] = useState("");
    const [prosConsStatus, setProsConsStatus] = useState({ status: false, index: 0 })
    const [commentStatus, setCommentStatus] = useState({ status: false, index: 0 })
    const [checkedImageData, SetCheckedImageData]: any = useState([])
    const [openImageRightSection, SetopenImageRightSection]: any = useState(true)
    const [iconSeleted, SetIconSeleted]: any = useState(true)
    const [updateComment, setUpdateComment]: any = useState({selectedData:{},CommentIndex:0,commentData:"",openPopup:false,status:""})
    const [hideLeftSection, SetHideLeftSection]: any = useState(false)
    const [rightSectionImage, SetRightSectionImage]: any = useState([])
    const [replyCommentData, setReplyCommentData] = useState("");
    const [isPopoverFilterOpen, setIsPopoverFilterOpen] = useState(false);
    const [isPopoverShortByOpen, setIsPopoverShortByOpen] = useState(false);
    const [isPopoverReplyOpen, setIsPopoverReplyOpen] = useState("");
    const [shortByFilterSelection, setShortByFilterSelection] = useState(false);
    
       //============= Open image right side function Start=============
    const openImageSection = (selectedTitle: any) => {
        SetRightSectionImage([...checkedImageData])
        checkDataImage=checkedImageData
        if(checkedImageData?.length==2){
        copyAllImage= copyAllImage?.filter((data:any)=>data?.ImageName!=props?.checkedImageData[0]?.ImageName)
        }
        SetIconSeleted(selectedTitle)
        SetopenImageRightSection(true)
    }
    //============= Open image right side function End ===========
    useEffect(() => {
        
        if (props?.AllImageData?.length > 0) {
            setAllImageData(JSON.parse(JSON.stringify(props?.AllImageData)));
            copyAllImage = JSON.parse(JSON.stringify(props?.AllImageData));
            if (props?.checkedImageData?.length > 0) {
                SetCheckedImageData(JSON.parse(JSON.stringify(props?.checkedImageData)))
                SetRightSectionImage(JSON.parse(JSON.stringify(props?.checkedImageData)))
                if(props?.checkedImageData?.length==1){
                     SetRightSectionImage(props?.checkedImageData)
                     checkDataImage=props?.checkedImageData
                      SetIconSeleted("fullScreen")
                      SetopenImageRightSection(true)
                }
                else if(props?.checkedImageData?.length==2){
                    SetRightSectionImage(props?.checkedImageData)
                    copyAllImage= copyAllImage?.filter((data:any)=>data?.ImageName!=props?.checkedImageData[0]?.ImageName)
                    SetIconSeleted("compare2")
                    SetopenImageRightSection(true)
                }
                else if(props?.checkedImageData?.length>2){
               SetRightSectionImage(props?.checkedImageData)
               checkDataImage=props?.checkedImageData
                    SetIconSeleted("compareSeveral")
                    SetopenImageRightSection(true)
                }
            }
        }
    }, [])

    //================== Star Rating ,Notes,Pros,Cons,fillHeart, function Start===================
    const changeFunction = (value: any, selectedData: any, label: any) => {
        let CopyAllImageData: any = [...allImageData];
        let RightImageSection: any = [...rightSectionImage]
        if (label == "Rating") {
           selectedData.ImageRating =  value ===   selectedData?.ImageRating ? 0 : value;
        } else if (label == "Notes") {
            selectedData.ImageNotes = value
        }
        else if (label == "Pros") {
            selectedData.ImagePros = value
        }
        else if (label == "Cons") {
            selectedData.ImageCons = value
        }
        else if (label == 'fillHeart') {
            selectedData.fillHeart = !selectedData.fillHeart;
        }
        else if (label == 'Exclude') {
            selectedData.Exclude =true;
        }
        else if (label == 'Restore') {
            selectedData.Exclude =false;
        }
        else if(label == 'showMore'){
            selectedData.showMore =true;   
        }

        let selectedIndex = CopyAllImageData.findIndex((item: any) => item.ImageName === selectedData?.ImageName);
        let rightSectionIndex = rightSectionImage?.findIndex((item: any) => item.ImageName === selectedData?.ImageName)
        if (selectedIndex != undefined) {
            CopyAllImageData[selectedIndex] = selectedData
        }
        if (rightSectionIndex != undefined) {
            RightImageSection[rightSectionIndex] = selectedData
            SetRightSectionImage(RightImageSection)
            checkDataImage=RightImageSection
        }
        setAllImageData(CopyAllImageData)
    }
 

    //================Star Rating ,Notes,Pros,Cons,fillHeart,function End=================

  
    const onRenderCustomAddMoreImageHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading siteColor"></div>
                <TooltipBuger ComponentId="8591"/>
            </div>
        );
    };
    const onRenderCustomHeadereditcomment = () => {
        return (
            <>
                <div className='subheading' >
                    Update Comment
                </div>
                {/* <GlobalTooltip ComponentId='1683' /> */}
            </>
        );
    };


    const ChangeTogalButton = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };


    // ===========checkbox function image  start=====================
    const handleCheckboxImagChange = (isChecked: any, data: any,) => {
        if (isChecked) {
            SetCheckedImageData([...checkedImageData, data]);
        } else {
            SetCheckedImageData(checkedImageData.filter((item: any) => item.ImageName !== data.ImageName));
        }
    }

    // ==================save Function strat============
    const saveImageView = async () => {
        allImageData?.map((imageData:any)=>{
            imageData.showMore =false;
        })
        let web = new Web(props?.AllListId?.siteUrl);
        const i = await web.lists
            .getByTitle(props?.AllListId?.listName)
            .items
            .getById(props?.taskData?.Id)
            .update({
                BasicImageInfo: JSON.stringify(allImageData),

            }).then((data: any) => {
                console.log(data)
                props?.SetOpenComparePopup(false)
            }).catch((error: any) => {
                console.log(error)
            });



    }

    //===================Save function End===============

    //==============All  Comment Functionality==================

    const closeEditPopup=()=>{
        setUpdateComment({selectedData:{},CommentIndex:0,commentData:"",openPopup:false,status:""})
        
    }
    const PostButtonClick = (selectedData: any) => {
        let txtComment = commentData
        let CopyAllImageData: any = [...allImageData]
        let RightImageSection: any = [...rightSectionImage]
        if (txtComment != '') {

            var temp: any = {
                AuthorImage: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['userImage'] : "",
                AuthorName: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['Title'] : "",

                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            if (selectedData["Comments"]?.length > 0) {
                selectedData.showMore =false;
                selectedData["Comments"].unshift(temp)
            } else {
                selectedData["Comments"] = [temp];
                selectedData.showMore =false;
            }

            let selectedIndex = CopyAllImageData.findIndex((item: any) => item.ImageName === selectedData?.ImageName);
            let rightSectionIndex = rightSectionImage?.findIndex((item: any) => item.ImageName === selectedData?.ImageName)
            if (rightSectionIndex != undefined) {
                RightImageSection[rightSectionIndex] = selectedData
                SetRightSectionImage(RightImageSection)
                checkDataImage=RightImageSection
            }
            if (selectedIndex != undefined) {
                CopyAllImageData[selectedIndex] = selectedData
            }
            setAllImageData(CopyAllImageData)

        }
        setCommentData("")
        setCommentStatus({ status: false, index: 0 })
    }
    const PostReplyComment=(selectedData:any,index:any,)=>{
        let txtComment = replyCommentData
        let CopyAllImageData: any = [...allImageData]
        let RightImageSection: any = [...rightSectionImage]
        if (txtComment != '') {

            var temp: any = {
                AuthorImage: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['userImage'] : "",
                AuthorName: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['Title'] : "",

                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            if (selectedData["Comments"]?.[index].ReplyMessages?.length > 0) {
                selectedData["Comments"]?.[index].ReplyMessages.unshift(temp)
            } else {
                selectedData["Comments"][index].ReplyMessages = [temp];
            }

            let selectedIndex = CopyAllImageData.findIndex((item: any) => item.ImageName === selectedData?.ImageName);
            let rightSectionIndex = rightSectionImage?.findIndex((item: any) => item.ImageName === selectedData?.ImageName)
            if (rightSectionIndex != undefined) {
                RightImageSection[rightSectionIndex] = selectedData
                SetRightSectionImage(RightImageSection)
                checkDataImage=RightImageSection
            }
            if (selectedIndex != undefined) {
                CopyAllImageData[selectedIndex] = selectedData
            }
            setAllImageData(CopyAllImageData)

        }
        setCommentData("")
        setIsPopoverReplyOpen("")
        setCommentStatus({ status: false, index: 0 })
    }
    const updateCommentFunction=()=>{
        let txtComment = updateComment?.commentData
        let CopyAllImageData: any = [...allImageData]
        let RightImageSection: any = [...rightSectionImage]
        if (txtComment != '') {

            var temp: any = {
                AuthorImage: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['userImage'] : "",
                AuthorName: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['Title'] : "",

                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            let selectedIndex = CopyAllImageData.findIndex((item: any) => item.ImageName === updateComment?.selectedData?.ImageName);
            let rightSectionIndex = rightSectionImage?.findIndex((item: any) => item.ImageName === updateComment?.selectedData?.ImageName)
            if (rightSectionIndex != undefined) {
                RightImageSection[rightSectionIndex].Comments[updateComment?.CommentIndex]= temp
                SetRightSectionImage(RightImageSection)
                checkDataImage=RightImageSection
            }
            if (selectedIndex != undefined) {
                CopyAllImageData[selectedIndex].Comments[updateComment?.CommentIndex]= temp
            }
            setAllImageData(CopyAllImageData)
            closeEditPopup()
        }
    }
    const clearComment=(selectedData:any,index:any,replyindex:any,useFor:any)=>{
        let CopyAllImageData: any = [...allImageData]
        let RightImageSection: any = [...rightSectionImage]
        // let selectedIndex = CopyAllImageData.findIndex((item: any) => item.ImageName === selectedData?.ImageName);
        let rightSectionIndex = rightSectionImage?.findIndex((item: any) => item.ImageName === selectedData?.ImageName)
        if(useFor=="Comment"){
            if (rightSectionIndex != undefined) {
               RightImageSection[rightSectionIndex].Comments.splice(index, 1,);
                SetRightSectionImage(RightImageSection)
                checkDataImage=RightImageSection
            }
            // if (selectedIndex != undefined) {
            // CopyAllImageData[selectedIndex].Comments= CopyAllImageData[selectedIndex]?.Comments.splice(index, 1,);
            // }
        }else{
            if (rightSectionIndex != undefined) {
            RightImageSection[rightSectionIndex].Comments[index].ReplyMessages.splice(replyindex, 1,);
                SetRightSectionImage(RightImageSection)
                checkDataImage=RightImageSection
            }
            // if (selectedIndex != undefined) {
            // CopyAllImageData[selectedIndex].Comments[index].ReplyMessages.splice(replyindex, 1,);
            // }
        }
        
        setAllImageData(CopyAllImageData);
        closeEditPopup()
    }
 

 //===============All  Comment Functionality End ==================

   //========================== shorting and Filter Functionality Start =======================

     const shortByFunction=(selectedShortBy:any)=>{
        setShortByFilterSelection(true)
        let CopyAllImageData: any = [...allImageData] 
     let RightImageSection: any = [...rightSectionImage]
        if(selectedShortBy=="Rating(L-H)"){
            RightImageSection.sort((a:any, b:any) => a.ImageRating - b.ImageRating);
        }
        else if(selectedShortBy=="Rating(H-L)"){
            RightImageSection.sort((a:any, b:any) => b.ImageRating - a.ImageRating);   
        }
        else if(selectedShortBy=="Date(Old-New)"){
            RightImageSection.sort((a:any, b:any) => new Date(a.UploadeDate).getTime() - new Date(b.UploadeDate).getTime());
           
        }
        else if(selectedShortBy=="Date(New-Old)"){
            RightImageSection.sort((a:any, b:any) => new Date(b.UploadeDate).getTime() - new Date(a.UploadeDate).getTime()); 
        }
        else if(selectedShortBy="Favorite"){
         RightImageSection = RightImageSection.filter((item: any) => item.fillHeart === true); 
        }
       
        SetRightSectionImage([...RightImageSection])
        checkDataImage=RightImageSection
        setIsPopoverFilterOpen(false)
        setIsPopoverShortByOpen(false)
     }
    const FilterByRating=(value:any)=>{
        let RightImageSection:any = [...checkDataImage]
        if(value ==5){
            RightImageSection = RightImageSection.filter((item: any) => item.ImageRating === 5); 
        }else{
            RightImageSection = RightImageSection.filter((item: any) => item.ImageRating >= value);   
        }
        SetRightSectionImage([...RightImageSection])
        setIsPopoverFilterOpen(false)
     }

    // ============== slider Image view function=====================
    React.useEffect(() => {
        if (isPopoverReplyOpen!='') {            
            const elements = document.getElementsByClassName('fui-PopoverSurface ___15k6l07_4rk8gh0');
            if (elements?.length > 1) {
                (elements[1] as HTMLElement).style.display = 'none';
            }
        }
    }, [isPopoverReplyOpen])
    const imageSlider = (allImageData: any) => {
        return (
            <div className="slider-container">
                <div className="carouselSlider">

                    <Slider ref={slider => (sliderRef = slider)} {...settings}>
                        {allImageData?.map((slide: any, index: any) => (
                            <div key={index} className={slide?.Exclude==true?"faded": ""}>
                                <img 
                                    src={slide?.ImageUrl}
                                    loading="lazy"
                                    className={`h-full w-full  ${slide?.fillHeart && "borderFavImage"}`}
                                />
                                <div>
                                    {checked && <div className='belowImageSection'>
                                        <div className='alignCenter justify-content-between' style={{ margin: '8px 0px' }}>
                                            <div className='starSection'>
                                                <Rating initialRating={slide?.ImageRating != undefined ? slide?.ImageRating : 0}
                                                    emptySymbol={<MdOutlineStarBorder />}
                                                    fullSymbol={<MdOutlineStar  />}
                                                   
                                                    onChange={(rate: any) => changeFunction(rate, slide, "Rating")}
                                                />

                                            </div>
                                            <div className='alignCenter'>
                                                {(slide?.Exclude ==undefined || slide?.Exclude ==false)  ? <a className='alignCenter mx-2' onClick={() => changeFunction('Exclude', slide, "Exclude")}>
                                                    <span className='svg__icon--cross svg__iconbox mini me-1' ></span>Exclude
                                                </a>:
                                                <a className='alignCenter mx-2 RestoreImage'onClick={() => changeFunction('Restore', slide, "Restore")}>
                                                    <span className='svg__icon--refresh svg__iconbox me-1'></span>Restore
                                                </a>}
                                                <a className='alignCenter mx-2 imageFavorite' onClick={() => changeFunction('fillHeart', slide, "fillHeart")}>

                                                    {slide?.fillHeart ? <BsFillHeartFill className='me-2 fillHeart'/> : <BsHeart className='me-1'  />}
                                                    Favorite</a>
                                            </div>

                                        </div>
                                        <div className='noteSection'>
                                            <div className='alignCenter justify-content-between'>
                                                <label className='fw-bold'>Notes:</label>
                                                <div className='alignCenter'>
                                                    <a className="alignCenter mx-2 siteColor" onClick={() => setProsConsStatus({ ...prosConsStatus, status: true, index: index })}>
                                                        {(prosConsStatus?.status && prosConsStatus?.index == index) || (slide?.ImagePros != undefined) ?
                                                            <svg xmlns="
                                                        http://www.w3.org/2000/svg"
                                                                width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <rect width="14" height="14" transform="translate(3 3)" fill="#000066" />
                                                                <line x1="7.5" y1="8.5" x2="12.5" y2="8.5" stroke="white" />
                                                                <line x1="10" y1="11" x2="10" y2="6" stroke="white" />
                                                                <line x1="7.5" y1="13.625" x2="12.5" y2="13.625" stroke="white" stroke-width="0.75" />
                                                            </svg>

                                                            : <span className='svg__icon--ProsCons svg__iconbox me-1'></span>
                                                        }
                                                        Add Pros/Cons</a>
                                                    <a className="alignCenter mx-2 siteColor" onClick={() => setCommentStatus({ ...commentStatus, status: true, index: index })}>
                                                        <span className='svg__icon--comment svg__iconbox me-1'></span>
                                                        Add Comment</a>
                                                </div>
                                            </div>
                                            <div className='NotesSection'>
                                                <textarea className='w-100' onChange={(e) => changeFunction(e?.target?.value, slide, "Notes")} value={slide?.ImageNotes} ></textarea>
                                            </div>
                                            {((prosConsStatus?.status && prosConsStatus?.index == index) || (slide?.ImagePros != undefined)) && <div className='ProsConsSection'>
                                                <div className='mt-2'>
                                                    <label className='fw-bold'>Pros:</label>
                                                    <textarea className='w-100' style={{ backgroundColor: '#DBEDDB' }} onChange={(e) => changeFunction(e?.target?.value, slide, "Pros")} value={slide?.ImagePros}></textarea>
                                                </div>
                                                <div className='mt-2'>
                                                    <label className='fw-bold'>Cons:</label>
                                                    <textarea className='w-100' style={{ backgroundColor: '#FFEAEA' }} onChange={(e) => changeFunction(e?.target?.value, slide, "Cons")} value={slide?.ImageCons}></textarea>
                                                </div>
                                            </div>}
                                            <div className='AddComment'>
                                                <div className='SpfxCheckRadio m-0'>
                                                    <div className="col">
                                                        {slide?.Comments != null && slide?.Comments?.length > 0 && slide?.Comments?.map((fbComment: any, k: any) => {
                                                            return <> <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col bg-f5f5 p-2  my-1 ${fbComment.isShowLight}` : "col bg-f5f5 p-2  my-1"} title={fbComment.isShowLight != undefined ? fbComment.isShowLight : ""}>
                                                                <div className="" style={{ display: (k > 1 && (slide?.showMore==undefined || slide?.showMore==false))? 'none ' : 'block' }}>
                                                                    <div className="d-flex p-0">
                                                                        <div className="col-1 p-0 wid30">
                                                                            {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink" onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)}
                                                                                src={fbComment.AuthorImage} /> :
                                                                                <span onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)} title={fbComment?.AuthorName != undefined ? fbComment?.AuthorName : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser"></span>}
                                                                        </div>
                                                                        <div className="col-11 pe-0" >
                                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                                {fbComment?.AuthorName} - {fbComment?.Created}
                                                                                <span className='d-flex'>
                                                                                    <Popover withArrow  open={isPopoverReplyOpen== `${index}${k}imageSlider`} onOpenChange={(e, data) => setIsPopoverReplyOpen(`${index}${k}imageSlider`)}>
                                                                                        <PopoverTrigger disableButtonEnhancement>
                                                                                            <span className="svg__iconbox svg__icon--reply"></span>
                                                                                        </PopoverTrigger>

                                                                                        <PopoverSurface tabIndex={-1}>
                                                                                           <div>
                                                                                            <div className='subheading m-0' style={{minWidth:'250px'}}>Reply Comment</div>
                                                                                            <div className='my-2'>
                                                                                            <textarea className='w-100' onChange={(e)=>setReplyCommentData(e?.target?.value)}></textarea>
                                                                                            </div>
                                                                                           </div>
                                                                                           <div className='footer text-end'>
                                                                                            <button className='btnCol btn me-2 btn-primary' onClick={()=>PostReplyComment(slide,k)}>Save</button>
                                                                                            <button className='btnCol btn btn-default'onClick={()=>setIsPopoverReplyOpen('')}>Cancel</button>
                                                                                           </div>
                                                                                        </PopoverSurface>
                                                                                    </Popover>
                                                                                   
                                                                                    <a title='Edit'
                                                                                    onClick={() => setUpdateComment(
                                                                                        {...updateComment,selectedData:slide,CommentIndex:k,commentData:fbComment?.Title,openPopup:true,status:"commentUpdate"})}
                                                                                    ><span className='svg__iconbox svg__icon--edit'></span></a>
                                                                                    <a title='Delete' onClick={() => clearComment(slide,k,null,"Comment")}><span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                </span>
                                                                            </div>
                                                                            <div><span >{fbComment?.Title}</span></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 ps-3 pe-0 mt-1">
                                                                        {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                                            return (
                                                                                <div className="d-flex border ms-3 p-2  mb-1">
                                                                                    <div className="col-1 p-0 wid30">
                                                                                        {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, replymessage?.AuthorName, props?.taskUsers)}
                                                                                            src={replymessage?.AuthorImage} /> : <span title={replymessage?.AuthorName != undefined ? replymessage?.AuthorName : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser" ></span>}
                                                                                    </div>
                                                                                    <div className="col-11 pe-0" >
                                                                                        <div className='d-flex justify-content-between align-items-center'>
                                                                                            {replymessage?.AuthorName} - {replymessage?.Created}
                                                                                            <span className='d-flex'>
                                                                                                <a title='Edit'
                                                                                                 onClick={() => setUpdateComment(
                                                                                                    {...updateComment,selectedData:slide,CommentIndex:index,commentData:replymessage?.Title,openPopup:true,status:"replyUpdate"})}
                                                                                                 
                                                                                                ><span className='svg__iconbox svg__icon--edit'></span>
                                                                                                </a>
                                                                                                <a title='Delete' onClick={() => clearComment(slide,k,index,"ReplyComment")}
                                                                                                ><span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                            </span>
                                                                                        </div>
                                                                                        <div><span>{replymessage?.Title}</span></div>
                                                                                    </div>
                                                                                </div>

                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        
                                                             </>
                                                        })}
                                                         { (slide?.Comments != null && slide?.Comments?.length > 2) && <button type="button" className="btn btn-primary btnCol ms-2" onClick={() => changeFunction(true, slide, "showMore")}>See More</button>}
                                                    </div>
                                                    {commentStatus?.status && commentStatus?.index === index && <div className="align-items-center d-flex" >
                                                        <textarea id="txtComment" onChange={(e) => setCommentData(e.target?.value)} className="form-control full-width"></textarea>
                                                        <button type="button" className="btn btn-primary btnCol ms-2" onClick={() => PostButtonClick(slide)}>Post</button>
                                                    </div>}
                                                </div>

                                            </div>

                                        </div>
                                    </div>}
                                </div>

                            </div>
                        ))}
                    </Slider>

                </div>

            </div>
        )
    }

    //========slider Image view  End ==============

    // ==========Single image view function where we show the particular image ===================

    const singleImageView = (slide: any, index: any) => {
        return (
            <div className={slide?.Exclude ==true?'faded' : ""}>
                <img src={slide?.ImageUrl} className={`w-100 ${slide?.fillHeart && "borderFavImage"}`} />
                <div>
                    {checked && <div className='belowImageSection'>
                        <div className='alignCenter justify-content-between' style={{ margin: '8px 0px' }}>
                            <div className='starSection'>
                                <Rating initialRating={slide?.ImageRating != undefined ? slide?.ImageRating : 0}
                                    
                                    emptySymbol={<MdOutlineStarBorder />}
                                    fullSymbol={<MdOutlineStar  />}
                                     onChange={(rate: any) => changeFunction(rate, slide, "Rating")}
                                />

                            </div>
                            <div className='alignCenter'>
                            {(slide?.Exclude ==undefined || slide?.Exclude ==false)  ? <a className='alignCenter mx-2' onClick={() => changeFunction('Exclude', slide, "Exclude")}>
                                                    <span className='svg__icon--cross svg__iconbox me-1 mini' ></span>Exclude
                                                </a>:
                                                <a className='alignCenter mx-2 RestoreImage'onClick={() => changeFunction('Restore', slide, "Restore")}>
                                                    <span className='svg__icon--refresh svg__iconbox me-1'></span>Restore
                                                </a>}
                                <a className='alignCenter mx-2 imageFavorite'>

                                    {slide?.fillHeart ? <BsFillHeartFill className='me-2 fillHeart' onClick={() => changeFunction('fillHeart', slide, "fillHeart")} /> : <BsHeart className='me-1' onClick={() => changeFunction('fillHeart', slide, "fillHeart")} />}
                                    Favorite</a>
                            </div>

                        </div>
                        <div className='noteSection'>
                            <div className='alignCenter justify-content-between'>
                                <label className='fw-bold'>Notes:</label>
                                <div className='alignCenter'>
                                    <a className="alignCenter mx-2" onClick={() => setProsConsStatus({ ...prosConsStatus, status: true, index: index })}>
                                        {(prosConsStatus?.status && prosConsStatus?.index == index) || (slide?.ImagePros != undefined) ?
                                            <svg xmlns="
                                                        http://www.w3.org/2000/svg"
                                                width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <rect width="14" height="14" transform="translate(3 3)" fill="#000066" />
                                                <line x1="7.5" y1="8.5" x2="12.5" y2="8.5" stroke="white" />
                                                <line x1="10" y1="11" x2="10" y2="6" stroke="white" />
                                                <line x1="7.5" y1="13.625" x2="12.5" y2="13.625" stroke="white" stroke-width="0.75" />
                                            </svg>

                                            : <span className='svg__icon--ProsCons svg__iconbox me-1'></span>
                                        }
                                        Add Pros/Cons</a>
                                    <a className="alignCenter mx-2" onClick={() => setCommentStatus({ ...commentStatus, status: true, index: index })}>
                                        <span className='svg__icon--comment svg__iconbox me-1'></span>
                                        Add Comment</a>
                                </div>
                            </div>
                            <div className='NotesSection'>
                                <textarea className='w-100' onChange={(e) => changeFunction(e?.target?.value, slide, "Notes")} value={slide?.ImageNotes} ></textarea>
                            </div>
                            {((prosConsStatus?.status && prosConsStatus?.index == index) || (slide?.ImagePros != undefined)) && <div className='ProsConsSection'>
                                <div className='mt-2'>
                                    <label className='fw-bold'>Pros:</label>
                                    <textarea className='w-100' style={{ backgroundColor: '#DBEDDB' }} onChange={(e) => changeFunction(e?.target?.value, slide, "Pros")} value={slide?.ImagePros}></textarea>
                                </div>
                                <div className='mt-2'>
                                    <label className='fw-bold'>Cons:</label>
                                    <textarea className='w-100' style={{ backgroundColor: '#FFEAEA' }} onChange={(e) => changeFunction(e?.target?.value, slide, "Cons")} value={slide?.ImageCons}></textarea>
                                </div>
                            </div>}
                            <div className='AddComment'>
                                <div className='SpfxCheckRadio m-0'>
                                    <div className="col">
                                        {slide?.Comments != null && slide?.Comments?.length > 0 && slide?.Comments?.map((fbComment: any, k: any) => {
                                            return <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col bg-f5f5 p-2  my-1 ${fbComment.isShowLight}` : "col bg-f5f5 p-2  my-1"} title={fbComment.isShowLight != undefined ? fbComment.isShowLight : ""}>
                                                <div className="" style={{ display: (k > 1 && (slide?.showMore==undefined || slide?.showMore==false ))? 'none ' : 'block' }}>
                                                    <div className="d-flex p-0">
                                                        <div className="col-1 p-0 wid30">
                                                            {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)}
                                                                src={fbComment.AuthorImage} /> :
                                                                <span onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)} title={fbComment?.AuthorName != undefined ? fbComment?.AuthorName : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser"></span>}
                                                        </div>
                                                        <div className="col-11 pe-0" >
                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                {fbComment?.AuthorName} - {fbComment?.Created}
                                                             
                                                                <span className='d-flex'>
                                                                    <Popover withArrow open={isPopoverReplyOpen== `${index}${k}singleImageView`} onOpenChange={(e, data) => setIsPopoverReplyOpen(`${index}${k}singleImageView`)} >
                                                                        <PopoverTrigger disableButtonEnhancement>
                                                                            <span className="svg__iconbox svg__icon--reply"></span>
                                                                        </PopoverTrigger>

                                                                        <PopoverSurface tabIndex={-1}>
                                                                            <div>
                                                                                <div className='subheading m-0' style={{ minWidth: '250px' }}>Reply Comment</div>
                                                                                <div className='my-2'>
                                                                                    <textarea className='w-100' onChange={(e) => setReplyCommentData(e?.target?.value)}></textarea>
                                                                                </div>
                                                                            </div>
                                                                            <div className='footer text-end'>
                                                                                <button className='btnCol btn me-2 btn-primary' onClick={() => PostReplyComment(slide, k)}>Save</button>
                                                                                <button className='btnCol btn btn-default'  onClick={()=>setIsPopoverReplyOpen('')} >Cancel</button>
                                                                            </div>
                                                                        </PopoverSurface>
                                                                    </Popover>

                                                                    <a title='Edit'
                                                                        onClick={() => setUpdateComment(
                                                                            { ...updateComment, selectedData: slide, CommentIndex: k, commentData: fbComment?.Title, openPopup: true, status: "commentUpdate" })}
                                                                    >
                                                                        <span className='svg__iconbox svg__icon--edit'></span>
                                                                    </a>
                                                                    <a title='Delete'
                                                                        onClick={() => clearComment(slide, k, null, "Comment")}
                                                                    >
                                                                        <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                </span>
                                                            </div>
                                                            <div><span >{fbComment?.Title}</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 ps-3 pe-0 mt-1">
                                                        {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                            return (
                                                                <div className="d-flex border ms-3 p-2  mb-1">
                                                                    <div className="col-1 p-0 wid30">
                                                                        {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, replymessage?.AuthorName, props?.taskUsers)}
                                                                            src={replymessage?.AuthorImage} /> : <span title={replymessage?.AuthorName != undefined ? replymessage?.AuthorName : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser" ></span>}
                                                                    </div>
                                                                    <div className="col-11 pe-0" >
                                                                        <div className='d-flex justify-content-between align-items-center'>
                                                                            {replymessage?.AuthorName} - {replymessage?.Created}
                                                                            <span className='d-flex'>
                                                                                <a title='Edit'
                                                                                    onClick={() => setUpdateComment(
                                                                                        { ...updateComment, selectedData: slide, CommentIndex: index, commentData: replymessage?.Title, openPopup: true, status: "replyUpdate" })}

                                                                                >
                                                                                    <span className='svg__iconbox svg__icon--edit'></span>
                                                                                </a>
                                                                                <a title='Delete'
                                                                                    onClick={() => clearComment(slide, k, index, "ReplyComment")}
                                                                                >
                                                                                    <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                            </span>
                                                                        </div>
                                                                        <div><span>{replymessage?.Title}</span></div>
                                                                    </div>
                                                                </div>

                                                            )
                                                        })}
                                                    </div>
                                                </div>


                                            </div>


                                        })}
                                          { (slide?.Comments != null && slide?.Comments?.length > 2) && <button type="button" className="btn btn-primary btnCol ms-2" onClick={() => changeFunction(true, slide, "showMore")}>See More</button>}
                                    </div>
                                    {commentStatus?.status && commentStatus?.index === index && <div className="align-items-center d-flex" >
                                        <textarea id="txtComment" onChange={(e) => setCommentData(e.target?.value)} className="form-control full-width"></textarea>
                                        <button type="button"className='btn btn-primary btnCol ms-2' onClick={() => PostButtonClick(slide)}>Post</button>
                                    </div>}
                                </div>

                            </div>

                        </div>
                    </div>}
                </div>
            </div>
        )
    }

// ==========Single image view function where we show the particular image End ===================
    return (
        <>

            <Panel
                onRenderHeader={onRenderCustomAddMoreImageHeader}
                isOpen={true}
                onDismiss={() => props?.SetOpenComparePopup(false)}
                isBlocking={true}
                type={PanelType?.smallFluid}
            >

                <div className="mt-2 d-flex mb-5">
                    <div className="Taskaddcomment UXImageLeftSection" style={{display:hideLeftSection?"none":"block"}}>
                        {allImageData?.length > 0 &&
                            <div className="p-0">
                                <label className='form-label alignCenter mb-2 full-width fw-bold'>Images
                                    <div className='alignCenter ml-auto gap-1'>
                                        <Tooltip
                                            withArrow
                                            content="Full-Screen View"
                                            relationship="label" positioning="below"
                                        >

                                            <span onClick={() => openImageSection("fullScreen")} className={`svg__iconbox svg__icon--${checkedImageData?.length <= 1 ? 'FilledfullScreen siteColor' : "fullScreen"}`}></span>
                                           
                                        </Tooltip>
                                        <Tooltip
                                            withArrow
                                            content="Compare 2 Images"
                                            relationship="label"
                                            positioning="below"
                                        >
                                            <span onClick={() => openImageSection("compare2")} className={`svg__iconbox svg__icon--${checkedImageData?.length == 2 ? 'Filledcompare2 siteColor ' : "compare2"}`}></span>
                                        </Tooltip>
                                        <Tooltip
                                            withArrow
                                            content="Compare Several Images"
                                            relationship="label" positioning="below"
                                        >

                                            <span onClick={() => openImageSection("compareSeveral")} className={`svg__iconbox svg__icon--${(checkedImageData?.length == 3 || checkedImageData?.length == 4) ? 'FilledcompareSeveral siteColor' : "compareSeveral"}`}></span>
                                        </Tooltip>
                                        <Tooltip
                                            withArrow
                                            content="View All"
                                            relationship="label" positioning="below"
                                        >

                                            <span onClick={() => openImageSection("viewAll")} className={`svg__iconbox svg__icon--${(checkedImageData?.length > 4) ? 'FilledviewAll siteColor' : "viewAll"}`}></span>
                                        </Tooltip>
                                        <span onClick={()=>SetHideLeftSection(true)} className="svg__iconbox svg__icon--arrowCollapse"></span>
                                    </div>
                                </label>

                                {allImageData != null && allImageData?.map((imgData: any, i: any) => {
                                    const isChecked = checkedImageData.some((item: any) => item.ImageName === imgData.ImageName);
                                    return <div className="taskimage p-0 mb-3">
                                        <div className='input-group'>
                                            <input className='form-check-input me-1'
                                                type="checkbox"
                                                id={`checkbox-${i}`}
                                                name={`checkbox-${i}`}
                                                value={imgData?.ImageName}
                                                checked={isChecked}

                                                onChange={(e) => handleCheckboxImagChange(e.target.checked, imgData)}
                                            />
                                            {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                        </div>

                                        <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                            <img alt={imgData?.ImageName} src={imgData?.ImageUrl}>
                                            </img>
                                        </a>


                                        <div className="Footerimg d-flex align-items-center justify-content-between p-1 ">
                                            <div className='usericons'>
                                                <span>
                                                    <span >{imgData?.UploadeDate}</span>
                                                    <span className='round px-1'>
                                                        {imgData?.UserImage != null && imgData?.UserImage != "" ?
                                                            <img className='align-self-start hreflink ' title={imgData?.UserName} onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, imgData?.UserName, props?.taskUsers)} src={imgData?.UserImage} />
                                                            : <span title={imgData?.UserName != undefined ? imgData?.UserName : "Default user icons"} onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, imgData?.UserName, props?.taskUsers)} className="alignIcon svg__iconbox svg__icon--defaultUser"></span>
                                                        }
                                                    </span>
                                                    {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                                        <BiInfoCircle />
                                                    </span>}

                                                </span>
                                            </div>
                                            <div className="expandicon">
                                                <span >
                                                    {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                })}
                            </div>}


                    </div>
                    <div className="UXImageRightSection" style={{width:hideLeftSection?"100%":""}}>
                        {openImageRightSection && <div className='bg-white p-0 mb-3'>
                           
                            <div className='alignCenter justify-content-between mb-1'>
                                <div className="toggleButon alignCenter">
                            {hideLeftSection && <span  onClick={()=>SetHideLeftSection(false)} className="openLeftSection svg__iconbox svg__icon--arrowExpand"></span>}

                                   <span className='me-1'>Image Details</span>
                                            <label className="switch me-2" htmlFor="checkbox">
                                                <input checked={checked}   onChange={ChangeTogalButton} type="checkbox" id="checkbox" />
                                                {checked === true ? <div className="slider round"></div> : <div  className="slider round"></div>}
                                            </label>
                                   
                                </div>
                                <span className='alignCenter ml-auto'>
                                <div className={`${(rightSectionImage?.length==1 && shortByFilterSelection==false)?'alignCenter me-5 DisableFilterSorting':'alignCenter me-5'}`}>
                             <Popover withArrow open={isPopoverShortByOpen} onOpenChange={(e, data) => setIsPopoverShortByOpen(data.open)} >
                                    <PopoverTrigger disableButtonEnhancement>
                                    <span className='alignCenter  me-4'> <span className="svg__iconbox svg__icon--Switcher" title="Sort by"></span>Sort by</span>
                                    </PopoverTrigger>
                                    <PopoverSurface tabIndex={-1}>
                                        <div>
                                            <div className='Filterhead m-0 d-flex justify-content-between fw-bold '>
                                            Sort by
                                                <span className='svg__iconbox svg__icon--cross dark' onClick={()=>setIsPopoverShortByOpen(false)} ></span>
                                            </div>
                                            <div className='mt-2'>
                                               <div onClick={()=>shortByFunction("Rating(L-H)")} className='hreflink'>Rating(Lowest to Highest)</div>
                                               <div onClick={()=>shortByFunction("Rating(H-L)")} className='my-2 hreflink'>Rating(Highest to Lowest)</div>
                                               <div onClick={()=>shortByFunction("Date(Old-New)")}className='hreflink'>Date(Oldest to Newest)</div>
                                               <div onClick={()=>shortByFunction("Date(New-Old)")}className='mt-2 hreflink'>Date(Newest to Oldest)</div>
                                            </div>
                                        </div>
                                       
                                    </PopoverSurface>
                                </Popover>
                               <Popover withArrow open={isPopoverFilterOpen} onOpenChange={(e, data) => setIsPopoverFilterOpen(data.open)} >
                                    <PopoverTrigger disableButtonEnhancement>
                                        <span className='alignCenter'><span className="svg__iconbox svg__icon--filter" title="Filter"></span>Filter</span>
                                    </PopoverTrigger>

                                    <PopoverSurface tabIndex={-1}>
                                        <div>
                                            <div className='Filterhead m-0 d-flex justify-content-between fw-bold '>
                                                Filter
                                                <span className='svg__iconbox svg__icon--cross dark' onClick={()=>setIsPopoverFilterOpen(false)} ></span>
                                            </div>
                                            <div className='mt-2'>
                                               <label onClick={()=>shortByFunction("Favorite")} className="label-hover showFav">Show Favorite</label>
                                               <div className='ratingFilter'>
                                               <label className="mt-1 label-hover">Show Rating By Stars</label>
                                               <div className='SpfxCheckRadio m-0 ps-3 py-1'>
                                                  <input type="radio" className='radio' onClick={()=>FilterByRating(5)} /> Only 5
                                                </div>
                                                <div className='SpfxCheckRadio m-0 ps-3'>
                                                  <input type="radio" className='radio' onClick={()=>FilterByRating(4)} /> 4+
                                                </div>
                                                <div className='SpfxCheckRadio m-0 ps-3 py-1'>
                                                  <input type="radio" className='radio' onClick={()=>FilterByRating(3)}/> 3+
                                                </div>
                                                <div className='SpfxCheckRadio m-0 ps-3'>
                                                  <input type="radio" className='radio' onClick={()=>FilterByRating(2)}/> 2+
                                                </div>
                                                <div className='SpfxCheckRadio m-0 ps-3 py-1'>
                                                  <input type="radio" className='radio' onClick={()=>FilterByRating(1)}/> 1+
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </PopoverSurface>
                                </Popover></div>
                               {checkedImageData?.length <=2 && <div className='playpausebutton'>
                                    <span onClick={previous} className='svg__icon--arrowLeft svg__iconbox'></span>
                                    <span className="svg__icon--arrowRight svg__iconbox" onClick={next}></span>
                                </div>}
                               </span>
                            </div>
                            {iconSeleted == "fullScreen" && imageSlider(allImageData)}
                            {iconSeleted == "compare2" && <div className='CompareSection col-sm-12 row'>
                                <div className='col-sm-6'>{singleImageView(rightSectionImage[0], 0)}</div>
                                <div className='col-sm-6'>{imageSlider(copyAllImage)} </div>
                            </div>}
                            {(iconSeleted == "compareSeveral" || iconSeleted == "viewAll") && <div className='CompareSection col-sm-12 row'>
                                {rightSectionImage?.map((checkData: any, index: any) => {
                                    return (
                                        <div className={hideLeftSection?`${(checkData?.Exclude !=undefined  &&  checkData?.Exclude ==true) ? ' col-sm-4 faded':' col-sm-4'}`:`${(checkData?.Exclude !=undefined &&  checkData?.Exclude ==true)? 'col-sm-6  faded':"col-sm-6 "}`}>{singleImageView(checkData, index)} </div>
                                    )

                                })}

                            </div>}


                        </div>}
                    </div>
                </div>
                <footer className='bg-f4 fixed-bottom p-3 text-end'>
                    <button type='button' className='btn btn-primary mx-2' onClick={() => saveImageView()}>Save</button>
                    <button type='button' className='btn btn-default' onClick={() => props?.SetOpenComparePopup(false)}>Cancel</button>
                </footer>

                {updateComment?.openPopup  && 
                <Panel
                onRenderHeader={onRenderCustomHeadereditcomment}
                isOpen={ updateComment?.openPopup }
                onDismiss={closeEditPopup}
                isBlocking={false}
            >
                <div className="modal-body">
                    <div className='col'>
                        <textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => setUpdateComment({...updateComment,commentData:e?.target?.value})} >{updateComment?.commentData}</textarea>
                    </div>
                </div>
                <footer className='modal-footer mt-2'>
                    <button className="btn btn-primary ms-1" onClick={(e) => updateCommentFunction()}>Save</button>
                    <button className='btn btn-default ms-1' onClick={closeEditPopup}>Cancel</button>
                </footer>
            </Panel>}
            </Panel>
        </>

    )
}
export default ImageViewPanel;