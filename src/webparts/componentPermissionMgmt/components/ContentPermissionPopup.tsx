import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
import Tooltip from "../../../globalComponents/Tooltip";
import * as globalCommon from "../../../globalComponents/globalCommon";
import moment from 'moment';
let usersAndGroups: any = [];
const ContentPermissionPopup = (props: any) => {
    const [PermissionTitle, setPermissionTitle] = React.useState('')
    const [Editdata, setEditData]: any = React.useState('')
    const [selectedPersonsAndGroups, setSelectedPersonsAndGroups] = React.useState([]);
    const [DefaultSelectedUser, setDefaultSelectedUser] = React.useState([]);
    const [vId, setVId] = React.useState();
    React.useEffect(() => {
        try {
            loadusersAndGroups();
            if (props?.SelectedEditItem?.Id != undefined) {
                loadSelectedItem();
            }
        } catch (e) {

        }
    }, [])
    const loadusersAndGroups = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let web = new Web(pageInfo.WebFullUrl);
            let groups = await web.siteGroups.get();
            let users = await web.siteUsers.get();
            usersAndGroups = [...users, ...groups];
            console.log(usersAndGroups)
        }
    }
    const loadSelectedItem = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let userTitle: any = [];
            let web = new Web(pageInfo.WebFullUrl);
            await web.lists.getByTitle('ComponentPermissions').items.getById(props?.SelectedEditItem?.Id).select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AllowedUsers/Id,AllowedUsers/Title').expand('Author,Editor,AllowedUsers').get().then((data: any) => {
                if (data?.Id != undefined) {
                    data.DisplayModifiedDate = moment(data.Modified).format("DD/MM/YYYY");
                    if (data.DisplayModifiedDate == "Invalid date" || "") {
                        data.DisplayModifiedDate = data.DisplayModifiedDate.replaceAll("Invalid date", "");
                    }
                    data.DisplayCreatedDate = moment(data.Created).format("DD/MM/YYYY");
                    if (data.DisplayCreatedDate == "Invalid date" || "") {
                        data.DisplayCreatedDate = data.DisplayCreatedDate.replaceAll("Invalid date", "");
                    }

                    data?.AllowedUsers?.map((elem: any) => userTitle?.push(elem?.Title))
                }
                setPermissionTitle(data?.Title)
                setEditData(data)
                setVId(data.ID)
                setDefaultSelectedUser(userTitle);
            })

        }
    }
    const addFunction = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let peopleAndGroupId: any = [];
            selectedPersonsAndGroups?.map((user: any) => {
                let foundPerson = usersAndGroups?.find((person: any) => person?.LoginName == user?.id);
                if (foundPerson?.Id != undefined) {
                    peopleAndGroupId?.push(foundPerson?.Id)
                }
            })
            let web = new Web(pageInfo.WebFullUrl);
            await web.lists.getByTitle('ComponentPermissions').items.add({
                Title: PermissionTitle,
                AllowedUsersId: { 'results': peopleAndGroupId }
            }).then((data: any) => {
                closePopup('add')
            }).catch((error: any) => {
                console.error('Error While adding ', error);
                alert(error?.data?.responseBody["odata.error"].message?.value)
            })
        }
    }






    const closePopup = (type?: any | undefined) => {
        props.callBack(type);
    }



    const onRenderCustomHeader = (
    ) => {
        return (
            <>
                <div className="full-width pb-1" > <h3>
                    <span className="siteColor">
                        {props?.SelectedEditItem?.Id != undefined ? `Edit Permission - ${props?.SelectedEditItem?.Title}` : 'Add Permission'}
                    </span>
                </h3>
                </div>
                <Tooltip ComponentId={11945} />
            </>
        );
    };
    const removeItem = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let web = new Web(pageInfo.WebFullUrl);
            if (confirm('Are you sure you want to delete this Permission.?')) {
                await web.lists.getByTitle('ComponentPermissions').items.getById(props?.SelectedEditItem?.Id).recycle().then((data: any) => {
                    closePopup('update')
                })
            }

        }
    }
    const updateItem = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let peopleAndGroupId: any = [];
            selectedPersonsAndGroups?.map((user: any) => {
                let foundPerson = usersAndGroups?.find((person: any) => person?.LoginName == user?.id);
                if (foundPerson?.Id != undefined) {
                    peopleAndGroupId?.push(foundPerson?.Id)
                }
            })
            let web = new Web(pageInfo.WebFullUrl);
            await web.lists.getByTitle('ComponentPermissions').items.getById(props?.SelectedEditItem?.Id).update({
                Title: PermissionTitle,
                AllowedUsersId: { 'results': peopleAndGroupId }
            }).then((data: any) => {
                closePopup('update')
            }).catch((error: any) => {
                console.error('Error While Updating ', error);
                alert(error?.data?.responseBody["odata.error"].message?.value)
            })

        }
    }
    const handlePeopleChange = (people: any) => {
        setSelectedPersonsAndGroups(people)
        // console.log(people)
    }
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeader}
                type={PanelType.medium}
                isOpen={true}
                onDismiss={() => closePopup()}
                isBlocking={false}>

                <div>
                    <span >
                        <div>
                            <span>
                                <input type='text' className='form-control' disabled={props?.SelectedEditItem?.Id != undefined ? true : false} placeholder='Enter Title' value={PermissionTitle} onChange={(e) => { setPermissionTitle(e.target.value) }} />

                            </span>
                        </div>
                        <div className='peoplePickerPermission' style={{ zIndex: '999999999999' }}>
                            <PeoplePicker
                                context={props.context}
                                principalTypes={[PrincipalType.User, PrincipalType.SharePointGroup, PrincipalType.SecurityGroup, PrincipalType.DistributionList]}
                                personSelectionLimit={10}
                                titleText="Allowed Users/Groups"
                                resolveDelay={1000}
                                onChange={handlePeopleChange}
                                showtooltip={true}
                                required={true}
                                defaultSelectedUsers={DefaultSelectedUser}
                            ></PeoplePicker>
                        </div>
                    </span>

                </div>
                <footer className='alignCenter'>
                    {
                        props?.SelectedEditItem?.Id != undefined ? <div className="col text-start">
                            <div>Created <span>{Editdata?.DisplayCreatedDate}</span> by
                                <span className="primary-color"> {Editdata?.Author?.Title}</span>
                            </div>
                            <div>Last modified <span> {Editdata?.DisplayModifiedDate}</span>
                                by
                                <span className="primary-color"> {Editdata?.Editor?.Title}</span>
                            </div>
                            <div> <a className="alignIcon" onClick={() => removeItem()}><i className="svg__iconbox hreflink mini svg__icon--trash" aria-hidden="true"></i>
                                <span> Delete this item</span></a></div>
                        </div> : ''}
                    <div className="col text-end">
                    <a className='me-1' data-interception="off"
                                target="_blank"
                                href={`${props.context?._pageContext?._web.absoluteUrl}/Lists/ComponentPermissions/EditForm.aspx?ID=${vId}`}
                            >
                                Open out-of-the-box form
                            </a>
                        {
                            props?.SelectedEditItem?.Id != undefined ?
                                <Button type="button" variant="primary" className='me-1' onClick={() => updateItem()}>Save</Button> :
                                <Button type="button" variant="primary" className='me-1' onClick={() => addFunction()}>Create</Button>
                        }
                        <Button type="button" className="btn btn-default" variant="secondary" onClick={() => closePopup()}>Cancel</Button>
                    </div>
                </footer>

            </Panel>

        </>
    )
}

export default ContentPermissionPopup