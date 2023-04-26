import { SPFI } from "@pnp/sp";
import { ICamlQuery } from "@pnp/sp/lists";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { getSP } from "./pnpjsConfig"

export default class spservices {
    
    private _sp: SPFI = null;
    private _webSerRelURL: string;
    constructor() {
       this._sp = getSP();
       this.getWebInformation();        
    }

    private async getWebInformation() {
        const webInfo = await this._sp.web();
        this._webSerRelURL = webInfo.ServerRelativeUrl;
    }

    public async getTasks(taskUsersListId: string) {
        let resGetTask;

        const querySelect: string = "Id,Title,TimeCategory,CategoriesItemsJson,Suffix,SortOrder,IsApprovalMail,Item_x0020_Cover,ItemType,Created,Company,Role,Modified,IsActive,IsTaskNotifications,DraftCategory,UserGroup/Title,UserGroup/Id,AssingedToUser/Title,AssingedToUser/Name,AssingedToUser/Id,Author/Name,Author/Title,Editor/Name,Approver/Id,Approver/Title,Approver/Name,Editor/Title,Email";
        const queryExpand: string = "Author,Editor,AssingedToUser,UserGroup,Approver";
        const queryOrderBy: string = "Title";
        
        try {
            resGetTask = (this._sp.web.lists.getById(taskUsersListId).items.select(querySelect).expand(queryExpand)).orderBy(queryOrderBy)();
        }
        catch (error) {
            return Promise.reject(error);
        }

        return resGetTask;
    }

