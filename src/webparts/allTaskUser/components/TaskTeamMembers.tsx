import { Checkbox, ChoiceGroup, CommandBar, DefaultButton, Dialog, DialogFooter, DialogType, DocumentCard, FontIcon, FontSizes, IChoiceGroupOption, ICommandBarItemProps, Icon, IContextualMenuItem, IContextualMenuProps, IDropdownOption, Image, ImageFit, Label, Link, mergeStyles, Panel, PrimaryButton, SearchBox, Text, TextField } from "office-ui-fabric-react";
import { buildColumns, DetailsList, DetailsListLayoutMode, Dropdown, IColumn, PanelType, Pivot, PivotItem, PivotLinkFormat, PivotLinkSize, Selection, SelectionMode, ConstrainMode, Stack, IPersonaProps, PersonaSize, Persona, TooltipHost, IStackTokens } from "@fluentui/react";
import * as React from "react";
import { Component } from "react";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { ITeamMembersProps } from "./ITeamMembersProps";
import { ITeamMembersState } from "./ITeamMembersState";
import * as pnp from 'sp-pnp-js';
import {Web, sp } from 'sp-pnp-js';
import { List, Item } from '@pnp/sp/presets/all';
import { SPHttpClient } from '@microsoft/sp-http';
import { getSP } from "../../../spservices/pnpjsConfig"
import TaskUsersTable from "./TaskUsersTable";
import Tooltip from "../../../globalComponents/Tooltip";
import axios from "axios";

const controlStyles = {
    root: {
        margin: '10px 5px 20px 0',
        maxWidth: '300px'
    }
};

const iconClass = mergeStyles({
    fontSize: 25,
    height: 25,
    width: 25,
    margin: '0 5px',
});

const appTypeOptions: IChoiceGroupOption[] = [
    { key: 'Approve All', text: 'Approve All' },
    { key: 'Approve Selected', text: 'Approve Selected' },
    { key: 'Decide Case By Case', text: 'Case by Case' }
];

const compOptions: IChoiceGroupOption[] = [
    { key: 'HHHH', text: 'HHHH Team' },
    { key: 'Smalsus', text: 'Smalsus Team' }
];

const deleteDialogContentProps = {
    type: DialogType.close,
    title: 'Delete Team Member',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure, you want to delete this?',
};

const selExistingImageOptions: IChoiceGroupOption[] = [
    { key: "Logos", text: "LOGOS" },
    { key: "Page-Images", text: "IMAGES" },
    { key: "Portraits", text: "PORTRAITS" }
];

const stackTokens: IStackTokens = {
    childrenGap: 5
};

export default class TaskTeamMembers extends Component<ITeamMembersProps, ITeamMembersState> {
    private _selection: Selection;
    private commandBarItems: ICommandBarItemProps[] = null;
    private _sp: any;
    private _webSerRelURL: any;
    private roleDefId: any
    private web = new Web(this.props.context.pageContext.web.absoluteUrl);
    constructor(props: ITeamMembersProps) {
        super(props);
        this._sp = getSP();
        this.getWebInformation();
        this.state = {
            tasks: [],
            searchText: "",
            folderUrl: '',
            reloadComponent: false,
            showCreatePanel: false,
            showEditPanel: false,
            enableSave: false,
            hideDeleteDialog: true,
            selTaskId: undefined,
            activeTab: "basic",
            sortedItems: [],
            columns: [],
            taskItem: {
                itemType: "User",
                userTitle: undefined,
                userSuffix: undefined,
                groupId: "",
                sortOrder: undefined,
                userId: undefined,
                userMail: [],
                timeCategory: "",
                approverId: [],
                approverMail: [],
                approvalType: undefined,
                selSmartMetadataItems: [],
                company: "Smalsus",
                roles: [],
                isActive: false,
                isTaskNotifications: false,
                itemCover: ""
            },
            timesheetCategories: [],
            teamGroups: [],
            smartMetadataItems: [],
            hideSmartMetadataMenu: true,
            selImageFolder: "Portraits",
            allImages: [],
            filteredImages: [],
            uploadedImage: {
                fileName: "",
                fileURL: ""
            },
            onImageHover: false,
            enableUser: false
        };
        this._selection = new Selection({
            onSelectionChanged: this._onItemsSelectionChanged,
        });
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
        this.getApproverDetails = this.getApproverDetails.bind(this);
        this.onAddTeamMemberClick = this.onAddTeamMemberClick.bind(this);
        this.onSaveTask = this.onSaveTask.bind(this);
        this.onEditTask = this.onEditTask.bind(this);
        this.onEditIconClick = this.onEditIconClick.bind(this);
        this.onDeleteTask = this.onDeleteTask.bind(this);
        this.onDeleteIconClick = this.onDeleteIconClick.bind(this);
        this.onCancelTask = this.onCancelTask.bind(this);
        this.onCancelDeleteDialog = this.onCancelDeleteDialog.bind(this);
        this.onConfirmDeleteDialog = this.onConfirmDeleteDialog.bind(this);
        this.createTask = this.createTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.updateGallery = this.updateGallery.bind(this);

        this.onUserTitleChange = this.onUserTitleChange.bind(this);
        this.onUserSuffixChange = this.onUserSuffixChange.bind(this);
        this.onGroupChange = this.onGroupChange.bind(this);
        this.onSortOrderChange = this.onSortOrderChange.bind(this);
        this.onManageTimeCategory = this.onManageTimeCategory.bind(this);
        this.onApprovalTypeChange = this.onApprovalTypeChange.bind(this);
        this.onCompanyChange = this.onCompanyChange.bind(this);
        this.onComponentTeamsChecked = this.onComponentTeamsChecked.bind(this);
        this.onServiceTeamsChecked = this.onServiceTeamsChecked.bind(this);
        this.onActiveUserChecked = this.onActiveUserChecked.bind(this);
        this.onTaskNotificationsChecked = this.onTaskNotificationsChecked.bind(this);
        this.onItemCoverChange = this.onItemCoverChange.bind(this);
        this.onOpenSmartMetadataMenu = this.onOpenSmartMetadataMenu.bind(this);
        this.onAddSmartMetadataItem = this.onAddSmartMetadataItem.bind(this);
        this.onRemoveSmartMetadataItem = this.onRemoveSmartMetadataItem.bind(this);
        this.onImageFolderChanged = this.onImageFolderChanged.bind(this);
        this.onImageSelected = this.onImageSelected.bind(this);
        this.onImageCleared = this.onImageCleared.bind(this);
        this.onImageAdded = this.onImageAdded.bind(this);

        this.getSubMenuItems = this.getSubMenuItems.bind(this);
        this.menuProps = this.menuProps.bind(this);

        this.getUserPersona = this.getUserPersona.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);

