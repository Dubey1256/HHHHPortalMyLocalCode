import moment from 'moment';
import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";

import * as globalCommon from '../../../globalComponents/globalCommon'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BiInfoCircle } from 'react-icons/bi';
import Tooltip from '../../../globalComponents/Tooltip';
let arrayOfChar = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',]
const CompareSetData = (props: any) => {

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
   
    //===================slider functiona End=========================
   
    const onRenderCustomAddMoreImageHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading siteColor"></div>
                {/* <Tooltip ComponentId="8591"/> */}
            </div>
        );
    };
    const cleanHTML = (html: any, folora: any, index: any) => {
        if (html != undefined) {
            html = globalCommon?.replaceURLsWithAnchorTags(html)
            const div = document.createElement('div');
            div.innerHTML = html;
            const paragraphs = div.querySelectorAll('p');
            // Filter out empty <p> tags
            paragraphs.forEach((p) => {
                if (p.innerText.trim() === '') {
                    p.parentNode.removeChild(p); // Remove empty <p> tags
                }
            });
            div.innerHTML = div.innerHTML.replace(/\n/g, '<br>')  // Convert newlines to <br> tags first
            div.innerHTML = div.innerHTML.replace(/(?:<br\s*\/?>\s*)+(?=<\/?[a-z][^>]*>)/gi, '');


            return div.innerHTML;
        }

    };
