import * as React from 'react'
import { Web } from "sp-pnp-js";
import { useState, useEffect } from "react";
import TaskUserManagementTable from './TaskUserManagementTable';
import EditPage from '../../../globalComponents/EditPanelPage/EditPage';

const TaskUserManagementApp = (props: any) => {
    const [taskUsersListData, setTaskUsersListData] = useState([])
    const [taskGroupsListData, setTaskGroupsListData] = useState([])
    const [smartMetaDataItems, setSmartMetaDataItems] = useState([])
    const [headerChange, setHeaderChange]: any = useState('');
    const baseUrl = props.props.context.pageContext._web.absoluteUrl
    let AllListid: any = {
        TaskUsertListID: props.props.TaskUserListId,
        SmartMetadataListID: props.props.SmartMetaDataId,
        siteUrl: props.props.context.pageContext._web.absoluteUrl,
    }
    const fetchAPIData = async () => {
        const web = new Web(baseUrl);

        const fetchedData = await web.lists.getById(props.props.TaskUserListId).items.select("Id,Title,TimeCategory,Team,CategoriesItemsJson,Suffix,SortOrder,IsApprovalMail,Item_x0020_Cover,ItemType,Created,Company,Role,Modified,IsActive,IsTaskNotifications,DraftCategory,UserGroup/Title,UserGroup/Id,AssingedToUser/Title,AssingedToUser/Name,AssingedToUser/Id,Author/Name,Author/Title,Editor/Name,Approver/Id,Approver/Title,Approver/Name,Editor/Title,Email")
        .expand("Author,Editor,AssingedToUser,UserGroup,Approver").orderBy("Title", true).get();

        const taskUsersListData = fetchedData.filter((item: any) => item.ItemType === "User");
        const taskGroupsListData = fetchedData.filter((item: any) => item.ItemType === "Group");

        const updatedTaskUsersListData = taskUsersListData.map((item: any) => {
            const approverTitles = item.Approver ? item.Approver.map((approver: any) => approver.Title).join(', ') : '';
            const roleTitles = item.Role ? item.Role.map((role: any) => role).join(', ') : '';
            
            return {
                ...item,
                ApproverTitle: approverTitles,
                RoleTitle: roleTitles
            };
        });

        setTaskUsersListData(updatedTaskUsersListData )
        setTaskGroupsListData(taskGroupsListData)


        const fetchedSmartMetaData = await web.lists.getById(props.props.SmartMetaDataId).items.select("Id,ParentID,Parent/Id,Parent/Title,TaxType,Title,listId,siteUrl,SortOrder,Configurations").expand("Parent").getAll();
        setSmartMetaDataItems(fetchedSmartMetaData)
    }

    useEffect(() => { fetchAPIData() }, [])

    const changeHeader=(items:any)=>{
        setHeaderChange(items)
      }

    let context = props.props.context
    context.siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
    context.SitePagesList = props.props.SitePagesList;

    return (
        <>
            <h2 className='heading mb-3'>{headerChange != undefined && headerChange != null && headerChange != '' ? headerChange : 'TaskUser Management'}
            <EditPage context={context} changeHeader={changeHeader} />
                <a className='f-15 fw-semibold hreflink pull-right' href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskUser-Management-Old.aspx" target='_blank' data-interception='off'>Old TaskUser Management</a>
            </h2>
            <TaskUserManagementTable TaskUsersListData={taskUsersListData} AllListid={AllListid} TaskGroupsListData={taskGroupsListData} baseUrl={baseUrl} TaskUserListId={props.props.TaskUserListId} context={context} fetchAPIData={fetchAPIData} smartMetaDataItems={smartMetaDataItems} />
        </>
    )
}

export default TaskUserManagementApp
