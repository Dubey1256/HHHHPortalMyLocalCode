import * as React from 'react'
import { Web } from "sp-pnp-js";
import { useState, useEffect } from "react";
import TaskUserManagementTable from './TaskUserManagementTable';

const TaskUserManagementApp = (props: any) => {
    const [taskUsersListData, setTaskUsersListData] = useState([])
    const [taskGroupsListData, setTaskGroupsListData] = useState([])
    const [smartMetaDataItems, setSmartMetaDataItems] = useState([])
    const baseUrl = props.props.context.pageContext._web.absoluteUrl

    const fetchAPIData = async () => {
        const web = new Web(baseUrl);

        const fetchedData = await web.lists.getById(props.props.TaskUserListId).items.select("Id,Title,TimeCategory,Team,CategoriesItemsJson,Suffix,SortOrder,IsApprovalMail,Item_x0020_Cover,ItemType,Created,Company,Role,Modified,IsActive,IsTaskNotifications,DraftCategory,UserGroup/Title,UserGroup/Id,AssingedToUser/Title,AssingedToUser/Name,AssingedToUser/Id,Author/Name,Author/Title,Editor/Name,Approver/Id,Approver/Title,Approver/Name,Editor/Title,Email")
            .expand("Author,Editor,AssingedToUser,UserGroup,Approver").orderBy("Title", true).get();

        // setTaskUsersListData(fetchedData)
        setTaskUsersListData(fetchedData.filter((item: any) => item.ItemType === "User"))
        setTaskGroupsListData(fetchedData.filter((item: any) => item.ItemType === "Group"))

        const fetchedSmartMetaData = await web.lists.getById(props.props.SmartMetaDataId).items.select("Id,ParentID,Parent/Id,Parent/Title,TaxType,Title,listId,siteUrl,SortOrder,Configurations").expand("Parent").getAll();
        setSmartMetaDataItems(fetchedSmartMetaData)
    }

    useEffect(() => { fetchAPIData() }, [])

    let context = props.props.context

    return (
        <>
            <h2 className='heading mb-3'>TaskUser Management
                <a className='f-15 fw-semibold hreflink pull-right' href='https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskUser-Management.aspx' target="_blank">Old TaskUser Management</a>
            </h2>
            <TaskUserManagementTable TaskUsersListData={taskUsersListData} TaskGroupsListData={taskGroupsListData} baseUrl={baseUrl} TaskUserListId={props.props.TaskUserListId} context={context} fetchAPIData={fetchAPIData} smartMetaDataItems={smartMetaDataItems} />
        </>
    )
}

export default TaskUserManagementApp