    public async createTask(taskUsersListId: string, taskItem: Record<string, any>) {
        let resCreateTask;
        try {
            resCreateTask = (await this._sp.web.lists.getById(taskUsersListId).items.add(taskItem)).data;
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resCreateTask;
    }

    public async editTask(taskUsersListId: string, taskId: number, taskItem: Record<string, any>) {
        let resEditTask;
        try {
            resEditTask = await this._sp.web.lists.getById(taskUsersListId).items.getById(taskId).update(taskItem);
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resEditTask;
    }

    public async deleteTask(taskUsersListId: string, taskId: number) {
        let resDeleteTask;
        try {
            resDeleteTask = await this._sp.web.lists.getById(taskUsersListId).items.getById(taskId).delete();
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resDeleteTask;
    }

    public async getUserInfo(userEMail: string) {
        let resUserInfo;
        try {
            resUserInfo = (await this._sp.web.ensureUser(userEMail)).data;
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resUserInfo;
    }

    public async getUserMail(userId: number) {
        let userEMail: any = "";
        try {
            userEMail = await this._sp.web.siteUsers.getById(userId).select("UserPrincipalName")();
        }
        catch(error) {
            return Promise.reject(error);
        }
        return userEMail
    }

    public async getSmartMetadata(smartMetadataListId: string, taxTypes: string[]) {
        let resSmartMetadata;
        const querySelect = "Id,ParentID,TaxType,Title,listId,siteUrl,SortOrder";
        const queryFilter = taxTypes.map(t=>`(TaxType eq '${t}')`).join(" or ");
        try {
            resSmartMetadata = (this._sp.web.lists.getById(smartMetadataListId).items.select(querySelect).filter(queryFilter))();
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resSmartMetadata;
    }

    public async getImages(imagesLibraryId: string, folderName: string) {
        let resImages;
        //const querySelect = "Id,Title,Created,FileLeafRef,EncodedAbsUrl,FileDirRef,Modified,Author/Title,Editor/Title";
        //const queryExpand = "Author,Editor";
        //const queryFilter = "FSObjType eq 0";
        //const queryOrderBy = "Created DESC";
        const folderServerRelativeUrl: string = `${this._webSerRelURL}/PublishingImages/${folderName}`;
       
        const queryCAML: ICamlQuery = {ViewXml: `<View Scope='RecursiveAll'><Query><Where><And><Eq><FieldRef Name='FileDirRef' /><Value Type='Lookup'>${folderServerRelativeUrl}</Value></Eq><Eq><FieldRef Name='FSObjType' /><Value Type='Integer'>0</Value></Eq></And></Where></Query><OrderBy><FieldRef Name='Created' Ascending='False' /></OrderBy><RowLimit>20</RowLimit></View>`};
        
        try {
            resImages = await this._sp.web.lists.getById(imagesLibraryId).getItemsByCAMLQuery(queryCAML,"File","FileLeafRef","FileDirRef","EncodedAbsUrl")
        }
        catch(error) {
            return Promise.reject(error);
        }
        
        return resImages;
    }

    public async addImage(folderName: string, imageContent: any) {
        let resImageAdd;
        let serverRelURL: string = `${this._webSerRelURL}/PublishingImages/${folderName}`;
        try {
            resImageAdd = await this._sp.web.getFolderByServerRelativePath(serverRelURL).files.addUsingPath(imageContent.fileName, imageContent, {Overwrite: true});
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resImageAdd;
    }

    public async getLastModifiedItemsConfiguration(listConfigListId: string) {
        let resLMIConfig: any[];
        const qFilterLMIConfig: string = "Key eq 'LastModifiedItems'";
        const qSelectLMIConfig: string = "Id,Key,Configuration,Value";
        try {
            resLMIConfig = await this._sp.web.lists.getById(listConfigListId).items.select(qSelectLMIConfig).filter(qFilterLMIConfig)();
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resLMIConfig;
    }

    public async getListItems(listId: string, qSelect?: string, qExpand?: string, qFilter?: string, qOrderBy?: any, topCount?: number) {
        let resListItems;

        if(!qOrderBy) qOrderBy = "Modified DESC";
        qOrderBy = qOrderBy.split(" ");
        let orderByColumnName = qOrderBy[0];
        let isAscending = true;

        if(!topCount) topCount = 4999;

        if(qOrderBy.length>1) {
            isAscending = qOrderBy[1].toUpperCase()=="ASC";
        }
        try {
            resListItems = await this._sp.web.lists.getById(listId).items.select(qSelect).expand(qExpand).filter(qFilter).orderBy(orderByColumnName, isAscending).top(topCount)();
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resListItems;
    }

    public async getListItemsInBatch(batchReqItems: any[]) {
        const [batchedSP, execute] = this._sp.batched();
        const resItems: any[][] = [];
        let qSelect: string, qExpand: string, qFilter: string, qTop: number;
        batchReqItems.forEach(batchReqItem => {
            qSelect = batchReqItem.QueryStrings.Select;
            qExpand = batchReqItem.QueryStrings.Expand;
            qFilter = batchReqItem.QueryStrings.Filter;
            qTop = batchReqItem.QueryStrings.Top;
            batchedSP.web.lists.getById(batchReqItem.ListId).items.select(qSelect).expand(qExpand).filter(qFilter).orderBy("Modified", false).top(qTop)().then(value=>resItems.push(...value));
        });
        await execute();
        return resItems;
    }

    public async createListItem(listId: string, item: any) {
        let resCreateItem;
        try {
            resCreateItem = (await this._sp.web.lists.getById(listId).items.add(item)).data;
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resCreateItem;
    }

    public async deleteListItem(listId: string, itemId: number) {
        let resDelListItem;
        try {
            resDelListItem = await this._sp.web.lists.getById(listId).items.getById(itemId).delete();
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resDelListItem;
    }

    public async updateListItem(listId: string, itemId: number, item: any) {
        let resUpdateListItem;
        try {
            resUpdateListItem = await this._sp.web.lists.getById(listId).items.getById(itemId).update(item);
        }
        catch(error) {
            return Promise.reject(error);
        }
        return resUpdateListItem;
    }

    public async sendEMail(To: string[], CC: string[], Subject: string, Body: string) {
        const emailProps: IEmailProperties = {
            To: To,
            CC: CC,
            Subject: Subject,
            Body: Body,
            AdditionalHeaders: {
                "content-type": "text/html"
            },            
        };
        await this._sp.utility.sendEmail(emailProps);
    }
}