const showSetData=(designtempateData:any ,indexdesign:any)=>{
   return(
    <>

           <div className={`carouselSlider taskImgTemplate ${designtempateData?.setImagesInfo?.length == 1 ? "ArrowIconHide" : ""}`} >
               <Slider {...settings}>
                   {designtempateData?.setImagesInfo?.map((imgData: any, indeximage: any) => {

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
                                                   <img className='align-self-start hreflink ' title={imgData?.UserName} src={imgData?.UserImage} onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, imgData?.UserName, props?.taskUsers)} />
                                                   : <span title={imgData?.UserName != undefined ? imgData?.UserName : "Default user icons"} onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, imgData?.UserName, props?.taskUsers)} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
                                               }
                                           </span>
                                           {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                               <BiInfoCircle />
                                           </span>}

                                       </div>
                                   </div>
                                   <div className="expandicon">

                                       <span >
                                           {imgData?.ImageName?.length > 50 ? imgData?.ImageName.substring(0, 50) + '...' : imgData?.ImageName}
                                       </span>

                                   </div>

                               </div>

                           </div>
                       )



                   })}
               </Slider>
           </div>

           {designtempateData?.TemplatesArray?.map((fbData: any, i: any) => {
               try {
                   if (fbData?.Title != undefined) {
                       fbData.Title = fbData?.Title?.replace(/\n/g, '<br>');

                   }
               } catch (e) {
               }
               return (

                   <div className='bg-white p-2 rounded-1'>
                       <div className="col mb-2">
                           <div className='justify-content-between d-flex'>
                               <div className="alignCenter m-0">
                                   {props?.ApprovalStatus ?
                                       <span className="alignCenter">
                                           <span title="Rejected"
                                               // onClick={() => changeTrafficLigth(i, "Reject",'tab')}
                                               className={fbData['isShowLight'] == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                           >
                                           </span>
                                           <span
                                               // onClick={() => changeTrafficLigth(i, "Maybe",'tab')}
                                               title="Maybe" className={fbData['isShowLight'] == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                           </span>
                                           <span title="Approved"
                                               // onClick={() => changeTrafficLigth(i, "Approve",'tab')}
                                               className={fbData['isShowLight'] == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                           </span>
                                           {fbData["ApproverData"] != undefined && fbData.ApproverData?.length > 0 &&
                                               <>
                                                   <span className="siteColor ms-2 hreflink" title="Approval-History Popup"
                                                   //  onClick={() => ShowApprovalHistory(fbData, i, null)}
                                                   >
                                                       {fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={fbData.ApproverData[fbData.ApproverData.length - 1]?.Title}><span><a onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Id,)} target="_blank" data-interception="off" title={fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Title}>
                                                           <img className='imgAuthor hreflink ' src={fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.ImageUrl} />
                                                       </a>
                                                       </span></a></span>
                                               </>

                                           }
                                       </span>
                                       : null
                                   }
                               </div>
                               {/* <div className='m-0'>
                                            <span className="d-block">
                                                <a className="siteColor" style={{ cursor: 'pointer' }}
                                                 onClick={(e) => showhideCommentBox(i,'tab')}
                                                 >Add Comment</a>
                                            </span>
                                        </div> */}
                           </div>


                           <div className="d-flex p-0 FeedBack-comment ">
                               <div className="border p-1 me-1">
                                   <span>{arrayOfChar[indexdesign] + "." + (i + 1)}.</span>
                                   <ul className='list-none'>
                                       <li>
                                           {fbData['Completed'] != null && fbData['Completed'] &&

                                               <span className="svg__iconbox svg__icon--tick"></span>
                                           }
                                       </li>
                                       <li>
                                           {fbData['HighImportance'] != null && fbData['HighImportance'] &&
                                               <span className="svg__iconbox svg__icon--taskHighPriority"></span>
                                           }
                                       </li>
                                       <li>
                                           {fbData['LowImportance'] != null && fbData['LowImportance'] &&
                                               <span className="svg__iconbox svg__icon--lowPriority"></span>
                                           }
                                       </li>
                                       <li>
                                           {fbData['Phone'] != null && fbData['Phone'] &&
                                               <span className="svg__iconbox svg__icon--phone"></span>
                                           }
                                       </li>
                                   </ul>
                               </div>

                               <div className="border p-2 full-width text-break">

                                   <span dangerouslySetInnerHTML={{ __html: cleanHTML(fbData?.Title, "folora", i) }}></span>
                                   <div className="col">
                                       {fbData['Comments'] != null && fbData['Comments']?.length > 0 && fbData['Comments']?.map((fbComment: any, k: any) => {
                                           return <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col add_cmnt my-1 ${fbComment.isShowLight}` : "col add_cmnt my-1"} title={fbComment.isShowLight != undefined ? fbComment.isShowLight : ""}>
                                               <div className="">
                                                   <div className="d-flex p-0">
                                                       <div className="col-1 p-0 wid30">
                                                           {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)}
                                                               src={fbComment.AuthorImage} /> :
                                                               <span onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)} title={fbComment?.AuthorName != undefined ? fbComment?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>}
                                                       </div>
                                                       <div className="col-11 pe-0" >
                                                           <div className='d-flex justify-content-between align-items-center'>
                                                               {fbComment?.AuthorName} - {fbComment?.Created}
                                                               {/* <span className='d-flex'>
                                                                            <a className="ps-1" title="Comment Reply" >
                                                                                <div data-toggle="tooltip" id={buttonId + "-" + i + k + "tab"}
                                                                                    onClick={() => openReplycommentPopup(i, k,'tab')}
                                                                                    data-placement="bottom"
                                                                                >
                                                                                    <span className="svg__iconbox svg__icon--reply"></span>
                                                                                </div>
                                                                            </a>
                                                                            <a title='Edit'
                                                                                onClick={() => openEditModal(fbComment, k, 0, false, i,'tab')}
                                                                            >
                                                                                <span className='svg__iconbox svg__icon--edit'></span>
                                                                            </a>
                                                                            <a title='Delete'
                                                                                onClick={() =>clearComment(false, k, 0, i,'tab')}
                                                                            >
                                                                                <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                        </span> */}
                                                           </div>
                                                           <div><span dangerouslySetInnerHTML={{ __html: cleanHTML(fbComment?.Title, null, i) }}></span></div>
                                                       </div>
                                                   </div>
                                                   <div className="col-12 ps-3 pe-0 mt-1">
                                                       {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                           return (
                                                               <div className="d-flex border ms-3 p-2  mb-1">
                                                                   <div className="col-1 p-0 wid30">
                                                                       {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, replymessage?.AuthorName, props?.taskUsers)}
                                                                           src={replymessage?.AuthorImage} /> : <span title={replymessage?.AuthorName != undefined ? replymessage?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser" ></span>}
                                                                   </div>
                                                                   <div className="col-11 pe-0" >
                                                                       <div className='d-flex justify-content-between align-items-center'>
                                                                           {replymessage?.AuthorName} - {replymessage?.Created}
                                                                           {/* <span className='d-flex'>
                                                                                        <a title='Edit'
                                                                                            onClick={() => EditReplyComment(replymessage, k, 0, false, i, index,'tab')
                                                                                            }
                                                                                        >
                                                                                            <span className='svg__iconbox svg__icon--edit'></span>
                                                                                        </a>
                                                                                        <a title='Delete'
                                                                                            onClick={() => clearReplycomment(false, k, 0, i, index,'tab')
                                                                                            }
                                                                                        >
                                                                                            <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                    </span> */}
                                                                       </div>
                                                                       <div><span dangerouslySetInnerHTML={{ __html: cleanHTML(replymessage?.Title, null, i) }}></span></div>
                                                                   </div>
                                                               </div>

                                                           )
                                                       })}
                                                   </div>
                                               </div>


                                           </div>


                                       })}
                                   </div>

                               </div>
                           </div>
                           {/* {showhideCommentBoxIndex == i && !objective && <div className='SpfxCheckRadio'>
                                        <div className="col-sm-12 mt-2 p-0" style={{ display: showcomment }} >
                                            {TaskFeedbackData["Approver"] != "" && TaskFeedbackData["Approver"] != undefined && (TaskFeedbackData["Approver"]?.AssingedToUser?.Id == props?.currentUser[0]?.Id || (TaskFeedbackData["Approver"]?.Approver?.length > 0 && TaskFeedbackData["Approver"]?.Approver[0]?.Id == props?.currentUser[0]?.Id)) && <label className='label--checkbox'><input type='checkbox' className='form-check-input me-1' name='approval' checked={ApprovalCommentcheckbox} onChange={(e) => setApprovalCommentcheckbox(e.target.checked)} />
                                                Mark as Approval Comment</label>}
                                        </div>
                                        <div className="align-items-center d-flex"
                                            style={{ display: showcomment }}
                                        >  <textarea id="txtComment" onChange={(e) => handleInputChange(e)} className="form-control full-width"></textarea>
                                            <button type="button" className={TaskFeedbackData["Approver"] != undefined && TaskFeedbackData["Approver"] != "" && (TaskFeedbackData["Approver"]?.AssingedToUser?.Id ==props?.currentUser[0]?.Id || (TaskFeedbackData["Approver"]?.Approver?.length > 0 && TaskFeedbackData["Approver"]?.Approver[0]?.Id ==props?.currentUser[0]?.Id)) ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => PostButtonClick(fbData, i)}>Post</button>
                                        </div>
                                    </div>} */}

                       </div>

                       {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                           return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>
                               <div className='justify-content-between d-flex'>
                                   <div className='alignCenter m-0'>
                                       {props?.ApprovalStatus ?
                                           <span className="alignCenter">
                                               <span title="Rejected"
                                                   // onClick={() => changeTrafficLigthsubtext(i, j, "Reject",'tab')}
                                                   className={fbSubData.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                               >
                                               </span>
                                               <span title="Maybe"
                                                   // onClick={() => changeTrafficLigthsubtext(i, j, "Maybe",'tab')}
                                                   className={fbSubData?.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                               </span>
                                               <span title="Approved"
                                                   // onClick={() => changeTrafficLigthsubtext(i, j, "Approve",'tab')}
                                                   className={fbSubData?.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                               </span>
                                               {/* {fbSubData?.ApproverData?.length > 0 &&
                                                            <>
                                                                <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ShowApprovalHistory(fbSubData, i, j)}>
                                                                    {fbSubData?.ApproverData[fbSubData?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.Title}><span><a onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, fbSubData?.ApproverData[fbSubData?.ApproverData?.length - 1]?.Id,)} target="_blank" data-interception="off" title={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.Title}> <img className='imgAuthor hreflink ' src={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.ImageUrl} /></a></span></a></span>
                                                            </>} */}


                                           </span>
                                           : null
                                       }
                                   </div>
                                   {/* <div className='m-0'>
                                                <a className="d-block text-end">
                                                    <a className='siteColor' style={{ cursor: 'pointer' }}
                                                        onClick={(e) => showhideCommentBoxOfSubText(j, i,'tab')}
                                                    >Add Comment</a>
                                                </a>
                                            </div> */}
                               </div>

                               <div className="d-flex pe-0 FeedBack-comment">
                                   <div className="border p-1 me-1">
                                       <span >{arrayOfChar[indexdesign] + "." + (i + 1)}.{j + 1}</span>
                                       <ul className="list-none">
                                           <li>
                                               {fbSubData?.Completed != null && fbSubData?.Completed &&
                                                   <span className="svg__iconbox svg__icon--tick"></span>
                                               }
                                           </li>
                                           <li>
                                               {fbSubData?.HighImportance != null && fbSubData?.HighImportance &&
                                                   <span className="svg__iconbox svg__icon--taskHighPriority"></span>
                                               }
                                           </li>
                                           <li>
                                               {fbSubData?.LowImportance != null && fbSubData?.LowImportance &&
                                                   <span className="svg__iconbox svg__icon--lowPriority"></span>
                                               }
                                           </li>
                                           <li>
                                               {fbSubData?.Phone != null && fbSubData?.Phone &&
                                                   <span className="svg__iconbox svg__icon--phone"></span>
                                               }
                                           </li>
                                       </ul>
                                   </div>

                                   <div className="border p-2 full-width text-break">
                                       <span ><span dangerouslySetInnerHTML={{ __html: cleanHTML(fbSubData?.Title, null, j) }}></span></span>
                                       <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                                           {fbSubData?.Comments != null && fbSubData.Comments.length > 0 && fbSubData?.Comments?.map((fbComment: any, k: any) => {
                                               return <div className={fbComment?.isShowLight != undefined && fbComment.isApprovalComment ? `col-sm-12  mb-2 add_cmnt my-1 ${fbComment?.isShowLight}` : "col-sm-12  mb-2 add_cmnt my-1 "} title={fbComment?.isShowLight != undefined ? fbComment?.isShowLight : ""}>
                                                   <div className="">
                                                       <div className="d-flex p-0">
                                                           <div className="col-1 p-0 wid30">
                                                               {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)}
                                                                   src={fbComment.AuthorImage} /> : <span onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)} title={fbComment?.AuthorName != undefined ? fbComment?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
                                                               }
                                                           </div>
                                                           <div className="col-11 pad0" key={k}>
                                                               <div className="d-flex justify-content-between align-items-center">
                                                                   {fbComment?.AuthorName} - {fbComment?.Created}
                                                                   {/* <span className='d-flex'>
                                                                                <a className="ps-1" title="Comment Reply" >
                                                                                    <div data-toggle="tooltip" id={buttonId + "-" + i + j + k +"tab"}
                                                                                        onClick={() => openReplySubcommentPopup(i, j, k,'tab')}
                                                                                        data-placement="bottom"
                                                                                    >
                                                                                        <span className="svg__iconbox svg__icon--reply"></span>
                                                                                    </div>
                                                                                </a>
                                                                                <a title="Edit"
                                                                                    onClick={() => openEditModal(fbComment, k, j, true, i, 'tab')}
                                                                                >

                                                                                    <span className='svg__iconbox svg__icon--edit'></span>
                                                                                </a>
                                                                                <a title='Delete'
                                                                                    onClick={() =>clearComment(true, k, j, i,'tab')}
                                                                                ><span className='svg__iconbox svg__icon--trash'></span></a>
                                                                            </span> */}
                                                               </div>
                                                               <div ><span dangerouslySetInnerHTML={{ __html: cleanHTML(fbComment?.Title, null, j) }}></span></div>
                                                           </div>
                                                       </div>
                                                       <div className="col-12 ps-3 pe-0 mt-1">
                                                           {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, ReplyIndex: any) => {
                                                               return (
                                                                   <div className="d-flex border ms-3 p-2  mb-1">
                                                                       <div className="col-1 p-0 wid30">
                                                                           {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, replymessage?.AuthorName, props?.taskUsers)}
                                                                               src={replymessage.AuthorImage} /> : <span title={replymessage?.AuthorName != undefined ? replymessage?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>}
                                                                       </div>
                                                                       <div className="col-11 pe-0" >
                                                                           <div className='d-flex justify-content-between align-items-center'>
                                                                               {replymessage?.AuthorName} - {replymessage?.Created}
                                                                               {/* <span className='d-flex'>
                                                                                            <a title='Edit'

                                                                                                onClick={() => EditReplyComment(replymessage, k, 0, true, i, ReplyIndex,'tab')
                                                                                                }
                                                                                            >
                                                                                                <span className='svg__iconbox svg__icon--edit'></span>
                                                                                            </a>
                                                                                            <a title='Delete'
                                                                                                onClick={() => clearReplycomment(true, k, j, i, ReplyIndex,'tab')}

                                                                                            >
                                                                                                <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                        </span> */}
                                                                           </div>
                                                                           <div><span dangerouslySetInnerHTML={{ __html: cleanHTML(replymessage?.Title, null, j) }}></span></div>
                                                                       </div>
                                                                   </div>

                                                               )
                                                           })}
                                                       </div>
                                                   </div>
                                               </div>
                                           })}
                                       </div>
                                   </div>
                               </div>
                               {/* {subchildcomment == j && subchildParentIndex == i && !objective ? <div className='SpfxCheckRadio' >
                                            <div className="col-sm-12 mt-2 p-0  ">
                                                {TaskFeedbackData["Approver"] != "" && TaskFeedbackData["Approver"] != undefined && (TaskFeedbackData["Approver"]?.AssingedToUser?.Id == props?.currentUser[0]?.Id || (TaskFeedbackData["Approver"]?.Approver[0]?.Id == props?.currentUser[0]?.Id)) && <label className='label--checkbox'><input type='checkbox' className='form-check-input me-1' checked={ApprovalCommentcheckbox} onChange={(e) => setApprovalCommentcheckbox(e.target?.checked)} />Mark as Approval Comment</label>}

                                            </div>

                                            <div className="align-items-center d-flex"

                                            >  <textarea id="txtCommentSubtext" onChange={(e) => handleInputChange(e)} className="form-control full-width" ></textarea>
                                                <button type="button" className={TaskFeedbackData["Approver"] != undefined && TaskFeedbackData["Approver"] != "" && (TaskFeedbackData["Approver"]?.AssingedToUser?.Id ==props?.currentUser[0]?.Id || (TaskFeedbackData["Approver"]?.Approver[0]?.Id ==props?.currentUser[0]?.Id)) ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => SubtextPostButtonClick(j, i)}>Post</button>
                                            </div>
                                        </div> : null} */}

                           </div>
                       })}



                   </div>
               )
           })}
           </>
          ) 
}

// ==========Single image view function where we show the particular image End ===================
    return (
        <>

            <Panel
                onRenderHeader={onRenderCustomAddMoreImageHeader}
                isOpen={true}
                onDismiss={() => props?.setComparesetpannel(false)}
                isBlocking={true}
                type={PanelType?.smallFluid}
            >
               <div className='col-sm-12 row '>  {props?.checkedSetData?.length>0 &&
                 props?.checkedSetData?.map((designtempateData: any, indexdesign: any) => {
                    if (typeof designtempateData == "object" && designtempateData != null && designtempateData != undefined) {
                        let userdisplay: any = [];
                        userdisplay.push({ Title: props?.userDisplayName })
                        return(
                            <div className='col-sm-6'> {showSetData(designtempateData,indexdesign)}</div>
                        )
                   
                    }
                 })}
                
                </div>
               
                {/* <footer className='bg-f4 fixed-bottom p-3 text-end'>
                    <button type='button' className='btn btn-primary mx-2' onClick={() => saveImageView()}>Save</button>
                    <button type='button' className='btn btn-default' onClick={() => props?.SetOpenComparePopup(false)}>Cancel</button>
                </footer> */}

            </Panel>
        </>

    )
}
export default CompareSetData;