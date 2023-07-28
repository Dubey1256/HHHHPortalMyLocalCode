import "@pnp/sp/sputilities";
export declare const pageContext: () => Promise<import("sp-pnp-js").ContextInfo>;
export declare const docxUint8Array: () => Promise<any>;
export declare const PopHoverBasedOnTaskId: (item: any) => any[];
export declare const hierarchyData: (items: any, MyAllData: any) => any;
export declare const getData: (url: any, listId: any, query: any) => Promise<any[]>;
export declare const addData: (url: any, listId: any, item: any) => Promise<import("sp-pnp-js").ItemAddResult>;
export declare const updateItemById: (url: any, listId: any, item: any, itemId: any) => Promise<import("sp-pnp-js").ItemUpdateResult>;
export declare const deleteItemById: (url: any, listId: any, item: any, itemId: any) => Promise<void>;
export declare const getTaskId: (item: any) => string | Promise<never>;
export declare const loadTaskUsers: () => Promise<any>;
export declare const parseJSON: (jsonItem: any) => any;
export declare const GetIconImageUrl: (listName: any, listUrl: any, Item: any) => string;
export declare const makePostDataForApprovalProcess: (postData: any) => Promise<PromiseConstructor>;
export declare const GetImmediateTaskNotificationEmails: (item: any, isLoadNotification: any, rootsite: any) => Promise<PromiseConstructor>;
export declare const getMultiUserValues: (item: any) => string;
export declare const getListNameFromItemProperties: (item: any) => any;
export declare const ConvertLocalTOServerDate: (LocalDateTime: any, dtformat: any) => Promise<string>;
export declare const sendImmediateEmailNotifications: (itemId: any, siteUrl: any, listId: any, item: any, RecipientMail: any, isLoadNotification: any, rootSite: any) => Promise<void>;
export declare const sendEmail: (from: any, to: any, body: any, subject: any, ReplyTo: any, cc: any) => Promise<void>;
export declare const getPortfolio: (type: any) => Promise<any>;
export declare const GetServiceAndComponentAllData: (Props: any) => Promise<{
    GroupByData: any;
    AllData: any;
}>;
export declare const ArrayCopy: (array: any) => Promise<any>;
export declare const getParameterByName: (name: any) => Promise<string>;
//# sourceMappingURL=globalCommon.d.ts.map