import * as React from 'react';
import { useEffect, useState } from 'react';
const FeedbackGlobalInfoIcon = (props: any) => {
    const [resultData, setResultData] = React.useState<any>()
    useEffect(() => {
        if (props?.FeedBack != undefined && props?.FeedBack.length > 0) {
            setResultData(props?.FeedBack)
        }
    }, [props != undefined])
    function cleanHTML(html: any) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const paragraphs = div.querySelectorAll('p');

        // Filter out empty <p> tags
        paragraphs.forEach((p) => {
            if (p.innerText.trim() === '') {
                p.parentNode.removeChild(p); // Remove empty <p> tags
            }
        });
        const brTags = div.querySelectorAll('br');
    if (brTags.length > 1) {
      for (let i = brTags.length - 1; i > 0; i--) {
        brTags[i].parentNode.removeChild(brTags[i]);
      }
    }

        return div.innerHTML;
    }

    return (
        <>

            <div className={"Addcomment " + "manage_gap"}>
                {resultData?.length > 0 && resultData?.map((fbData: any, i: any) => {
                    let userdisplay: any = [];
                    if (fbData != null && fbData != undefined && fbData?.Title != "") {

                        try {
                            if (fbData?.Title != undefined) {
                                fbData.Title = cleanHTML(fbData?.Title)

                            }
                        } catch (e) {
                        }
                        return (
                            <>
                                {props?.taskInfo ? <div>

                                    <div className="col mb-2">
                                        <div className="d-flex p-0 FeedBack-comment ">
                                            <div className="border p-1 me-1">
                                                <span>{i + 1}.</span>
                                                <ul className='list-none'>
                                                    <li>
                                                        {fbData['Completed'] != null && fbData['Completed'] &&

                                                            <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                                                        }
                                                    </li>
                                                    <li>
                                                        {fbData['HighImportance'] != null && fbData['HighImportance'] &&
                                                            <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                                                        }
                                                    </li>
                                                    <li>
                                                        {fbData['LowImportance'] != null && fbData['LowImportance'] &&
                                                            <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                                                        }
                                                    </li>
                                                    <li>
                                                        {fbData['Phone'] != null && fbData['Phone'] &&
                                                            <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                                                        }
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="border p-2 full-width text-break"
                                                title={fbData.ApproverData != undefined && fbData?.ApproverData.length > 0 ? fbData.ApproverData[fbData.ApproverData.length - 1].isShowLight : ""}>

                                                <span dangerouslySetInnerHTML={{ __html: cleanHTML(fbData?.Title) }}></span>
                                                <div className="col">
                                                    {fbData['Comments'] != null && fbData['Comments']?.length > 0 && fbData['Comments']?.map((fbComment: any, k: any) => {
                                                        return <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col add_cmnt my-1 ${fbComment.isShowLight}` : "col add_cmnt my-1"}>
                                                            <div className="">
                                                                <div className="d-flex p-0">
                                                                    <div className="col-1 p-0">
                                                                        <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                                                                            fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                    </div>
                                                                    <div className="col-11 pe-0" >

                                                                        <div><span dangerouslySetInnerHTML={{ __html:cleanHTML(fbComment?.Title)  }}></span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 ps-3 pe-0">
                                                                    {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                                        return (
                                                                            <div className="d-flex border ms-3 p-2  mb-1">
                                                                                <div className="col-1 p-0 mx-1">
                                                                                    <img className="workmember" src={replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ?
                                                                                        replymessage.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                                </div>
                                                                                <div className="col-11 pe-0" >

                                                                                    <div><span dangerouslySetInnerHTML={{ __html:cleanHTML(replymessage?.Title)  }}></span></div>
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


                                    </div>

                                    {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                                        return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>


                                            <div className="d-flex pe-0 FeedBack-comment">
                                                <div className="border p-1 me-1">
                                                    <span >{i + 1}.{j + 1}</span>
                                                    <ul className="list-none">
                                                        <li>
                                                            {fbSubData?.Completed != null && fbSubData?.Completed &&
                                                                <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                                                            }
                                                        </li>
                                                        <li>
                                                            {fbSubData?.HighImportance != null && fbSubData?.HighImportance &&
                                                                <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                                                            }
                                                        </li>
                                                        <li>
                                                            {fbSubData?.LowImportance != null && fbSubData?.LowImportance &&
                                                                <span><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                                                            }
                                                        </li>
                                                        <li>
                                                            {fbSubData?.Phone != null && fbSubData?.Phone &&
                                                                <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                                                            }
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="border p-2 full-width text-break"
                                                    title={fbSubData?.ApproverData != undefined && fbSubData?.ApproverData?.length > 0 ? fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.isShowLight : ""}>
                                                    <span ><span dangerouslySetInnerHTML={{ __html:cleanHTML(fbSubData?.Title) }}></span></span>
                                                    <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                                                        {fbSubData?.Comments != null && fbSubData.Comments.length > 0 && fbSubData?.Comments?.map((fbComment: any, k: any) => {
                                                            return <div className={fbComment?.isShowLight != undefined && fbComment.isApprovalComment ? `col-sm-12  mb-2 add_cmnt my-1 ${fbComment?.isShowLight}` : "col-sm-12  mb-2 add_cmnt my-1 "}>
                                                                <div className="">
                                                                    <div className="d-flex p-0">
                                                                        <div className="col-sm-1 padL-0 wid35">
                                                                            <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                                                                                fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                        </div>
                                                                        <div className="col-sm-11 pad0" key={k}>

                                                                            <div ><span dangerouslySetInnerHTML={{ __html: cleanHTML(fbComment?.Title) }}></span></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 ps-3 pe-0">
                                                                        {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, ReplyIndex: any) => {
                                                                            return (
                                                                                <div className="d-flex border ms-3 p-2  mb-1">
                                                                                    <div className="col-1 p-0 mx-1">
                                                                                        <img className="workmember" src={replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ?
                                                                                            replymessage.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                                    </div>
                                                                                    <div className="col-11 pe-0" >

                                                                                        <div><span dangerouslySetInnerHTML={{ __html: cleanHTML(replymessage?.Title)}}></span></div>
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


                                        </div>
                                    })}
                                    </div> :
                                    <div>
                                        <div className='f-15 fw-bold'>
                                            {fbData?.heading}
                                        </div>
                                        <div className='border p-1'>
                                            <span dangerouslySetInnerHTML={{ __html: cleanHTML(fbData?.Title) }}></span>
                                        </div>

                                    </div>

                                }


                            </>
                        )
                    }
                })}
            </div>
        </>
    )
}
export default FeedbackGlobalInfoIcon;