        this.commandBarItems = [
            {
                key: "editTask",
                text: "Edit User",
                iconProps: { iconName: "Edit" },
                onClick: () => { this.onEditTask() }
            },
            {
                key: "deleteTask",
                text: "Delete User",
                iconProps: { iconName: "Delete" },
                onClick: () => { this.onDeleteTask() }
            }
        ];
    }
    private async getWebInformation() {
        const webInfo = await this._sp.web();
        this._webSerRelURL = webInfo.ServerRelativeUrl;
    }

    public async componentDidMount() {
        //let IChoiceGroupOptions = 'PORTRAITS'
        // this.onImageFolderChanged('ev', IChoiceGroupOptions:IChoiceGroupOption)
        const _tasksRes = await this.props.spService.getTasks(this.props.taskUsersListId);
        const _tasks = this.getMemberTasks(_tasksRes);
        const _groupTasks = this.getGroupTasks(_tasksRes);

        let teamGroups: IDropdownOption[] = [{
            key: "",
            text: "Select"
        }];

        _groupTasks.forEach((teamGroup) => teamGroups.push({
            key: teamGroup.TaskId,
            text: teamGroup.Title
        }));

        let timesheetCategories: IDropdownOption[] = [{
            key: "",
            text: "Select"
        }];

        let taxTypes: string[] = ["TimesheetCategories"];
        const resTimesheetCategories = await this.props.spService.getSmartMetadata(this.props.smartMetadataListId, taxTypes);
        if (resTimesheetCategories.length > 0) {
            const existingTitles = new Set();
            resTimesheetCategories.forEach((tsCategory) => {
                const title = tsCategory.Title;
                if (!existingTitles.has(title)) {
                    timesheetCategories.push({
                        key: title,
                        text: title
                    });
                    existingTitles.add(title);
                }
            });
        }
        taxTypes = ["Categories", "Category", "teamSites", "Sites", "TimesheetCategories"];
        let resCategories = await this.props.spService.getSmartMetadata(this.props.smartMetadataListId, taxTypes);
        let smartMetadataItems: IContextualMenuItem[] = [];

        resCategories.filter(({ TaxType, ParentID }) => (TaxType == "Categories" && ParentID == 0)).forEach(item => {
            let smartMetadataItem: IContextualMenuItem = {
                key: item.Id,
                text: item.Title,
                disabled: false,
                onClick: () => this.onAddSmartMetadataItem(item),
                subMenuProps: this.getSubMenuItems(resCategories.filter(i => i.ParentID == item.Id), resCategories)
            }
            smartMetadataItems.push(smartMetadataItem);
        });

        const listTasks: any[] = [..._tasks].map(({ Title, Group, Category, Role,Team, SortOrder, Suffix, Item_x0020_Cover, Company, Approver, TaskId }) => ({ Title, Group, Category, Role, SortOrder,Team, Suffix, Item_x0020_Cover, Company, Approver, TaskId }));
        let filteredImages: any = []
        let _filteredImages: any = []
        //let filteredImages = await this.props.spService.getImages(this.props.imagesLibraryId, this.state.selImageFolder);
        filteredImages = await this.web.getFolderByServerRelativeUrl(`${this._webSerRelURL}/PublishingImages/${this.state.selImageFolder}`).files.get().then((files) => {
            _filteredImages = files?.map((filteredImage: any) => ({
                //Id: filteredImage.Id,
                Name: filteredImage.Name,
                URL: filteredImage.ServerRelativeUrl
            }));
        }).catch((error) => {
            console.log(error)
        })
        console.log(_filteredImages)
        // let _filteredImages = filteredImages?.map((filteredImage: any) => ({
        //     Id: filteredImage.Id,
        //     Name: filteredImage.FileLeafRef,
        //     URL: filteredImage.EncodedAbsUrl
        // }));

        const _approverId: number = (await this.getUserInfo(this.props.defaultApproverEMail)).Id;
        const _taskItem = { ...this.state.taskItem };
        _taskItem.approverMail.push(this.props.defaultApproverEMail);
        _taskItem.approverId.push(_approverId);

        this.setState({
            tasks: _tasks,
            sortedItems: listTasks,
            columns: this._buildColumns(listTasks),
            timesheetCategories: timesheetCategories,
            smartMetadataItems: smartMetadataItems,
            filteredImages: _filteredImages,
            taskItem: _taskItem,
            teamGroups: teamGroups
        });
    }

    private getMemberTasks(allTasks: any[]) {
        const teamMembersTasks = allTasks.filter(taskItem => taskItem.ItemType == "User").map(taskItem => ({
            Title: taskItem.Title,
            Group: taskItem.UserGroup ? taskItem.UserGroup.Title : "",
            Category: taskItem.TimeCategory,
            Role: taskItem.Role ? (taskItem.Role.map((i: string) => {
                if (i == 'Deliverable Teams') { return "Component Teams" }
                else { return i }
            }).join(",")) : "",
            Company: taskItem.Company,
            Approver: taskItem.Approver ? taskItem.Approver.map((i: { Title: any; }) => i.Title).join(", ") : "",
            TaskId: taskItem.Id,
            Suffix: taskItem.Suffix,
            Team:taskItem.Team,
            SortOrder: taskItem.SortOrder,
            GroupId: taskItem.UserGroup ? taskItem.UserGroup.Id.toString() : "",
            AssignedToUserMail: taskItem.AssingedToUser ? [taskItem.AssingedToUser.Name.split("|")[2]] : [],
            ApproverMail: taskItem.Approver ? taskItem.Approver.map((i: { Name: string; }) => i.Name.split("|")[2]) : [],
            ApprovalType: taskItem.IsApprovalMail,
            Item_x0020_Cover: taskItem.Item_x0020_Cover ? taskItem.Item_x0020_Cover : '',
            CategoriesItemsJson: taskItem.CategoriesItemsJson != null ? JSON.parse(taskItem.CategoriesItemsJson) : [],
            TimeCategory: taskItem.TimeCategory,
            IsActive: taskItem.IsActive,
            IsTaskNotifications: taskItem.IsTaskNotifications,
            ItemCover: taskItem.Item_x0020_Cover,
            CreatedOn: taskItem.Created.split("T")[0],
            CreatedBy: taskItem.Author.Title,
            ModifiedOn: taskItem.Modified.split("T")[0],
            ModifiedBy: taskItem.Editor.Title
        }));
        return teamMembersTasks;
    }

    private getGroupTasks(allTasks: any[]) {
        const teamGroupsTasks = allTasks.filter(taskItem => taskItem.ItemType == "Group").map(taskItem => ({
            Title: taskItem.Title,
            Suffix: taskItem.Suffix,
            SortOrder: taskItem.SortOrder,
            AssignedToUserMail: taskItem.AssingedToUser ? [taskItem.AssingedToUser.Name.split("|")[2]] : [],
            CreatedOn: taskItem.Created.split("T")[0],
            CreatedBy: taskItem.Author.Title,
            ModifiedOn: taskItem.Modified.split("T")[0],
            ModifiedBy: taskItem.Editor.Title,
            TaskId: taskItem.Id.toString()
        }));
        return teamGroupsTasks;
    }

    private getSubMenuItems(menuColl: any[], allItems: any[]) {
        let items: any[] = [];
        menuColl.forEach(item => {
            let obj: IContextualMenuItem = {
                key: item.Id,
                text: item.Title,
                onClick: () => this.onAddSmartMetadataItem(item)
            }

            if (allItems.filter(i => i.ParentID == item.Id).length > 0) {
                obj.subMenuProps = this.getSubMenuItems(allItems.filter(i => i.ParentID == item.Id), allItems)
            }
            items.push(obj)
        });
        return { items: items };
    }

    private onSearchTextChange(ev: any, searchText: string) {
        let filterText = searchText.toLowerCase();
        let allTasks = [...this.state.tasks];
        allTasks = allTasks.map(({ Title, Group, Category, Role, Company, Approver, TaskId }) => ({ Title, Group, Category, Role, Company, Approver, TaskId }));
        let fliteredTasks = [];
        let textExists: boolean;
        let cellValue: string | undefined;
        if (filterText.length >= 3) {
            allTasks.forEach((taskItem) => {
                textExists = false;
                Object.keys(taskItem).forEach(key => {
                    cellValue = taskItem[key];
                    if (cellValue && cellValue.toString().toLowerCase().indexOf(filterText) > -1) {
                        textExists = true;
                    }
                });
                if (textExists) {
                    fliteredTasks.push(taskItem);
                }
            });
        }
        else {
            fliteredTasks = allTasks;
        }
        this.setState({
            searchText: searchText,
            tasks: fliteredTasks,
            sortedItems: fliteredTasks,
            columns: this._buildColumns(fliteredTasks)
        });
    }

    private onEditIconClick(selTaskId: number) {
        this.setState({
            selTaskId: selTaskId,
            enableUser: false,
            activeTab: "basic",
        }, this.onEditTask);
    }

    private async onEditTask() {
        let allTasks = [...this.state.tasks];
        let selTask = allTasks.filter(t => t.TaskId == this.state.selTaskId)[0];
        console.log(selTask);
        let selTaskItem = { ...this.state.taskItem };
        if (selTask.ApproverMail != undefined && selTask.ApproverMail[0] != undefined) {
            let userInfo = await this.getUserInfo(selTask.ApproverMail[0]);
            selTaskItem.approverId = [userInfo.Id]
        }
        selTaskItem.userTitle = selTask.Title;
        selTaskItem.userSuffix = selTask.Suffix;
        selTaskItem.groupId = selTask.GroupId;
        selTaskItem.sortOrder = selTask.SortOrder;
        selTaskItem.userMail = selTask.AssignedToUserMail;
        selTaskItem.approverMail = selTask.ApproverMail;
        selTaskItem.timeCategory = selTask.TimeCategory;
        selTaskItem.approvalType = selTask.ApprovalType;
        selTaskItem.selSmartMetadataItems = selTask?.CategoriesItemsJson;
        selTaskItem.company = selTask.Company;
        selTaskItem.roles = selTask.Role ? selTask.Role.split(",") : []
        selTaskItem.isActive = selTask.IsActive,
            selTaskItem.isTaskNotifications = selTask.IsTaskNotifications,
            selTaskItem.itemCover = selTask.ItemCover ? selTask.ItemCover.Url : "",
            selTaskItem.createdOn = selTask.CreatedOn,
            selTaskItem.createdBy = selTask.CreatedBy,
            selTaskItem.modifiedOn = selTask.ModifiedOn,
            selTaskItem.modifiedBy = selTask.ModifiedBy

        this.setState({
            showEditPanel: true,
            taskItem: selTaskItem,
            enableSave: true
        });
    }

    private onDeleteIconClick(selTaskId: number) {
        this.setState({
            selTaskId: selTaskId
        }, this.onDeleteTask);
    }

    private onDeleteTask() {
        this.setState({
            hideDeleteDialog: false
        });
    }

    private _onItemsSelectionChanged = () => {
        let selTasks = this._selection.getSelection();
        let selTaskId = undefined;
        if (selTasks.length > 0) {
            selTaskId = (selTasks[0] as any).TaskId
        }
        this.setState({
            selTaskId: selTaskId
        });
    };

    private async getUserDetails(users: any[]) {

        let userId: number = undefined;
        let userTitle: string = undefined;
        let userSuffix: string = undefined;
        let enableSave: boolean = false;

        if (users.length > 0) {
            let userMail = users[0].id.split("|")[2];
            let userInfo = await this.getUserInfo(userMail);
            userId = userInfo.Id;
            userTitle = userInfo.Title;
            userSuffix = userTitle.split(" ").map(i => i.charAt(0)).join("");
            enableSave = true;
        }

        let taskItem = { ...this.state.taskItem };
        taskItem.userId = userId;
        taskItem.userTitle = userTitle;
        taskItem.userSuffix = userSuffix;
        this.setState({
            taskItem: taskItem,
            enableSave: enableSave
        })
    }

    private async getApproverDetails(approvers: any[]) {
        let approverId: number = undefined;
        if (approvers.length > 0) {
            let approverMail = approvers[0].id.split("|")[2];
            let userInfo = await this.getUserInfo(approverMail);
            approverId = userInfo.Id;
        }
        let taskItem = { ...this.state.taskItem };
        if (approverId != undefined) {
            taskItem.approverId = [approverId];
        } else {
            taskItem.approverId = []
        }
        this.setState({
            taskItem: taskItem
        })
    }
    private async onAddTeamMemberClick() {
        const initialCreatetaskItem = {
            itemType: "User",
            userTitle: undefined as any | undefined,
            userSuffix: undefined as any | undefined,
            groupId: "",
            sortOrder: undefined as any | undefined,
            userId: undefined as any | undefined,
            userMail: [] as any[] | [],
            timeCategory: "",
            approverId: [] as number[],
            approverMail: [] as string[],
            approvalType: undefined as any | undefined,
            selSmartMetadataItems: [] as any[] | [],
            company: "Smalsus",
            roles: [] as any[] | [],
            isActive: false,
            isTaskNotifications: false,
            itemCover: ""
        };
        const _approverId: number = (await this.getUserInfo(this.props.defaultApproverEMail)).Id;
        const CreatetaskItem = { ...initialCreatetaskItem };
        CreatetaskItem.approverMail.push(this.props.defaultApproverEMail);
        CreatetaskItem.approverId.push(_approverId);
        this.setState({
            taskItem: CreatetaskItem,
            showCreatePanel: true,
            selTaskId:undefined,
            enableUser: true,
            enableSave: false
        });
    }
    getRoleDefinitions = async () => {
        const roleDefinitions = await pnp.sp.web.roleDefinitions.get();
        roleDefinitions.forEach((i: any) => {
            if (i.Name == "Full Control")
                this.roleDefId = i.Id
        })
        console.log(roleDefinitions);
    };
    private onSaveTask() {
        this.getRoleDefinitions();
        if (this.state.selTaskId) {
            this.updateTask();
        }
        else {
            this.createTask();
        }
    }

    taskUsersListId = this.props.taskUsersListId;
    querySelect: string = 'Id,Title,FileLeafRef,File_x0020_Type,Modified,Created,EncodedAbsUrl&$filter=FSObjType eq 1'
    getListItemsInBatch = async (listId: string, querySelect: string, batchSize: number) => {
        const list = sp.web.lists.getById(listId);
        let allItems: any[] = [];
        let skip = 0;
        try {
            while (true) {
                const items = await list.items.select(querySelect).orderBy('Modified', false).top(batchSize).skip(skip).get();
                if (items.length === 0) {
                    break;
                }
                allItems = allItems.concat(items);
                skip += batchSize;
            }

            return allItems;
        } catch (error) {
            console.error('Error getting list items:', error);
            throw error;
        }
    };
    createNewFolder = async (folderName: any, UpdatedData: any, SiteUrl: any, ListId: any) => {
        const groupID: number = 63;
        const SmalsusgroupID: number = 62;
        const userId: number = this.state.taskItem.userId
        const list = sp.web.lists.getByTitle(ListId);
        const folderNames = `${UpdatedData.company}/${folderName}`;
        await list.items.add({
            FileSystemObjectType: 1,
            ContentTypeId: "0x0120"
        })
            .then(async (res) => {
                const lists = sp.web.lists.getByTitle(ListId);
                const ResDataId = res.data.Id
                await lists.items.getById(res.data.Id).update({
                    Title: folderName,
                    FileLeafRef: folderNames
                })
                    .then(async (res) => {
                        const folderItemData = await list.items.getById(ResDataId).get();
                        const groupId = groupID;
                        const roleDefId = 1073741829;
                        await sp.web.lists.getByTitle(ListId).items.getById(folderItemData.Id).breakRoleInheritance(false);
                        await sp.web.lists.getByTitle(ListId).items.getById(folderItemData.Id).roleAssignments.add(groupId, roleDefId);
                        if (UpdatedData.company == 'Smalsus')
                            await sp.web.lists.getByTitle(ListId).items.getById(folderItemData.Id).roleAssignments.add(SmalsusgroupID, roleDefId);
                        await sp.web.siteUsers.getById(userId).get()
                            .then(async (user) => {
                                await sp.web.lists.getByTitle(ListId).items.getById(folderItemData.Id).roleAssignments.add(user.Id, roleDefId);
                            })
                            .catch((error) => {
                                console.error("Error setting permissions for the user", error);
                            });
                        console.log("Folder created and permissions set.");
                        console.log(res);
                    });
            });
    };
    private async createTask() {
        let SiteUrl = ''
        let taskItem = this.state.taskItem;
        let newTaskItem = {
            Title: taskItem.userTitle,
            Suffix: taskItem.userSuffix,
            AssingedToUserId: taskItem.userId,
            ApproverId: taskItem.approverId,
            ItemType: taskItem.itemType
        }
        const newTask = await this.props.spService.createTask(this.props.taskUsersListId, newTaskItem);
        this.getListItemsInBatch(this.props.taskUsersListId, this.querySelect, 100) // Use an appropriate batch size
            .then((items) => {
                console.log(items);
                let flag = items.filter((i) => i.Title === taskItem.userTitle);
                this.onCancelTask();
                if (flag.length == 0)
                    this.createNewFolder(taskItem.userTitle, taskItem, SiteUrl, 'TasksTimesheet2')
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        if (newTask) {
            this.updateGallery();
            let _taskItem = { ...this.state.taskItem };
            let assignedUserInfo = await this.props.spService.getUserMail(newTask.AssingedToUserId);
            let approverInfo = await this.props.spService.getUserMail(newTask[0]);
            _taskItem.userTitle = newTask.Title;
            _taskItem.userSuffix = newTask.Suffix;
            _taskItem.userId = newTask.AssingedToUserId;
            _taskItem.userMail = [assignedUserInfo.UserPrincipalName];
            _taskItem.approverId = newTask.ApproverId;
            _taskItem.approverMail = [approverInfo.UserPrincipalName];
            this.setState({
                showCreatePanel: false,
                selTaskId: newTask.Id,
                showEditPanel: true,
                enableUser: false,
                taskItem: _taskItem
            });
        }
    }

    private async updateTask() {
        this.onCancelTask();
        let taskItem = this.state.taskItem;
        let updateTaskItem = {
            Title: taskItem.userTitle,
            Suffix: taskItem.userSuffix,
            UserGroupId: taskItem.groupId ? parseInt(taskItem.groupId) : null,
            SortOrder: taskItem.sortOrder != undefined && taskItem.sortOrder != "" && taskItem.sortOrder != undefined && taskItem.sortOrder != '' ? taskItem.sortOrder : null,
            AssingedToUserId: taskItem.userId,
            TimeCategory: taskItem.timeCategory,
            ApproverId: taskItem.approverId,
            IsApprovalMail: taskItem.approvalType,
            CategoriesItemsJson: (this.state.taskItem.selSmartMetadataItems != undefined && this.state.taskItem.selSmartMetadataItems.length > 0) ? JSON.stringify(this.state.taskItem.selSmartMetadataItems) : null,
            Company: taskItem.company,
            Role: taskItem.roles,
            IsActive: taskItem.isActive,
            IsTaskNotifications: taskItem.isTaskNotifications,
            Item_x0020_Cover: {
                Url: taskItem.itemCover,
                Description: taskItem.itemCover
            }
        };
        console.log(updateTaskItem);
        taskItem.groupId = null

        const updateTask = await this.props.spService.editTask(this.props.taskUsersListId, this.state.selTaskId, updateTaskItem);

        if (updateTask) {
            this.updateGallery();
            this.setState({
                selTaskId: undefined,
                showEditPanel: false,
                enableSave: false
            });
        }
    }

    private async deleteTask() {

        await this.props.spService.deleteTask(this.props.taskUsersListId, this.state.selTaskId);

        this.updateGallery();

        this.setState({
            selTaskId: undefined,
            showEditPanel: false
        });

    }

    private async uploadImage() {
        let resImage = await this.props.spService.addImage(this.state.selImageFolder, this.state.uploadedImage);
        if (resImage) {
            let hostWebURL = this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl, "");
            let imageURL: string = `${hostWebURL}${resImage.data.ServerRelativeUrl}`;
            let taskItem = { ...this.state.taskItem };
            taskItem.itemCover = imageURL;
            this.setState({
                taskItem: taskItem
            });
        }
    }

    private onCancelTask() {
        this.setState({ reloadComponent: !this.state.reloadComponent });
        this.setState({
            showCreatePanel: false,
            showEditPanel: false
        });
    }

    private onCancelDeleteDialog() {
        this.setState({
            hideDeleteDialog: true
        });
    }

    private onConfirmDeleteDialog() {
        this.setState({
            hideDeleteDialog: true
        });
        this.deleteTask();
    }

    private async updateGallery() {

        const allTasks = await this.props.spService.getTasks(this.props.taskUsersListId);

        const teamMembersTasks = allTasks.filter((taskItem: { ItemType: string; }) => taskItem.ItemType == "User").map((taskItem: {
            Team: any; Title: any; UserGroup: { Title: any; Id: { toString: () => any; }; }; TimeCategory: any; Role: string[]; Company: any; Approver: any[]; Id: any; Suffix: any; AssingedToUser: { Name: string; }; IsApprovalMail: any; CategoriesItemsJson: string; SortOrder: null; IsActive: any; IsTaskNotifications: any; Item_x0020_Cover: any; Created: string; Author: { Title: any; }; Modified: string; Editor: { Title: any; }; 
}) => ({
            Title: taskItem.Title,
            Group: taskItem.UserGroup ? taskItem.UserGroup.Title : "",
            Category: taskItem.TimeCategory,
            Role: taskItem.Role ? (taskItem.Role.map((i: string) => {
                if (i == 'Deliverable Teams') { return "Component Teams" }
                else { return i }
            }).join(",")) : "",
            Company: taskItem.Company,
            Approver: taskItem.Approver ? taskItem.Approver.map((i: { Title: any; }) => i.Title).join(", ") : "",
            TaskId: taskItem.Id,
            Suffix: taskItem.Suffix,
            Team: taskItem.Team!=undefined?taskItem.Team:'',
            GroupId: taskItem.UserGroup ? taskItem.UserGroup.Id.toString() : "",
            AssignedToUserMail: taskItem.AssingedToUser ? [taskItem.AssingedToUser.Name.split("|")[2]] : [],
            ApproverMail: taskItem.Approver ? taskItem.Approver.map((i: { Name: string; }) => i.Name.split("|")[2]) : [],
            ApprovalType: taskItem.IsApprovalMail,
            CategoriesItemsJson: taskItem.CategoriesItemsJson ? JSON.parse(taskItem.CategoriesItemsJson) : [],
            SortOrder: taskItem.SortOrder != null && taskItem.SortOrder != undefined ? taskItem.SortOrder : '',
            TimeCategory: taskItem.TimeCategory,
            IsActive: taskItem.IsActive,
            IsTaskNotifications: taskItem.IsTaskNotifications,
            ItemCover: taskItem.Item_x0020_Cover,
            CreatedOn: taskItem.Created.split("T")[0],
            CreatedBy: taskItem.Author.Title,
            ModifiedOn: taskItem.Modified.split("T")[0],
            ModifiedBy: taskItem.Editor.Title
        }));

        let listTasks = teamMembersTasks.map(({ Title, Group, Category, SortOrder, Team, CategoriesItemsJson, Role, Company, Approver, TaskId }) => ({ Title, Group, Category, SortOrder, Team, CategoriesItemsJson, Role, Company, Approver, TaskId }));

        this.setState({
            selTaskId: undefined,
            searchText: "",
            tasks: teamMembersTasks,
            sortedItems: listTasks,
            columns: this._buildColumns(listTasks)
        });
    }

    private onUserTitleChange(_ev: any, newUserTitle: string) {
        let enableSave: boolean = false;
        if (newUserTitle.length > 0) {
            enableSave = true;
        }
        let taskItem = { ...this.state.taskItem };
        taskItem.userTitle = newUserTitle;
        this.setState({
            taskItem: taskItem,
            enableSave: enableSave
        });
    }

    private onUserSuffixChange(_ev: any, newUserSuffix: string) {
        let taskItem = { ...this.state.taskItem };
        taskItem.userSuffix = newUserSuffix;
        this.setState({
            taskItem: taskItem
        });
    }


    // private onGroupChange(ev: any, tgOpt: IDropdownOption) {
    //     let taskItem = { ...this.state.taskItem };
    //     taskItem.groupId = tgOpt.key as string;
    //     this.setState({
    //         taskItem: taskItem
    //     });
    // }

    private onSortOrderChange(_ev: any, newSortOrder: string) {
        let taskItem = { ...this.state.taskItem };
        taskItem.sortOrder = newSortOrder != "" && newSortOrder != undefined && newSortOrder != '' ? newSortOrder : null;
        this.setState({
            taskItem: taskItem
        });
    }
    handleTabClick = (tab: string) => {
        this.setState({ activeTab: tab });
    };

    onGroupChange = (event: any) => {
        const selectedGroupId = event.target.value;
        this.setState({
            taskItem: {
                ...this.state.taskItem,
                groupId: selectedGroupId,
            },
        });
    };
    onManageTimeCategory = (event: any) => {
        const selectedtimeCategoryId = event.target.value.toString();;
        this.setState({
            taskItem: {
                ...this.state.taskItem,
                timeCategory: selectedtimeCategoryId,
            },
        });
    };

    // private onManageTimeCategory(ev: any, tCatOpt: IDropdownOption) {
    //     let taskItem = { ...this.state.taskItem };
    //     taskItem.timeCategory = tCatOpt.key.toString();
    //     this.setState({
    //         taskItem: taskItem
    //     });
    // }

    private onApprovalTypeChange(ev: any, appTypeOpt: IChoiceGroupOption) {
        let taskItem = { ...this.state.taskItem };
        taskItem.approvalType = appTypeOpt.key;
        this.setState({
            taskItem: taskItem
        });
    }

    private onCompanyChange(ev: any, compOpt: IChoiceGroupOption) {
        let taskItem = { ...this.state.taskItem };
        taskItem.company = compOpt.key;
        this.setState({
            taskItem: taskItem
        });
    }

    private onComponentTeamsChecked(ev: any, cTeamsChecked: boolean) {
        let taskItem = { ...this.state.taskItem };
        let roles: string[] = [...taskItem.roles];
        if (cTeamsChecked) {
            roles.push("Component Teams")
        }
        else {
            roles.splice(roles.indexOf("Component Teams"), 1);
        }
        taskItem.roles = roles;
        this.setState({
            taskItem: taskItem
        });
    }

    private onServiceTeamsChecked(ev: any, sTeamsChecked: boolean) {
        let taskItem = { ...this.state.taskItem };
        let roles: string[] = [...taskItem.roles];
        if (sTeamsChecked) {
            roles.push("Service Teams")
        }
        else {
            roles.splice(roles.indexOf("Service Teams"), 1);
        }
        taskItem.roles = roles;
        this.setState({
            taskItem: taskItem
        });
    }

    private onActiveUserChecked(ev: any, actUserChecked: boolean) {
        let taskItem = { ...this.state.taskItem };
        taskItem.isActive = actUserChecked;
        this.setState({
            taskItem: taskItem
        });
    }

    private onTaskNotificationsChecked(ev: any, tNotificationsChecked: boolean) {
        let taskItem = { ...this.state.taskItem };
        taskItem.isTaskNotifications = tNotificationsChecked;
        this.setState({
            taskItem: taskItem
        });
    }

    private onItemCoverChange(ev: any, newURL: string) {
        let taskItem = { ...this.state.taskItem };
        taskItem.itemCover = newURL;
        this.setState({
            taskItem: taskItem
        });
    }

    private onOpenSmartMetadataMenu() {
        this.setState({
            hideSmartMetadataMenu: false
        });
    }

    private onAddSmartMetadataItem(item: any) {
        let existingItem = false;
        let selMetadataItem = {
            Title: item.Title,
            Id: item.Id
        };

        let selSmartMetadataItems = this.state.taskItem.selSmartMetadataItems != undefined ? [...this.state.taskItem.selSmartMetadataItems] : [];
        existingItem = selSmartMetadataItems.filter(mItem => mItem.Id == item.Id).length > 0
        if (!existingItem) {
            selSmartMetadataItems.push(selMetadataItem);
            let taskItem = { ...this.state.taskItem };
            taskItem.selSmartMetadataItems = selSmartMetadataItems;
            this.setState({
                taskItem: taskItem,
                hideSmartMetadataMenu: true
            });
        }
    }

    private onRemoveSmartMetadataItem(mItemId: number) {
        let selSmartMetadataItems = [...this.state.taskItem.selSmartMetadataItems];
        selSmartMetadataItems = selSmartMetadataItems.filter(mItem => mItem.Id != mItemId);
        let taskItem = { ...this.state.taskItem };
        taskItem.selSmartMetadataItems = selSmartMetadataItems;
        this.setState({
            taskItem: taskItem
        });
    }

    private async onImageFolderChanged(ev: any, optImageFolder: IChoiceGroupOption) {
        let selFolderName: string = optImageFolder.key;
        //let filteredImages = await this.props.spService.getImages(this.props.imagesLibraryId, selFolderName);

        var filteredImages: any = []
        //let filteredImages = await this.props.spService.getImages(this.props.imagesLibraryId, this.state.selImageFolder);
        filteredImages = await this.web.getFolderByServerRelativeUrl(`${this._webSerRelURL}/PublishingImages/${selFolderName}`).files.get().then((files) => {
            console.log(files)
            let _filteredImages = files?.map((filteredImage: any) => ({
                //Id: filteredImage.Id,
                Name: filteredImage.Name,
                URL: filteredImage.ServerRelativeUrl
            }));
            this.setState({
                selImageFolder: selFolderName,
                filteredImages: _filteredImages
            });
        }).catch((error) => {
            console.log(error)
        })
        console.log(filteredImages)
        // let _filteredImages = filteredImages?.map((filteredImage: any) => ({
        //     Id: filteredImage.Id,
        //     Name: filteredImage.FileLeafRef,
        //     URL: filteredImage.EncodedAbsUrl
        // }));
        // this.setState({
        //     selImageFolder: selFolderName,
        //     filteredImages: _filteredImages
        // });
    }

    private onImageSelected(ev: any, imgInfo: any) {
        let selImageURL: string = imgInfo.URL;
        let selImageId: number = parseInt(imgInfo.Id);
        let taskItem = { ...this.state.taskItem };
        taskItem.itemCover = selImageURL;
        this.setState({
            taskItem: taskItem,
            selImageId: selImageId
        });
    }

    private onImageCleared() {
        let selImageURL: string = "";
        let taskItem = { ...this.state.taskItem };
        taskItem.itemCover = selImageURL;
        this.setState({
            taskItem: taskItem
        });
    }
    private openOOTBFormInNewTab = () => {
        const url = `${this.props.context.pageContext.web.absoluteUrl}/Lists/Task%20Users/DispForm.aspx?ID=${this.state.selTaskId}`;
        window.open(url, '_blank');
    };
    private onImageAdded(ev: React.ChangeEvent<HTMLInputElement>) {

        if (!ev.target.files || ev.target.files.length < 1) {
            return;
        }

        let files = ev.target.files;

        const file = files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            let uploadedImage = {
                fileURL: reader.result as string,
                fileName: file.name
            }
            this.setState({
                uploadedImage: uploadedImage
            })
        }

    }

    private menuProps(): IContextualMenuProps {
        return ({
            shouldFocusOnMount: true,
            items: this.state.smartMetadataItems,
            onMenuOpened: () => this.onOpenSmartMetadataMenu(),
            target: null
        });
    }
    private onRenderCustomHeaderCreateNewUser = () => {
        return (
            <>

                <div className='siteColor subheading'>
                    Create New User
                </div>
                <Tooltip ComponentId='1757' />
            </>
        );
    };
    private onRenderCustomHeaderTaskUserManagement = () => {
        return (
            <>

                <div className='siteColor subheading'>
                    {`Task-User Management - ${this.state.taskItem.userTitle}`}
                </div>
                <Tooltip ComponentId='1767' />
            </>
        );
    };


    render() {

        const elemCommandBar = (false && <CommandBar
            items={this.commandBarItems}
            styles={controlStyles}
        />);

        let elemMemberTaskList = (<div className="ms-Grid-row">
            <DetailsList
                items={this.state.sortedItems}
                columns={this.state.columns}
                selection={this._selection}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
                constrainMode={ConstrainMode.unconstrained}
                isHeaderVisible={true}
            />
        </div>);

        elemMemberTaskList = <TaskUsersTable TaskUsers={this.state.sortedItems} GetUser={(userName, taskId) => this.GetTaskUser(userName, taskId)} AddTask={this.onAddTeamMemberClick} EditTask={this.onEditIconClick} DeleteTask={this.onDeleteIconClick} />

        const elemTaskMetadata = (this.state.showEditPanel ? <div>
            <p className="mb-0">Created {this.state.taskItem.createdOn} by {this.state.taskItem.createdBy}</p>
            <p className="mb-0">Last modified {this.state.taskItem.modifiedOn} by {this.state.taskItem.modifiedBy}</p>
            <Link style={{marginLeft:"-5px"}} href="#" onClick={this.onDeleteTask}><span title="Delete" className="alignIcon  svg__icon--trash hreflink  svg__iconbox"></span><Text>Delete this user</Text></Link>


        </div> : <div></div>);

        const elemSaveButton = (<button className="btn btn-primary me-2 btnCol"  onClick={this.onSaveTask} disabled={!this.state.enableSave}>Save</button>);
        const elemCancelButton = (<button className="btn btn-default me-3"   onClick={this.onCancelTask}>Cancel</button>);
        const elemOOTBFormLink = (
            <a
                className="pe-2"
                onClick={this.openOOTBFormInNewTab}
                style={{ cursor: 'pointer' }}
            >
                Open out-of-the-box form
            </a>
        );
        //const elemOOTBFormLink = (<Link href={`${this.props.context.pageContext.web.absoluteUrl}/Lists/Task%20Users/DispForm.aspx?ID=${this.state.selTaskId}`} target="_blank" className="openlink">Open out-of-the-box form</Link>);
        const elemActionButons = (<div>
            <div className="text-end footer-right">
                {this.state.selTaskId && elemOOTBFormLink}
                {elemSaveButton}
                {elemCancelButton}
            </div>
        </div>);

        const elemDeleteDialog = (<Dialog
            hidden={this.state.hideDeleteDialog}
            onDismiss={this.onCancelDeleteDialog}
            dialogContentProps={deleteDialogContentProps}
        >
            <DialogFooter>
                <PrimaryButton text="OK" onClick={this.onConfirmDeleteDialog} />
                <DefaultButton text="Cancel" onClick={this.onCancelDeleteDialog} />
            </DialogFooter>
        </Dialog>);

        const elemTaskMemberFooter = () => (<div className="align-items-center d-flex justify-content-between ">
            {elemTaskMetadata}
            {elemActionButons}
        </div>);

        const elemUser = (<PeoplePicker
            context={this.props.context as any}
            principalTypes={[PrincipalType.User]}
            required={true}
            personSelectionLimit={1}
            titleText="User Name"
            resolveDelay={1000}
            onChange={this.getUserDetails}
            defaultSelectedUsers={this.state.taskItem.userMail}
            disabled={!this.state.enableUser}
        ></PeoplePicker>);

        const elemApprover = (<PeoplePicker
            context={this.props.context as any}
            principalTypes={[PrincipalType.User]}
            personSelectionLimit={1}
            titleText="Approver"
            resolveDelay={1000}
            onChange={this.getApproverDetails}
            defaultSelectedUsers={this.state.taskItem.approverMail}
        ></PeoplePicker>);

        const elemNewTaskMember = (<Panel
            onRenderHeader={this.onRenderCustomHeaderCreateNewUser}
            isOpen={this.state.showCreatePanel}
            onDismiss={this.onCancelTask}
            isFooterAtBottom={false}
            onRenderFooterContent={elemTaskMemberFooter}
        >
            <div className="ms-SPLegacyFabricBlock">
                <div className="ms-Grid">
                    <div className="ms-Grid-row">{elemUser}</div>
                </div>
            </div>

        </Panel>);

        const elemApproveSelectedMenu = (<PrimaryButton menuProps={this.menuProps()}>Select Items</PrimaryButton>);
        const elemSelSmartMetadataItems = this.state.taskItem.selSmartMetadataItems?.map((selSmartMetadataItem: { Title: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; Id: any; }) => (
            <div className="block mx-1 py-2 my-1 justify-content-between">
                {selSmartMetadataItem.Title}
                <span className="bg-light svg__icon--cross svg__iconbox" onClick={() => this.onRemoveSmartMetadataItem(selSmartMetadataItem.Id)}></span>
            </div>
        ));

        const elemEditTaskBasicInfo: JSX.Element = (<div className="ms-SPLegacyFabricBlock">
            <div className="ms-Grid p-0">
                <div className="ms-Grid-row Task-User-Management mb-2">
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                        <TextField
                            label="Title"
                            value={this.state.taskItem.userTitle}
                            defaultValue={this.state.taskItem.userTitle}
                            onChange={this.onUserTitleChange}
                       
                        />
                    </div>
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                        <TextField
                            label="Suffix"
                            value={this.state.taskItem.userSuffix}
                            defaultValue={this.state.taskItem.userSuffix}
                            onChange={this.onUserSuffixChange}
                        />
                    </div>
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                        <label className="ms-Label root-321 pb-2 pt-1 text-dark">Group</label>
                        <select onChange={(event) => this.onGroupChange(event)} value={this.state.taskItem.groupId} className="fieldGroup-311 ms-sm12 ms-md12 ms-lg12">
                            {this.state.teamGroups.map((item: any) => (
                                <option key={item.key} value={item.key}>
                                    {item.text}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                        <TextField
                            label="Sort Order"
                            value={this.state.taskItem.sortOrder}
                            defaultValue={this.state.taskItem.sortOrder}
                            onChange={this.onSortOrderChange}
                        />
                    </div>
                </div>
                <div className="ms-Grid-row Task-User-Management mb-2">
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">{elemUser}</div>
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
                        <label className="ms-Label root-321 pb-2 pt-1 text-dark">Manage Categories</label>
                        <select onChange={(event) => this.onManageTimeCategory(event)} value={this.state.taskItem.timeCategory} className="fieldGroup-311 ms-sm12 ms-md12 ms-lg12">
                            {this.state.timesheetCategories.map((item: any) => (
                                <option key={item.key} value={item.key}>
                                    {item.text}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">{elemApprover}</div>
                </div>
               
                <div className="ms-Grid-row Task-User-Management SpfxCheckRadio mb-2">
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg3">
                        <ChoiceGroup  className="SpfxCheckRadio"
                            label="Approval Type"
                            options={appTypeOptions}
                            value={this.state.taskItem.approvalType}
                            defaultSelectedKey={this.state.taskItem.approvalType}
                            onChange={this.onApprovalTypeChange}
                            
                        />
                    </div>
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg3">
                        <ChoiceGroup className="SpfxCheckRadio"
                            label="Company"
                            options={compOptions}
                            value={this.state.taskItem.company}
                            defaultSelectedKey={this.state.taskItem.company}
                            onChange={this.onCompanyChange}
                           
                        />
                    </div>
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg3">
                        <Label>Roles</Label>
                        <Checkbox  className="SpfxCheckRadio"
                            label="Component Teams"
                            checked={this.state.taskItem.roles.indexOf("Component Teams") > -1}
                            defaultChecked={this.state.taskItem.roles.indexOf("Component Teams") > -1}
                            onChange={this.onComponentTeamsChecked}
                          
                        />
              
                        <Checkbox className="SpfxCheckRadio"
                            label="Service Teams"
                            checked={this.state.taskItem.roles.indexOf("Service Teams") > -1}
                            defaultChecked={this.state.taskItem.roles.indexOf("Service Teams") > -1}
                            onChange={this.onServiceTeamsChecked}
                           
                        />
                    </div>
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg3 mt-4">
              
                        <Checkbox   className="SpfxCheckRadio"
                            label="Active User"
                            checked={this.state.taskItem.isActive}
                            defaultChecked={this.state.taskItem.isActive}
                            onChange={this.onActiveUserChecked}
                         
                        />
                  
                        <Checkbox   className="SpfxCheckRadio"
                            label="Task Notifications"
                            checked={this.state.taskItem.isTaskNotifications}
                            defaultChecked={this.state.taskItem.isTaskNotifications}
                            onChange={this.onTaskNotificationsChecked}
                         
                        />
                    </div>
                </div>
                {this.state.taskItem.approvalType == "Approve Selected" && (<div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                        {elemApproveSelectedMenu}
                        <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9 p-0">
                            {elemSelSmartMetadataItems}
                        </div>
                    </div>

                </div>)}
                <br />
            </div>
        </div>);
        const elemSelImage = (this.state.taskItem.itemCover && <div>
            <Image src={this.state.taskItem.itemCover} imageFit={ImageFit.centerContain} height={120} width={160} />
            <Link target="_blank" href={`${this.props.context.pageContext.web.absoluteUrl}/PublishingImages/${this.state.selImageFolder}`}>Image Folder</Link>
            <Label onClick={this.onImageCleared}>
                <Icon iconName="Delete" />
                <Text>Clear Image</Text>
            </Label>
        </div>);

        const elemImageGallery = (<div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            {
                this.state.filteredImages?.map((imgInfo: { Id: any; URL: string; Name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => (<div style={{ width: '205px', display: 'inline-block', verticalAlign: 'top', margin: '2px' }}>
                    <DocumentCard style={{ border: (imgInfo.Id == this.state.selImageId) ? "1px solid red" : "" }}>
                        <div
                            //onMouseOver={(ev)=>{ev.preventDefault();this.setState({onImageHover:!this.state.onImageHover})}}
                            //onMouseOut={(ev)=>{ev.preventDefault();this.setState({onImageHover:!this.state.onImageHover})}}
                            onClick={(ev) => this.onImageSelected(ev, imgInfo)}
                        >
                            <Image src={imgInfo.URL} imageFit={ImageFit.centerContain} height={160} width={205} />
                        </div>
                        {
                            this.state.onImageHover &&
                            <div>
                                <Label
                                    style={{ pointerEvents: "none", display: 'block', zIndex: 1000, fontSize: FontSizes.size18, bottom: 0, textAlign: 'center', width: '100%', position: 'absolute', background: 'rgba(0, 0, 0, 0.5)', color: '#f1f1f1', padding: '10px' }}
                                >
                                    {imgInfo.Name}
                                </Label>
                            </div>
                        }
                    </DocumentCard>
                </div>))
            }

        </div>);

        const elemImagePivotSection = (<Pivot linkFormat={PivotLinkFormat.tabs} linkSize={PivotLinkSize.normal}>
            <PivotItem headerText="CHOOSE FROM EXISTING">
                <br />

                {elemImageGallery}
            </PivotItem>
            <PivotItem headerText="UPLOAD">
                <Label>Upload from Computer:</Label>
                <br />
                <div>
                    <input type="file" name="coverIamge" id="coverImage" accept="image/*" onChange={this.onImageAdded} />
                </div>
                <br />
                <PrimaryButton text="Upload" onClick={this.uploadImage} disabled={this.state.uploadedImage.fileName == ""} />
            </PivotItem>
        </Pivot>);

        {
            false && <FilePicker
                buttonLabel="Choose File"
                onSave={function (filePickerResult: IFilePickerResult[]): void {
                    throw new Error("Function not implemented.");
                }}
                context={this.props.context as any}
            />
        }

        const elemEditTaskImageInfo: JSX.Element = (<div className="ms-SPLegacyFabricBlock"><div className="ms-Grid">
            <div className="ms-Grid-row">
                <TextField
                    label="Image URL"
                    value={this.state.taskItem.itemCover}
                    defaultValue={this.state.taskItem.itemCover}
                    onChange={this.onItemCoverChange}
                />
            </div>

            <br />

            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                    <ChoiceGroup
                        label="Choose Image Folder"
                        options={selExistingImageOptions}
                        defaultSelectedKey={this.state.selImageFolder}
                        selectedKey={this.state.selImageFolder}
                        onChange={this.onImageFolderChanged}
                    />
                    <br />
                    {elemSelImage}
                </div>
                <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9">
                    {elemImagePivotSection}
                </div>
            </div>

        </div></div>);

        const elemEditTaskMember = (<Panel
            onRenderHeader={this.onRenderCustomHeaderTaskUserManagement}
            type={PanelType.large}
            isOpen={this.state.showEditPanel}
            onDismiss={this.onCancelTask}
            onRenderFooterContent={elemTaskMemberFooter}
        >
            <div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button onClick={() => this.handleTabClick('basic')} className={`nav-link ${this.state.activeTab === 'basic' ? 'active' : ''}`} id="home-tab" type="button" role="tab" aria-controls="home" aria-selected="true">BASIC INFORMATION</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button onClick={() => this.handleTabClick('image')} className={`nav-link ${this.state.activeTab === 'image' ? 'active' : ''}`} id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">IMAGE INFORMATION</button>
                    </li>
                </ul>
                <div className="tab-content border border-top-0 clearfix p-2" id="nav-tabContent">
                    <div className={`tab-pane fade px-1 ${this.state.activeTab === 'basic' ? 'show active' : ''}`} id="basic" role="tabpanel" aria-labelledby="home-tab">
                        {elemEditTaskBasicInfo}
                    </div>
                    <div className={`tab-pane fade px-1 ${this.state.activeTab === 'image' ? 'show active' : ''}`} id="image" role="tabpanel" aria-labelledby="profile-tab">
                        {elemEditTaskImageInfo}
                    </div>
                </div>
                {/* <div className="tab-content">
                    {this.state.activeTab === "basic" ? elemEditTaskBasicInfo : elemEditTaskImageInfo}
                </div> */}
            </div>
        </Panel>);

        const elemControls = (<>
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-md8 ms-sm12">
                    <SearchBox placeholder="Filter by Name:" styles={controlStyles} onChange={this.onSearchTextChange} value={this.state.searchText} />
                </div>
                <div className="ms-Grid-col ms-md4 ms-sm12">
                    <PrimaryButton text="Add Team Member" styles={controlStyles} onClick={this.onAddTeamMemberClick} />
                </div>
            </div>
            <div className="ms-Grid-row">{elemCommandBar}</div>
        </>
        );

        return (<div data-is-scollable={true} className="ms-Grid  p-0">
            {false && elemControls}
            {elemMemberTaskList}
            {elemNewTaskMember}
            {elemEditTaskMember}
            {elemDeleteDialog}
        </div>);
    }

    private GetTaskUser(userName: string, taskId: number) {
        return (
            <Stack horizontal tokens={stackTokens}>
                <Stack.Item>
                    {this.getUserPersona({ UserName: userName, ImageUrl: this.getImageUrl(taskId) })}
                </Stack.Item>
                <Stack.Item>
                    <div>{userName}</div>
                </Stack.Item>
            </Stack>
        );
    }

    private _buildColumns(items: any[]): IColumn[] {

        const columns = buildColumns(items, false, this._onColumnClick);

        columns.forEach((column: IColumn) => {

            if (column.name) {
                //column.showSortIconWhenUnsorted = true;
                if (column.name == "Title") {
                    column.isSorted = true;
                    column.isSortedDescending = false;
                    column.onRender = (item) => this.GetTaskUser(item.Title, item.TaskId)
                }
                else if (column.name == "TaskId") {
                    column.name = "";
                    column.onRender = (item) => (<div>
                        <FontIcon iconName="Edit" className={iconClass} onClick={() => this.onEditIconClick(item.TaskId)} />
                        <FontIcon iconName="Delete" className={iconClass} onClick={() => this.onDeleteIconClick(item.TaskId)} />
                    </div>);
                }
            }
        });

        return columns;
    };

    private _onColumnClick = (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns } = this.state;
        let { sortedItems } = this.state;
        let isSortedDescending = column.isSortedDescending;

        // If we've sorted this column, flip it.
        if (column.isSorted) {
            isSortedDescending = !isSortedDescending;
        }

        // Sort the items.
        sortedItems = _copyAndSort(sortedItems, column.fieldName!, isSortedDescending);

        // Reset the items and columns to match the state.
        this.setState({
            sortedItems: sortedItems,
            columns: columns.map((col: { isSorted: boolean; key: string; isSortedDescending: boolean; }) => {
                col.isSorted = col.key === column.key;

                if (col.isSorted) {
                    col.isSortedDescending = isSortedDescending;
                }

                return col;
            }),
        });
    };

    private getUserPersona(userInfo: any) {
        const personaProps: IPersonaProps = {
            size: PersonaSize.size24,
        }
        const userImage = userInfo.ImageUrl;
        const userName = userInfo.UserName;
        if (userImage) {
            personaProps.imageUrl = userImage;
        }
        else {
            personaProps.imageInitials = userName.split(" ").map((i: string) => i.indexOf("+") > -1 ? i : i.charAt(0)).join("");
        }
        const elemPersona = <Persona {...personaProps} styles={{ details: { padding: "0px" } }} />
        return (
            <TooltipHost content={userName}>
                <Link href="#" target="_blank">
                    {elemPersona}
                </Link>
            </TooltipHost>
        );
    }

    private getImageUrl(userId: number) {
        const allTasks = [...this.state.tasks];
        const userTaskItem = allTasks.filter(taskItem => taskItem.TaskId == userId)[0];
        return (userTaskItem && userTaskItem.ItemCover) ? userTaskItem.ItemCover.Url : "";
    }

    private async getUserInfo(userMail: string) {

        const userEndPoint: string = `${this.props.context.pageContext.web.absoluteUrl}/_api/Web/EnsureUser`;

        const userData: string = JSON.stringify({
            "logonName": userMail
        });

        const userReqData = {
            body: userData
        };

        const resUserInfo = await this.props.context.spHttpClient.post(userEndPoint, SPHttpClient.configurations.v1, userReqData);
        const userInfo = await resUserInfo.json()

        return userInfo;
    }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}