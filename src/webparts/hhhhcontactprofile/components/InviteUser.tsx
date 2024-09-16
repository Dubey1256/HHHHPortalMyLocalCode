import * as React from "react";
import { MSGraphClient } from '@microsoft/sp-http';
import "bootstrap/js/dist/tab.js";
import { Panel, PanelType } from "office-ui-fabric-react";


const ExternalUserTemplate = (props: any) => {
    const [InviteUserOpenPopup, setInviteUserOpenPopupOpen] = React.useState(true);
    const [Items, setItems] = React.useState([{ "Title": "", LastName: "", Eamil: "" }]);
    const AddMoreItem = (IndexItem: any) => {
        let ItemArray = [...Items];
        let flag = false
        ItemArray?.forEach((obj: any, index: any) => {
            if (index === IndexItem && obj?.Title != "" && obj?.LastName != "" && obj?.Email != "") {
                flag = true
            }

        })
        if (flag) {
            let array: any = {};
            array.Title = ""
            array.LastName = "";;
            array.Email = "";
            ItemArray = ItemArray.concat([array]);
            setItems(ItemArray);
        } else { alert("Please fill all details") };
    }
    const deletewebpart = (indexwebpart: any) => {
        let ArrayNew = [...Items];
        let ArrayValue: any = [];
        ArrayNew?.forEach((obj: any, index: any) => {
            if (index != indexwebpart)
                ArrayValue.push(obj);
        })
        setItems(ArrayValue);
    }
    const handleProperty = (index: number, value: string, property: string) => {
        setItems(prevState =>
            prevState.map((obj, i) =>
                i === index ? { ...obj, [property]: value } : obj
            )
        );
    };

    const sendemailGraphapi = async (obj: any) => {
        const emailNew =
        {
            "message": {
                "subject": "Subject of the email",
                "body": {
                    "contentType": "Text", // or "HTML" if you want an HTML body
                    "content": "Hello, this is a test email."
                },
                "toRecipients": [
                    {
                        "emailAddress": {
                            "address": obj.Email
                        }
                    }
                ],
                "ccRecipients": [
                    {
                        "emailAddress": {
                            "address": obj.Email
                        }
                    }
                ]
            },
            "saveToSentItems": "true"
        }
        try {
            const client: MSGraphClient = await props.props.context.msGraphClientFactory.getClient('3');
            const response = await client.api("/me/sendMail")
                .version("v1.0")
                .post(emailNew).then(async (res: any) => {
                    console.log(res);

                })

        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    const InviteUsers = async () => {
        let count = 0;
        Items?.forEach(async (obj: any) => {
            if (obj?.Email != "") {
                sendemailGraphapi(obj);
                const newUser = {
                    "invitedUserDisplayName": obj.Title + ' ' + obj.LastName,
                    "invitedUserEmailAddress": obj.Email,
                    "invitedUserFirstName": obj.Title,
                    "invitedUserLastName": obj.LastName,
                    "invitedUserMessageInfo": {
                        "@odata.type": "microsoft.graph.invitedUserMessageInfo"
                    },
                    "sendInvitationMessage": false,
                    "inviteRedirectUrl": props?.props?.context?._pageContext?._web?.absoluteUrl,
                    "inviteRedeemUrl": "string",
                    "resetRedemption": false,
                    "status": "string",
                    "invitedUser": {
                        "@odata.type": "microsoft.graph.user"
                    },
                    "invitedUserType": "guest"
                };
                // const newUser = {
                //     // "invitedUserDisplayName": obj.Title + ' ' + obj.LastName,
                //     "invitedUserEmailAddress": obj.Email,
                //     // "invitedUserFirstName": obj.Title,
                //     // "invitedUserLastName": obj.LastName,
                //     // "invitedUserMessageInfo": {
                //     //     "@odata.type": "microsoft.graph.invitedUserMessageInfo"
                //     // },
                //     "sendInvitationMessage": true,
                //     "inviteRedirectUrl": props?.props?.context?._pageContext?._web?.absoluteUrl,
                //     // "inviteRedeemUrl": "https://login.microsoftonline.com/redeem?rd=https%3a%2f%2finvitations.microsoft.com%2fredeem%...d%26ver%3d2.0%22",
                //     // "resetRedemption": false,
                //     // "status": "PendingAcceptance",
                //     // "invitedUser": {
                //     //     "@odata.type": "microsoft.graph.user"
                //     // },
                //    // "invitedUserType": "guest"
                // };

                try {
                    const client: MSGraphClient = await props.props.context.msGraphClientFactory.getClient('3');
                    const response = await client.api("/invitations")
                        .version("v1.0")
                        .post(newUser).then(async (res: any) => {
                            const invitationId = res.id;
                            count++;

                            if (count === Items.length) {
                                alert("Invitation sent successfully");
                                setInviteUserOpenPopupOpen(false)
                            }

                        })

                } catch (error) {
                    console.error("Error creating user:", error);
                }
            }
        })
    }


    const closeInvitePopup = () => {
        props?.closePopupCallBack()
        setInviteUserOpenPopupOpen(false);
    }

    return (
        <>
            <Panel
                type={PanelType.large}
                isOpen={InviteUserOpenPopup}
                onDismiss={() => closeInvitePopup()}
                closeButtonAriaLabel="Close"
                isBlocking={false}
            >
                <div>

                    <div className="input-group">Invite External User</div>

                    {Items?.map((obj: any, index: any) =>

                        <div className="row py-2">
                            <div className="col-sm-3">
                                <div className="input-group">
                                    <label className="form-label w-100">First Name</label>
                                    <input type="text" className="form-control" value={obj?.Title} onChange={(e) => handleProperty(index, e.target.value, "Title")} />
                                </div></div>
                            <div className="col-sm-3">
                                <div className="input-group">
                                    <label className="form-label w-100">Last Name</label>
                                    <input type="text" className="form-control" value={obj?.LastName} onChange={(e) => handleProperty(index, e.target.value, "LastName")} />
                                </div></div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <label className="form-label w-100">Email</label>
                                    <input type="text" className="form-control" value={obj?.Email} onChange={(e) => handleProperty(index, e.target.value, "Email")} />
                                </div></div>
                            <div className="col-sm-2">
                                <div className="input-group">
                                    <label className="form-label w-100">.</label>
                                    {(Items?.length - 1 === index) && <span className="svg__iconbox svg__icon--Plus hreflink" onClick={(e) => AddMoreItem(index)}></span>}
                                    {(Items?.length - 1 != index) && <span className="svg__iconbox svg__icon--cross hreflink" onClick={(e) => deletewebpart(index)}></span>}
                                </div></div>
                        </div>

                    )}
                    <button type="button" className="btn btn-primary mt-2 pull-right" onClick={InviteUsers}>Invite Users</button>
                </div>
            </Panel>
        </>

    )
}
export default ExternalUserTemplate
