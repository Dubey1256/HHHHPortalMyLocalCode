import * as React from 'react';
import { Web } from "sp-pnp-js";
import { MentionsInput, Mention } from 'react-mentions';
import { MentionProps as OriginalMentionProps } from 'react-mentions';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import "@pnp/sp/sputilities";
import * as moment from "moment-timezone";
import HtmlEditorCard from '../globalComponents/HtmlEditor/HtmlEditor';
import { Panel, PanelType } from 'office-ui-fabric-react';
import mentionClass from '../globalComponents/Comments/mention.module.scss';
import Tooltip from '../globalComponents/Tooltip';
import * as globalCommon from '../globalComponents/globalCommon';
import * as msal from "@azure/msal-node";
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { PiUploadSimple } from "react-icons/pi";
import JoditEditor from 'jodit-react';
import { FocusTrapCallout, FocusZone, FocusZoneTabbableElements, Stack, Text, } from '@fluentui/react';
import {
    AvatarGroup,
    AvatarGroupItem,
    AvatarGroupPopover,
    makeStyles,
    partitionAvatarGroupItems,
    Popover,
    PopoverSurface,
    PopoverTrigger
} from "@fluentui/react-components";

interface Mention extends OriginalMentionProps {
    onClick?: (e: any) => any;
}
interface AvatarGroupItemProps {
    initials?: string;
    size: number;
    name: string;
    image: {
        src: string;
    };
}
let taskUser_Items: any = [];
let mentioned_user = false;
let currentUser: any = [];
let mentionUsers: any = [];
let group_User: any = [];
let partitionedItems: any = [];
let TeamsMessage: any = '';
let EmojiData: any = data;
const useStyles = makeStyles({
    root: {
        display: "grid",
        flexDirection: "column",
        rowGap: "10px",
    },
});
const MSTeamsChat = (props: any) => {
    const fileInputRef = React.useRef(null);
    const [state, rerender] = React.useReducer(() => ({}), {});
    const [Data, setData]: any = React.useState([]);
    const [new_chat_response, setnew_chat_response] = React.useState('');
    const [mentionValue, setMentionValue] = React.useState('');
    const [comments, setComments] = React.useState<any>({ value: '', mentionData: {} });
    const [replymessages, SetReplymessages] = React.useState<any>([]);
    const [isPopoverReplyOpen, setIsPopoverReplyOpen] = React.useState<any>('');
    const [replyCommentData, setReplyCommentData] = React.useState<any>('');
    const [currentEmoji, setCurrentEmoji] = React.useState(null);
    const editor = React.useRef(null);
    const [content, setContent] = React.useState('');
    const [isModalOpen, setisModalOpen] = React.useState(false);
    const [hideMentionInput, setHideMentionInput] = React.useState(true);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const callBack: any = '';
    React.useEffect(() => {
        userdata();
        loadGroupChat();
    }, []);
    const userdata = async () => {
        // let web = new Web(props?.AllListId?.siteUrl);
        // currentUser = await web.currentUser?.get();
        taskUser_Items = await globalCommon.loadTaskUsers();
        const client = await props?.Context?.msGraphClientFactory.getClient();
        group_User = await client.api('/chats/' + props?.ExistingGroup + '/members').get();
        console.log(group_User);
        if (group_User?.value !== undefined && group_User?.value?.length > 0) {
            group_User?.value?.map((exist_user: any) => {
                props?.TaskUsers?.map((match_user: any) => {
                    if (exist_user?.displayName?.toLowerCase() === match_user?.Title?.toLowerCase()) {
                        exist_user.AssignedUserId = match_user?.AssingedToUserId;
                        exist_user.AuthorImage = match_user?.Item_x0020_Cover?.Url;
                    }
                });
            })
        }
        if (group_User?.value != undefined && group_User?.value?.length > 0) {
            mentionUsers = [];
            for (let index = 0; index < group_User?.value?.length; index++) {
                mentionUsers.push({
                    id: group_User?.value[index].id,
                    display: group_User?.value[index].displayName
                });
            }
            console.log(mentionUsers);
        }
    }
    const msalConfig = {
        auth: {
            clientId: "1658591a-327c-4e9d-99d4-fcecbe5b6a86",
            authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
            clientSecret: "d9c779db-547b-4696-8fda-e402010ae0ff",
        }
    };
    const CustomIcon = React.forwardRef((props:any, ref:any) => (
        <div ref={ref} {...props}>
            <PiUploadSimple size={20} color="blue" />
        </div>
    ));
    const sendMessageWithAttachment = async (chatId: any, fileName: any) => {
        const cca = new msal.ConfidentialClientApplication(msalConfig);
        const authResponse = await cca.acquireTokenByClientCredential({
            scopes: ["https://graph.microsoft.com/.default"]
        });
        const accessToken = authResponse.accessToken;
        const response = await fetch(`https://graph.microsoft.com/v1.0/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "body": {
                    "content": `Here is the file ${fileName}`
                },
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.teams.file.download.info",
                        "contentUrl": `https://graph.microsoft.com/v1.0/chats/${chatId}/files/${fileName}`,
                        "name": fileName,
                        "thumbnailUrl": null
                    }
                ]
            })
        });
        if (response.ok) {
            alert("Message sent successfully with the file attachment.");
        } else {
            console.error("Failed to send message with the file attachment.", await response.text());
        }
    };
    const IsUserExists = (array: any, id: any) => {
        let isExists = false;
        array.forEach((item: any) => {
            if (item?.id?.toLowerCase() === id?.toLowerCase()) {
                isExists = true;
                return false;
            }
        })
        return isExists;
    }
    const hasBothUppercaseAndLowercase = (str: any) => {
        const hasUppercase = /[A-Z]/.test(str);
        const hasLowercase = /[a-z]/.test(str);
        return hasUppercase || hasLowercase;
    }

    // const createUploadSession = async (chatId: any, fileName: any) => {
    //     const fetch: any = require('node-fetch');
    //     const response = await fetch(`https://graph.microsoft.com/v1.0/chats/${chatId}/messages`, {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             "body": {
    //                 "content": "Uploading file"
    //             },
    //             "attachments": [
    //                 {
    //                     "contentType": "application/vnd.microsoft.teams.file.download.info",
    //                     "contentUrl": `https://graph.microsoft.com/v1.0/chats/${chatId}/files/${fileName}`,
    //                     "name": fileName,
    //                     "thumbnailUrl": null
    //                 }
    //             ]
    //         })
    //     });
    //     const result = await response.json();
    //     return result.uploadUrl;
    // }

    const loadGroupChat = () => {
        props?.Context?.msGraphClientFactory.getClient().then((client: MSGraphClientV3) => {
            client.api('chats/' + props?.ExistingGroup + '/messages').top(50).version("v1.0").get(async (err: any, res: any) => {
                let Items_Exclude: any = [];
                if (err) {
                    console.error("MSGraphAPI Error")
                    console.error(err);
                    return;
                }
                try {
                    res?.value?.forEach((chat: any, index: any) => {
                        chat.isPickerVisible = false;
                        chat.openPopup = false;
                        if (chat.body != undefined && chat.body.contentType != undefined && chat.body.content != '' && chat.body.contentType == 'html' && chat.body.content !== '<systemEventMessage/>'
                            || (chat.body.content.indexOf('</attachment>') > -1)) {
                            // if (chat.body.content.indexOf('<blockquote>') == -1 && chat.body.content.includes('<[^>]+>&nbsp;\s+') > -1) {
                            //     chat.body.content = chat.body.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
                            // }
                            // else {
                            let chatContent = chat.body.content.split('\n');
                            chat.body.content = chatContent[chatContent.length - 1];
                            // }
                            chat.LastModified = moment(chat?.lastModifiedDateTime).tz("Europe/Berlin").format('DD MMM YYYY HH:mm');
                            props?.TaskUsers?.map((match_user: any) => {
                                if (chat?.from?.user?.displayName?.toLowerCase() === match_user?.Title?.toLowerCase()) {
                                    chat.AuthorImage = match_user?.Item_x0020_Cover?.Url;
                                    chat.AssignedUserId = match_user?.AssingedToUserId;
                                    chat.AuthorName = match_user?.Title;
                                }
                            });
                            if (chat?.reactions !== undefined && chat?.reactions?.length > 0) {
                                chat?.reactions?.map((user_reaction: any) => {
                                    if (user_reaction?.reactionType !== '' && user_reaction?.reactionType !== undefined) {
                                        if (hasBothUppercaseAndLowercase(user_reaction?.reactionType)) {
                                            Object.keys(EmojiData?.emojis).forEach((key, value) => {
                                                if (key) {
                                                    let item: any = {};
                                                    item = EmojiData?.emojis[key];
                                                    item?.keywords?.map((match_emoji: any) => {
                                                        if (match_emoji.toLowerCase().indexOf(user_reaction?.reactionType.toLowerCase()) > -1) {
                                                            chat.EmojiData = item?.skins[0].native;
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            chat.EmojiData = user_reaction.reactionType;
                                        }
                                    }
                                });
                            }
                            Items_Exclude.push(chat);
                        }
                    })
                    setData(Items_Exclude);

                } catch (e) {
                    console.log(e)
                }

            });
        });
    }
    function clearComment(i: any, undefined: undefined, undefined1: undefined): void {
        throw new Error('Function not implemented.');
    }

    function openEditModal(_cmtData: any, i: any, arg2: boolean): void {
        throw new Error('Function not implemented.');
    }
    const SaveReplyMessageFunction = async (reply: any, i: any) => {
        if (reply.ReplyMessages == undefined)
            reply.ReplyMessages = [];
        reply.isReplyMsg = true;
        reply.ReplyMessages.push(
            {
                AuthorName: props?.Currentuser?.Title,
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                ChildLevel: true,
                AuthorImage: props?.Currentuser?.Item_x0020_Cover?.Url,
                currentDataIndex: i,
                isCalloutVisible: true,
                Description: replyCommentData,
                mailReply: { isMailReply: true, index: i, }
            });
        let MainData = Data;
        setData(MainData);
        rerender();
        setIsPopoverReplyOpen('');
        var PreMsg = reply?.body?.content.replace(/<at[^>]*>(.*?)<\/at>/g, '$1').trim();
        TeamsMessage = `<blockquote>${reply?.AuthorName} ${reply?.LastModified} </br> ${PreMsg} </blockquote>${replyCommentData}`;
        PostComment();
    };
    const ReplyPostComment = () => {

    }
    const styles = useStyles();
    if (group_User?.value !== undefined && group_User?.value.length > 0)
        partitionedItems = partitionAvatarGroupItems({ items: group_User?.value });

    const UserItems = (e: any) => {
        let userId: any[] = [];
        let match_userId: any[] = [];
        if (e.target.value !== undefined && e.target.value !== '')
            userId.push(e.target.value + ';');
        if (userId?.length > 0) {
            mentionUsers?.map((select_user: any, index: any) => {
                userId?.map((exist_user: any) => {
                    if (select_user?.display?.toLowerCase().includes(exist_user?.toLowerCase()))
                        match_userId.push(select_user.id)
                });
            });
        }
        console.log(match_userId);
    }
    const handleChange = (event: any, newValue: any, newPlainTextValue: any, mentions: any) => {
        if (mentions?.length > 0) {
            mentioned_user = true;
            setComments({
                value: newValue,
                mentionData: { newValue, newPlainTextValue, mentions }
            })
        }
        else {
            setComments({
                value: newPlainTextValue,
                mentionData: {}
            })
        }
    }
    const PostComment = async () => {
        const client = await props?.Context?.msGraphClientFactory.getClient();
        const temp = comments
        if (!mentioned_user) {
            let txtComment: any = TeamsMessage !== undefined && TeamsMessage !== '' ? TeamsMessage : comments?.value;
            const message_payload = {
                // "id": item.id,
                "body": {
                    contentType: 'html',
                    content: `${txtComment}`,
                },
                // "replyToId": ,
            }
            let result = await client.api('/chats/' + props?.ExistingGroup + '/messages').post({ ...message_payload })
            if (result !== undefined && result !== '') {
                setComments((prevState: any) => ({ ...prevState, value: '' }));
                temp.value = '';
                setComments(temp);
                loadGroupChat()
                rerender();
                if(isModalOpen)
                    setisModalOpen((prev) => !prev);
            }
            return result;
        }
        else {
            let txtComment = comments?.mentionData.newValue.split(') ')[comments?.mentionData.newValue.split(') ').length - 1];
            let mentionId = 0;
            let messageContent = txtComment;
            const mentions = comments?.mentionData?.mentions.map((user: any) => {
                const mentionTag = `<at id="${mentionId}">${user.display}</at>`;
                messageContent = `${mentionTag} ${messageContent}`;
                const mention = {
                    id: mentionId,
                    mentionText: user.display,
                    mentioned: {
                        user: {
                            id: user.id,
                            displayName: user.display,
                        },
                    },
                };
                mentionId += 1;
                return mention;
            });
            const messageBody = {
                body: {
                    content: messageContent,
                    contentType: 'html',
                },
                mentions: mentions,
            };
            let result = await client.api('/chats/' + props?.ExistingGroup + '/messages').post({ ...messageBody })
            if (result !== undefined && result !== '') {
                loadGroupChat();
                setComments({ value: '', mentionData: {} });

            }
            return result;
        }
    }
    const openEmojiPopup = (chat: any) => {
        chat.isPickerVisible = !chat.isPickerVisible;
        let MainData = Data;
        setData(MainData);
        rerender();
        console.log(EmojiData);
    }
    const selectEmoji = async (data: any, msg: any) => {
        if (data !== null) {
            console.log(data);
            if (msg.emoji === undefined) {
                msg.emoji = [];
                msg.emoji.push(data);
            }
            msg.isPickerVisible = !msg.isPickerVisible;
            let MainData = Data;
            setData(MainData);
            rerender();
            const client: MSGraphClientV3 = await props?.Context?.msGraphClientFactory.getClient();
            const message_payload = {
                "reactionType": data?.native
            }
            await client.api('/chats/' + msg?.chatId + '/messages/' + msg?.id + '/microsoft.graph.setReaction').post(message_payload);
            alert('Reaction added successfully.');
            loadGroupChat();
        }
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
    const customHeaderforEditCommentpopup = () => {
        return (
            <>
                <div className="d-flex full-width pb-1 serviepannelgreena">
                    <div className='subheading'>
                        <span className="siteColor">
                            Update Comment
                        </span>
                    </div>
                    <Tooltip ComponentId="588" />
                </div>
            </>
        )
    }
    const config = React.useMemo(
        () => ({
            readonly: false,
            placeholder: '' || 'Start typing...',
            uploader: {
                insertImageAsBase64URI: true
            }
        }),
        []
    );
    const handleClick = () => {
        setisModalOpen((prev) => !prev);
        setComments((prevState: any) => ({ ...prevState, value: '', mentionData: {} }));
        setHideMentionInput((prev) => !prev);
    }
    const HtmlEditorCallBack = React.useCallback((EditorData: any) => {
        setComments({
            value: EditorData,
            mentionData: {}
        })

    }, []);
    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        sendMessageWithAttachment(props?.ExistingGroup, file.name)
    };
    const resetForm = () => {
        fileInputRef.current.form.reset();
    };
    return (
        <>
            {Data != null && Data != undefined && Data?.length > 0 &&
                <div className='mb-3 card commentsection boxshadow TeamsChatSection'>
                    <div className='card-header'>
                        <div className="card-title h5 d-flex align-items-center gap-3 mb-0">Teams Chat :
                            {group_User?.value != undefined && group_User?.value?.length > 0 &&
                                <div className={styles.root}>
                                    <AvatarGroup layout="stack">
                                        {partitionedItems?.inlineItems?.map((name: any) => (
                                            <AvatarGroupItem className="AvatarGroupItem" style={{ width: 20, height: 20 }} key={name?.id} image={{
                                                src: `${name?.AuthorImage}`,
                                            }} />
                                        ))}
                                        {partitionedItems?.overflowItems && (
                                            <AvatarGroupPopover>
                                                {partitionedItems?.overflowItems?.map((name: any) => (
                                                    <AvatarGroupItem className="AvatarGroupItem" style={{ width: 20, height: 20 }} key={name?.id} image={{
                                                        src: `${name?.AuthorImage}`,
                                                    }} />
                                                ))}
                                            </AvatarGroupPopover>
                                        )}
                                    </AvatarGroup>
                                </div>
                            }
                            <span className="ml-auto"><Tooltip ComponentId='586' /></span>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='d-inline-block full-width mentionUserListscrollbar'>
                            {hideMentionInput && <MentionsInput placeholder="Enter your comments here" className="form-control" style={{ padding: '5px' }}
                                classNames={mentionClass} value={comments.value}
                                onChange={handleChange}>
                                <Mention trigger="@" data={mentionUsers} appendSpaceOnAdd={true} />
                            </MentionsInput>}
                            <a onClick={handleClick}>
                                <span className='svg__iconbox svg__icon--edit'></span>
                            </a>
                            {isModalOpen && <div className='modal-body updateComment'>
                                <HtmlEditorCard editorValue={comments.value} HtmlEditorStateChange={HtmlEditorCallBack}></HtmlEditorCard>
                            </div>}
                            <button onClick={() => PostComment()} title="Post comment" type="button" className="btn btn-primary mt-2 my-1 float-end px-3">
                                Post
                            </button>
                            {/* <form>
                                <input type="file" onChange={handleFileInputChange} className='form-control' ref={fileInputRef} />
                            </form> */}
                        </div>
                        <div className="commentMedia">
                            {Data != null && Data != undefined && Data?.length > 0 &&
                                <div>
                                    <ul className="list-unstyled subcomment p-0">
                                        {Data != null && Data?.length > 0 && Data?.map((avail_Msg: any, i: any) => {
                                            return <li className="media my-1 p-1 position-relative mb-3">
                                                <div className="media-bodyy">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="comment-date">
                                                            <span className="round pe-1">
                                                                <img className="align-self-start hreflink" title={avail_Msg?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, avail_Msg?.AssignedUserId, avail_Msg?.AuthorName, taskUser_Items)}
                                                                    src={avail_Msg?.AuthorImage != undefined && avail_Msg?.AuthorImage != '' ?
                                                                        avail_Msg?.AuthorImage :
                                                                        "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                            </span>
                                                            {avail_Msg?.LastModified}
                                                        </span>
                                                        <div className="d-flex ml-auto media-icons px-1">
                                                            {/* <span ref={fileInputRef} onChange={handleFileInputChange}>
                                                                <PiUploadSimple size={20} color="blue" /></span> */}
                                                                {/* <CustomIcon onChange={handleFileInputChange} ref={fileInputRef} /> */}
                                                            <a onClick={() => openEmojiPopup(avail_Msg)}>
                                                                <span className='svg__iconbox svg__icon--emoji'></span>
                                                            </a>
                                                            {avail_Msg.isPickerVisible &&
                                                                <div key={i} className={avail_Msg.isPickerVisible ? "d-block emoji-panel" : "d-none"}>
                                                                    <Picker data={data} previewPosition='none' onEmojiSelect={(e: any) => {
                                                                        setCurrentEmoji(e);
                                                                        !avail_Msg.isPickerVisible;
                                                                        selectEmoji(e, avail_Msg);
                                                                    }} />
                                                                </div>}
                                                            <Popover withArrow open={isPopoverReplyOpen == `${i}`} onOpenChange={(e, data) => setIsPopoverReplyOpen(`${i}`)}>
                                                                <PopoverTrigger disableButtonEnhancement>
                                                                    <span className="svg__iconbox svg__icon--reply"></span>
                                                                </PopoverTrigger>
                                                                <PopoverSurface tabIndex={-1}>
                                                                    <div >
                                                                        <h5 className='siteColor m-0' style={{ minWidth: '250px' }}>Reply Comment</h5>
                                                                        <div className='my-2'>
                                                                            <textarea className='w-100' onChange={(e) => setReplyCommentData(e?.target?.value)}></textarea>
                                                                        </div>
                                                                    </div>
                                                                    <div className='footer text-end'>
                                                                        <button className='btnCol btn me-2 btn-primary' onClick={() => SaveReplyMessageFunction(avail_Msg, i)}>Save</button>
                                                                        <button className='btnCol btn btn-default' onClick={() => setIsPopoverReplyOpen('')}>Cancel</button>
                                                                    </div>
                                                                </PopoverSurface>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                    <div className="media-text">
                                                        {avail_Msg?.body?.content != undefined && <div dangerouslySetInnerHTML={{ __html: avail_Msg?.body?.content }}></div>}
                                                        {/* detectAndRenderLinks( */}
                                                        {avail_Msg?.attachments !== undefined && avail_Msg?.attachments?.length > 0 && avail_Msg?.attachments?.map((user_imgdoc: any) => {
                                                            return <a style={{ color: "blueviolet" }} target="_blank" href={user_imgdoc?.contentUrl} >{user_imgdoc.name}</a>
                                                        })}
                                                        {(avail_Msg.EmojiData !== null && avail_Msg.EmojiData !== undefined) &&
                                                            <span className="emojireact">{avail_Msg.EmojiData}</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="commentMedia">
                                                    {avail_Msg?.ReplyMessages != null && avail_Msg?.ReplyMessages != undefined && avail_Msg?.ReplyMessages?.length > 0 &&
                                                        <div>
                                                            <ul className="list-unstyled subcomment">
                                                                {avail_Msg?.ReplyMessages != null && avail_Msg?.ReplyMessages?.length > 0 && avail_Msg?.ReplyMessages?.map((ReplyMsg: any, j: any) => {
                                                                    return <li className="media  p-1 my-1">
                                                                        <div className="media-bodyy">
                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                <span className="comment-date ng-binding">
                                                                                    <span className="round  pe-1">
                                                                                        <img className="align-self-start hreflink " title={ReplyMsg?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, avail_Msg?.AssignedUserId, ReplyMsg?.AuthorName, taskUser_Items)}
                                                                                            src={ReplyMsg?.AuthorImage != undefined && ReplyMsg?.AuthorImage != '' ?
                                                                                                ReplyMsg?.AuthorImage :
                                                                                                "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                                                        />
                                                                                    </span>
                                                                                    {ReplyMsg?.Created}</span>
                                                                            </div>
                                                                            <div className="media-text">
                                                                                <div dangerouslySetInnerHTML={{ __html: detectAndRenderLinks(ReplyMsg?.Description) }}></div>
                                                                                {(ReplyMsg.EmojiData !== null && ReplyMsg.EmojiData !== undefined) &&
                                                                                    <span className="emojireact">{ReplyMsg.EmojiData}</span>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                })}
                                                            </ul>
                                                        </div>
                                                    }
                                                </div>
                                            </li>
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
