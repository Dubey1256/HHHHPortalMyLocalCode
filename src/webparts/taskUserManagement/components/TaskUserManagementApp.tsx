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

        const fetchedData = await web.lists.getById(props.props.TaskUserListId).items.select("Id,Title,TimeCategory,technicalGroup,CategoriesItemsJson,Suffix,SortOrder,IsApprovalMail,Item_x0020_Cover,ItemType,Created,Company,Role,Modified,IsActive,IsTaskNotifications,DraftCategory,UserGroup/Title,UserGroup/Id,AssingedToUser/Title,AssingedToUser/Name,AssingedToUser/Id,Author/Name,Author/Title,Editor/Name,Approver/Id,Approver/Title,Approver/Name,Editor/Title,Email")
            .expand("Author,Editor,AssingedToUser,UserGroup,Approver").orderBy("Title", true).get();

        // setTaskUsersListData(fetchedData)
        setTaskUsersListData(fetchedData.filter((item: any) => item.ItemType === "User"))
        setTaskGroupsListData(fetchedData.filter((item: any) => item.ItemType === "Group"))

        const fetchedSmartMetaData = await web.lists.getById(props.props.SmartMetaDataId).items.select("Id,ParentID,TaxType,Title,listId,siteUrl,SortOrder,Configurations").getAll();
        setSmartMetaDataItems(fetchedSmartMetaData)
    }

    useEffect(() => { fetchAPIData() }, [])

    let context = props.props.context

    return (
        <>
            <div className='heading'>TaskUser Management</div>
            <TaskUserManagementTable TaskUsersListData={taskUsersListData} TaskGroupsListData={taskGroupsListData} baseUrl={baseUrl} TaskUserListId={props.props.TaskUserListId} context={context} fetchAPIData={fetchAPIData} smartMetaDataItems={smartMetaDataItems}/>
        </>
    )
}

export default TaskUserManagementApp
