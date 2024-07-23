import * as React from 'react';
import { Web } from "sp-pnp-js";
import { MentionsInput, Mention } from 'react-mentions';
import "@pnp/sp/sputilities";
import * as moment from "moment-timezone";
import Tooltip from '../globalComponents/Tooltip';
import * as globalCommon from '../globalComponents/globalCommon';
import { MSGraphClientV3 } from '@microsoft/sp-http';
let taskUser_Items: any = [];

let currentUser: any = [];
let mentionUsers: any = [];
const MSTeamsChat = (props: any) => {
    const [Data, setData]: any = React.useState([]);
    const [new_chat_response, setnew_chat_response] = React.useState('');
    React.useEffect(() => {
        userdata()
        loadGroupChat();
    }, [Data]);
    const userdata = async () => {
        // let web = new Web(props?.AllListId?.siteUrl);
        // currentUser = await web.currentUser?.get();
        taskUser_Items = await globalCommon.loadTaskUsers();
        // if (taskUser_Items != undefined && taskUser_Items?.length > 0) { 
        //     for (let index = 0; index < taskUser_Items?.length ; index++) {
        //       mentionUsers.push({
        //         id: taskUser_Items[index].Title + "{" + taskUser_Items[index]?.AssingedToUser?.EMail + "}",
        //         display: taskUser_Items[index].Title
        //       });
        //       if (taskUser_Items[index].AssingedToUser != null && taskUser_Items[index].AssingedToUser.Title == currentUser['Title'])
        //         currentUser = taskUser_Items[index];
        //     }
        //     console.log(mentionUsers);
        // }
    }
    const loadGroupChat = () => {
        props?.Context?.msGraphClientFactory.getClient().then((client: MSGraphClientV3) => {
            client.api('chats/' + props?.ExistingGroup + '/messages').version("v1.0").get((err: any, res: any) => {
                let Items_Exclude: any = [];
                if (err) {
                    console.error("MSGraphAPI Error")
                    console.error(err);
                    return;
                }
                try {
                    res?.value?.forEach((chat: any, index: any) => {
                        if (chat.body != undefined && chat.body.contentType != undefined && chat.body.contentType == 'html' && chat.body.content !== '<systemEventMessage/>') {
                            let chatContent = chat.body.content.split('\n');
                            chat.body.content = chatContent[chatContent.length - 1];
                            chat.LastModified = moment(chat?.lastModifiedDateTime).tz("Europe/Berlin").format('DD MMM YYYY HH:mm');
                            taskUser_Items?.map((match_user: any) => {
                                if (chat?.from?.user?.displayName?.toLowerCase() === match_user?.Title?.toLowerCase()) {
                                    chat.AuthorImage = match_user?.Item_x0020_Cover?.Url;
                                    chat.AssignedUserId = match_user?.AssingedToUserId;
                                    chat.AuthorName = match_user?.Title;
                                }
                            });
                            Items_Exclude.push(chat);
                        }
                    })
                    setData(Items_Exclude);
                } catch (e) { console.log(e) }

            });
        });
    }
    const PostComment = async () => {
        let txtComment = new_chat_response;
        const client = await props?.Context?.msGraphClientFactory.getClient();
        const message_payload = {
            "body": {
                contentType: 'html',
                content: `${txtComment}`,
            }
        }
        let result = await client.api('/chats/' + props?.ExistingGroup + '/messages').post(message_payload)
        if (result !== undefined && result !== '') {
            loadGroupChat();
            setnew_chat_response('');
        }
        return result;
    }
    const detectAndRenderLinks = (html: any) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const paragraphs = div.querySelectorAll('p');
        paragraphs.forEach((p) => {
            if (p.innerText.trim() === '') {
                p.parentNode.removeChild(p);
            }
        });
        div.innerHTML = div.innerHTML.replace(/\n/g, '<br>')
        div.innerHTML = div.innerHTML.replace(/(?:<br\s*\/?>\s*)+(?=<\/?[a-z][^>]*>)/gi, '');
        const anchorTags = div.querySelectorAll('a');
        return globalCommon?.replaceURLsWithAnchorTags(div.innerHTML);
    };
    return (
        <>
            {Data != null && Data != undefined && Data?.length > 0 &&
                <div className='mb-3 card commentsection boxshadow'>
                    <div className='card-header'>
                        <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Teams Chat<span><Tooltip ComponentId='586' /></span></div>
                    </div><div className='card-body'>
                        <div className='d-inline-block full-width'>
                            <textarea id='txtComment' placeholder="Enter your comments here" style={{ padding: '5px' }} className='form-control' value={new_chat_response} onChange={(e) => setnew_chat_response(e.target.value)}></textarea>
                            <button onClick={() => PostComment()} title="Post comment" type="button" className="btn btn-primary mt-2 my-1  float-end px-3">
                                Post
                            </button>
                        </div>
                        <div className="commentMedia">
                            {Data != null && Data != undefined && Data?.length > 0 &&
                                <div>
                                    <ul className="list-unstyled subcomment p-0">
                                        {Data != null && Data?.length > 0 && Data?.map((ReplyMsg: any) => {
                                            return <li className="media  p-1 my-1">
                                                <div className="media-bodyy">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="comment-date ng-binding">
                                                            <span className="round pe-1">
                                                                <img className="align-self-start hreflink" title={ReplyMsg?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, ReplyMsg?.AssignedUserId, ReplyMsg?.AuthorName, taskUser_Items)}
                                                                    src={ReplyMsg?.AuthorImage != undefined && ReplyMsg?.AuthorImage != '' ?
                                                                        ReplyMsg?.AuthorImage :
                                                                        "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                            </span>
                                                            {ReplyMsg?.LastModified}
                                                        </span>
                                                    </div>
                                                    <div className="media-text">
                                                        <span dangerouslySetInnerHTML={{ __html: detectAndRenderLinks(ReplyMsg?.body?.content) }}></span>
                                                    </div>
                                                </div>
                                            </li>;
                                        })}
                                    </ul>
                                </div>}
                        </div>
                    </div>
                </div>}
        </>
    );
};

export default MSTeamsChat;