import * as React from 'react';
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { ICamlQuery } from "@pnp/sp/lists";
import * as Moment from 'moment';
import {
    ColumnDef,
} from "@tanstack/react-table";
import HighlightableCell from '../../componentPortfolio/components/highlight';
import { FaChevronDown, FaChevronRight, FaCompressArrowsAlt } from 'react-icons/fa';
import GlobalCommanTable, { IndeterminateCheckbox } from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import PortfolioTable from './PortfolioTable';
const SitesConfig: any = [];
const allitems: any = [];
const SelectedProp: any = '';
var MainSite: any = '';
var Mainportfolio: any = '';
var ListNameQuery: any = ''
var Mainsiteitem: any = ';'
const TaxonomyItems: any = [];
var AllComponetsData: any = [];
var AllComponetsDataNew: any = [];
var taskUsers: any = [];
var copyAllitemsdata: any = [];
var AllTimeSpentDetails: any = [];
var SharewebTitle: any = '';
var componentTitle: any = "";
var Finalcomponent: any = "";
let Pageurls: any = "";
let CompnentId: any = "";
var AllDataOfTask: any = undefined;
let params:any='';
function SmartConnectTable(SelectedProp: any) {
    const [allitemsData, setAllitemsData] = React.useState([])
    const [AllMetadata, setMetadata] = React.useState([])
    const [AllUsers, setTaskUser] = React.useState([]);
    //const [Pageurlshareweb, setPageurlshareweb] = React.useState('');
    // const [CompnentId, setCompnentId] = React.useState('');

    const [AllTimeSheetData, setAllTimeSheetData] = React.useState([]);
    //  const params = new URLSearchParams(window.location.search);
    (async () => {
        ListNameQuery = await Promise.all([globalCommon.getParameterByName('Site')]);
        if (ListNameQuery[0] != "" && ListNameQuery.length > 0)
            MainSite = Mainsiteitem = ListNameQuery = ListNameQuery[0]
    })();
    (async () => {
        Mainportfolio = await Promise.all([globalCommon.getParameterByName('PortfolioType')]);
        if (Mainportfolio[0] != "" && Mainportfolio.length > 0)
            Mainportfolio = Mainportfolio[0]
    })();
    (async () => {
        SharewebTitle = await Promise.all([globalCommon.getParameterByName('Title')]);
        if (SharewebTitle[0] != "" && SharewebTitle.length > 0)
            SharewebTitle = SharewebTitle[0]
    })();


    const LoadComponentsone = async () => {
        var query = "";
        let web = new Web(SelectedProp.siteUrl);
        query = "Id,Title";

        let result: any = [];
        result = await web.lists
            .getById(SelectedProp.SmartMetadataListID)
            .items
            .select(query)
            .filter("Id eq '" + CompnentId + "'")
        componentTitle = result[0].Title;
    }


    const generateALLReportsItems = async (AllTaskData: any) => {
        AllTaskData.forEach((taskItem: any) => {
            taskItem.selectedSiteType = taskItem.siteTypeLocal;
            taskItem.MileageJson = 0;
            var totletimeparent = 0;
            taskItem.AllSmartTime = 0;
            var UserArray: any = [];
            AllTimeSpentDetails.forEach((detail: any) => {
                if (detail['Task' + taskItem.selectedSiteType] != undefined && detail['Task' + taskItem.selectedSiteType].Id != undefined && taskItem.Id != undefined && detail['Task' + taskItem.selectedSiteType].Id == taskItem.Id) {
                    if (detail.AdditionalTimeEntry != undefined && detail.AdditionalTimeEntry != '[]') {
                        var Additionaltimeentry = globalCommon.parseJSON(detail.AdditionalTimeEntry);

                        Additionaltimeentry.forEach((addtime: any) => {
                            var UserObj: any = {};
                            var hours = addtime.TaskTime;
                            var minutes = hours * 60;
                            UserObj.taskTime = minutes;
                            totletimeparent += minutes;
                            taskUsers.forEach((user: any) => {
                                if (user.Title == addtime.AuthorName) {
                                    if (user.SmartTime != undefined && user.SmartTime != 0) {
                                        UserObj.SmartTime = user.SmartTime;
                                        UserObj.UserName = user.Title;
                                    }
                                    else {
                                        UserObj.SmartTime = 100;
                                        UserObj.UserName = user.Title;
                                    }
                                    UserArray.push(UserObj);
                                }
                            })
                        })
                    }
                }
            })

            if (UserArray.length > 0) {
                taskItem.AllSmartTime = generateALLSmartTime(UserArray);
                //console.log(UserArray);
            }

        })


    }
    var IsExistsUserByTitle = function (temArray: any, value: any) {
        var isExists = false;
        temArray.forEach((item: any) => {
            if ((item.Title != undefined && value.Title != undefined) && (item.Title == value.Title)) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }

    var generateALLSmartTime = function (UserArray: any) {
        var copyUserArray = UserArray;
        var getAllUsers: any = [];
        taskUsers.forEach((siteuser: any) => {
            copyUserArray.forEach((user: any) => {
                if (siteuser.Title == user.UserName) {
                    var obj: any = {};
                    obj = siteuser;
                    obj[user.UserName + 'Time'] = 0;
                    obj[user.UserName + 'SmartTime'] = 0;
                    if (!IsExistsUserByTitle(getAllUsers, obj))
                        getAllUsers.push(obj);
                }
            })
        })
        copyUserArray.forEach((user: any) => {
            getAllUsers.forEach((name: any) => {
                if (user.UserName == name.Title) {
                    name[name.Title + 'Time'] += user.taskTime;
                    name[name.Title + 'SmartTime'] = user.SmartTime;
                }
            })
        })
        var AllSmartTime = 0;
        getAllUsers.forEach((name: any) => {
            if (name[name.Title + 'Time'] != 0) {
                name[name.Title + 'Time'] = name[name.Title + 'Time'] / 60;
                name[name.Title + 'Time'] = (name[name.Title + 'Time'] * name[name.Title + 'SmartTime'] / 100);
                name[name.Title + 'Time'] = parseFloat(name[name.Title + 'Time']);
                AllSmartTime += name[name.Title + 'Time'];
            }
        });
        return AllSmartTime;
    }
    var stringToArray1 = function (input: any) {
        if (input) {
            return input.split('>');
        } else {
            return [];
        }
    };
    var getRegexPattern = function (keywordArray: any) {
        var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
        return new RegExp(pattern, "gi");
    };
    const makeFullStructureOfPortfolioTaskDatabase = function (task: any, AllTaskItems: any) {
        var CompleteStructure = "";
        if ((task.TaskType != undefined && task.TaskType.Title == 'Activities') || (task.TaskType != undefined && task.TaskType.Title == 'Smart Case')) {
            CompleteStructure = task.Title;
        } else if (task.TaskType != undefined && task.TaskType.Title == 'Workstream') {
            var temp = $.grep(AllTaskItems, ((item: any) => { return item.Id == task.ParentTask.Id }))[0];
            if (temp != undefined)
                CompleteStructure = temp.Title + " >" + task.Title;
            else
                CompleteStructure = task.Title;
        } else if (task.TaskType != undefined && task.TaskType.Title == 'Task') {
            var temp = $.grep(AllTaskItems, ((item: any) => { return item.Id == task.ParentTask.Id }))[0];
            if (temp == undefined || temp == null)
                CompleteStructure = task.Title;
            else {
                if ((temp.TaskType != undefined && temp.TaskType.Title == 'Activities') || (temp.TaskType != undefined && temp.TaskType.Title == 'Smart Case')) {
                    CompleteStructure = temp.Title + " >" + task.Title;
                } else if (temp.TaskType != undefined && temp.TaskType.Title == 'Workstream') {
                    var temp1 = $.grep(AllTaskItems, ((item: any) => { return item.Id == temp.ParentTask.Id }))[0];
                    if (temp1 == undefined) {
                        CompleteStructure = temp.Title + " >" + task.Title;
                    } else {
                        CompleteStructure = temp1.Title + " >" + temp.Title + " >" + task.Title;
                    }
                } else if (temp.TaskType != undefined && temp.TaskType.Title == 'Task') {
                    CompleteStructure = task.ParentTask.Title;
                }
            }
        }
        var MainComponent: any = [];

        if (task.PortfolioItemsId != undefined) {
            MainComponent = globalCommon.ArrayCopy($.grep(AllComponetsData, function (type: any) { return type.Id == task.PortfolioItemsId }));
        }
        if (task.Item_x0020_Type != undefined && task.Item_x0020_Type == 'Component' || task.Item_x0020_Type == 'SubComponent' || task.Item_x0020_Type == 'Feature') {
            MainComponent = globalCommon.ArrayCopy($.grep(AllComponetsData, (type: any) => { return type.Id == task.Id }));
        }
        var OtherStructure = "";
        if (MainComponent.length > 0) {
            if (MainComponent[0].Item_x0020_Type == 'Component') {
                OtherStructure = MainComponent[0].Title;
            } else if (MainComponent[0].Item_x0020_Type == 'SubComponent') {
                var temp: any = $.grep(AllComponetsData, (item: any) => { return item.Id == MainComponent[0].Parent.Id })[0];
                if (temp != undefined)
                    OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                else
                    OtherStructure = MainComponent[0].Title;
            } else if (MainComponent[0].Item_x0020_Type == 'Feature') {
                var temp: any = $.grep(AllComponetsData, (item: any) => { return item.Id == MainComponent[0].Parent.Id })[0];
                if (temp == undefined || temp == null)
                    OtherStructure = MainComponent[0].Title;
                else {
                    if (temp.Item_x0020_Type != undefined && temp.Item_x0020_Type == 'Component') {
                        OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                    } else if (temp.Item_x0020_Type == 'SubComponent') {
                        var temp1: any = $.grep(AllComponetsData, (item: any) => { return item.Id == temp.Parent.Id })[0];
                        if (temp1 == undefined) {
                            OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                        } else {
                            OtherStructure = temp1.Title + " >" + temp.Title + " >" + MainComponent[0].Title;
                        }
                    } else if (temp.Item_x0020_Type == 'Task') {
                        OtherStructure = MainComponent[0].Parent.Title;
                    }
                }
            }
            if (CompleteStructure == '')
                CompleteStructure = OtherStructure
            else {
                var keywordList = [];
                keywordList = stringToArray1(OtherStructure);
                var pattern = getRegexPattern(keywordList);
                CompleteStructure = OtherStructure.replace(pattern, '<span className="highlightedComp">$2</span>') + ' >' + CompleteStructure;;
                // CompleteStructure = OtherStructure + ' >' + CompleteStructure;
            }
        }
        return CompleteStructure;
    }
    const findservie = async (value: any) => {
        if (value == 'servicetype') {
            var id = CompnentId;
            var metadatItem: any = []
            let web = new Web(SelectedProp.siteUrl);
            let results: any = [];
            results = await web.lists
                .getById(SelectedProp.MasterTaskListID)
                .items
                .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
                .top(4999)
                .filter("id eq " + id + "")
                .expand('Parent,ServicePortfolio')
                .get()
            console.log(results);
            var newComponent: any = results[0];
            // SharewebListService.getRequest(_spPageContextInfo.webAbsoluteUrl, "/getbyid('" + GlobalConstants.MASTER_TASKS_LISTID + "')/items?$select=Id,Site,Title,Portfolio_x0020_Type,ServicePortfolio/Id,ServicePortfolio/Title,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Events/Title,Events/ItemType&$expand=Parent,Component,Services,ServicePortfolio,Events&$filter=(Id eq '" + id + "')&$top=4999").then(function (success) {
            //     newComponent = success.d.results[0];
            if (newComponent != undefined && (newComponent.Parent.Id == 0 || newComponent.Parent.Id == undefined)) {
                Finalcomponent = newComponent;
                if (Finalcomponent != undefined && Finalcomponent.ServicePortfolio.Id != 0) {
                    var filters = "(Portfolio / Id eq '" + Finalcomponent.ServicePortfolio.Id + "')"
                    loadAlltask(Mainportfolio, filters);
                    var serviceportfolioid = Finalcomponent.ServicePortfolio.Id;
                }


                if (Finalcomponent != undefined && Finalcomponent.ServicePortfolio.Id == undefined && newComponent.Parent.Id == undefined) {
                    filters = "(Portfolio/Id gt 0)"
                    loadAlltask(Mainportfolio, filters);
                }

            }
            if (newComponent == undefined) {
                filters = "(Portfolio/Id gt 0)"
                loadAlltask(Mainportfolio, filters);
            }
            if (newComponent != undefined && newComponent.Parent.Id != undefined) {
                // SharewebListService.getRequest(_spPageContextInfo.webAbsoluteUrl, "/getbyid('" + GlobalConstants.MASTER_TASKS_LISTID + "')/items?$select=Id,Portfolio_x0020_Type,Item_x0020_Type,Site,Short_x0020_Description_x0020_On,Title,ServicePortfolio/Id,ServicePortfolio/Title,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Events/Title,Events/ItemType&$expand=Parent,Component,ServicePortfolio,Services,Events&$filter=(Id eq '" + newComponent.Parent.Id + "')&$top=4999").then(function (success) {
                let resultsnew: any = [];
                resultsnew = await web.lists
                    .getById(SelectedProp.MasterTaskListID)
                    .items
                    .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
                    .top(4999)
                    .filter("id eq " + newComponent.Parent.Id + "")
                    .expand('Parent,Services,ServicePortfolio')
                    .get()
                console.log(resultsnew);
                var newComponentsecond = resultsnew[0];
                if (newComponentsecond != undefined && (newComponentsecond.Parent.Id == undefined || newComponentsecond.Parent.Id == 0)) {
                    Finalcomponent = newComponentsecond;
                }
                if (Finalcomponent != undefined && Finalcomponent.ServicePortfolio.Id != undefined) {
                    filters = "(Portfolio / Id eq '" + Finalcomponent.ServicePortfolio.Id + "')"
                    loadAlltask(Mainportfolio, filters);
                    serviceportfolioid = Finalcomponent.ServicePortfolio.Id;
                }


                if (Finalcomponent != undefined && Finalcomponent.ServicePortfolio.Id == undefined && newComponentsecond.Parent.Id == undefined) {
                    filters = "(Portfolio/Id gt 0)"
                    loadAlltask(Mainportfolio, filters);
                }



                if (newComponentsecond != undefined && newComponentsecond.Parent.Id != undefined) {
                    //  SharewebListService.getRequest(_spPageContextInfo.webAbsoluteUrl, "/getbyid('" + GlobalConstants.MASTER_TASKS_LISTID + "')/items?$select=Id,Portfolio_x0020_Type,Item_x0020_Type,Site,Short_x0020_Description_x0020_On,Title,ServicePortfolio/Id,ServicePortfolio/Title,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Events/Title,Events/ItemType&$expand=Parent,Component,Services,ServicePortfolio,Events&$filter=(Id eq '" + newComponentsecond.Parent.Id + "')&$top=4999").then(function (success) {
                    let subChild: any = [];
                    subChild = await web.lists
                        .getById(SelectedProp.MasterTaskListID)
                        .items
                        .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
                        .top(4999)
                        .filter("id eq " + newComponentsecond.Parent.Id + "")
                        .expand('Parent,ServicePortfolio')
                        .get()
                    console.log(subChild);
                    var newComponentthrid = subChild[0];
                    if (newComponentthrid != undefined && newComponentthrid.Parent.Id == undefined) {
                        Finalcomponent = newComponentthrid;
                    }
                    if (Finalcomponent != undefined && Finalcomponent.ServicePortfolio.Id != undefined) {
                        filters = "(Portfolio / Id eq '" + Finalcomponent.ServicePortfolio.Id + "')"
                        loadAlltask(Mainportfolio, filters);
                        serviceportfolioid = Finalcomponent.ServicePortfolio.Id;
                    }


                    if (Finalcomponent != undefined && Finalcomponent.ServicePortfolio.Id == undefined && newComponentthrid.Parent.Id == undefined) {
                        filters = "(Portfolio/Id gt 0)"
                        loadAlltask(Mainportfolio, filters);
                    }
                }
            }

        }
    }
    const Getportfolioid = async (TaskId: any, SiteType: any, Newitemvalue: any) => {
        // let orderBy:any = 'ItemRank';
        // allitems= [];
        var newSite: any = SiteType;
        var Pageurl = TaskId;
        var columns = ['ID', 'Id', 'Title', 'DueDate', 'ClientActivity', 'ClientCategory', 'TaskID', 'PercentComplete', 'Author', 'Editor', 'Modified', 'Created', 'Portfolio/Title','Portfolio/Id', 'TaskType', 'ItemRank', 'ItemRank', 'ParentTask', 'TaskLevel', 'TaskLevel', 'ClientCategory', 'ServicePortfolio'];
        var orderBy = "ItemRank";
        var whereClause = "<View><Query><Where><And><Contains><FieldRef Name='ClientActivity'  /><Value Type='Note'>" + Pageurl + "</Value></Contains><Contains><FieldRef Name='ClientActivity'/><Value Type='Note'>" + newSite + "</Value></Contains></And></Where></Query></View>";
        var listItem = SitesConfig.filter((site: any) => site.Title.toLowerCase() === Mainsiteitem.toLowerCase()) //SharewebCommonFactoryService.getListIdByListName(MainSite, GlobalConstants.CURRENT_SITE_TYPE);

        const web = new Web(SelectedProp.siteUrl);
        let result: any = [];
        // try {
        result = await web.lists
            .getById(listItem[0].listId)
            .select('ID', 'Id', 'Title')
            .expand("Portfolio","ClientCategory")
            .getItemsByCAMLQuery({ ViewXml: whereClause })

        result.forEach((item: any) => {
            item.flag = true;
            item.listId = listItem[0].listId;
            item.siteName = newSite;
            // item.siteTypeLocal = MainSiteLocal;
            // item.siteTypeLocal = MainSiteLocal;
            item.SiteType = SiteType;
            item.Id = item.ID;
            if (item?.Portfolio?.Title != undefined) {
                let Item :any ={};
                item.Services =[];
               // item.ServicesId.forEach((Ids:any) =>{
                    let returnItem = AllComponetsData.filter((obj:any) =>obj.Id ===item?.Portfolio?.Id)
                    if(returnItem !=undefined && returnItem.length >0){
                        Item.Title = returnItem[0].Title;
                        Item.Id = returnItem[0].Id;
                        item.Services.push(Item)
                    }
               // })
            }
            if (item.ItemRank != undefined) {
                item.ItemRank = item.ItemRank;
            }
            if (item.TaskLevel != undefined) {
                item.TaskLevel = item.TaskLevel;
            }
            if (item.TaskLevel != undefined) {
                item.TaskLevel = item.TaskLevel;
            }
            if (item.TaskType != undefined) {
                var newtasktype = item.TaskType.split('#')[1];
                var newitem: any = {};
                if (newtasktype == 'Task') {
                    newitem.Id = 2;
                    newitem.Prefix = "T";
                    newitem.Title = "Task";
                }

                if (newtasktype == 'Activities') {
                    newitem.Id = 1;

                    newitem.Title = "Activities";
                }
                if (newtasktype == 'Workstream') {
                    newitem.Id = 3;

                    newitem.Title = "Workstream";

                }
                item.TaskType = newitem;
            }
            item.SmartTime = "";
            if (item.ClientCategory != undefined && item.ClientCategory != "") {

                var cliId = item.ClientCategory.split(';#')[0];
                var cliTitle = item.ClientCategory.split('#')[1];
                var cli: any = {};
                cli.Id = cliId;
                cli.Title = cliTitle;
                item.ClientCategory = {};
                item.ClientCategory.results = [];
                item.ClientCategory.results.push(cli);


            }
            item.TaskID = globalCommon.getTaskId(item);
            item.NewClientCategory = ''
            if (item.ClientCategory != "" && item.ClientCategory != undefined && item.ClientCategory.results != undefined && item.ClientCategory.results.length > 0) {
                item.ClientCategory.results.forEach((val: any) => {
                    item.NewClientCategory += val.Title + ';';
                })
            }
            if (item.ClientCategory != "" && item.ClientCategory != undefined) {
                TaxonomyItems.forEach((firstLevel: any) => {

                    item.ClientCategory.results.forEach((clientcategory: any) => {
                        if (clientcategory.ParentClientCategoryStructure == undefined)
                            clientcategory.ParentClientCategoryStructure = '';
                        if (firstLevel.Parent != undefined && firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title != undefined) {
                            clientcategory.ParentClientCategoryStructure = firstLevel.Parent.Title + '>' + firstLevel.Title;
                        }
                        else if (firstLevel.Parent != undefined && firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title == undefined) {
                            clientcategory.ParentClientCategoryStructure = firstLevel.Title;
                        }
                    })
                    if (firstLevel.childs != undefined && firstLevel.childs.length > 0) {
                        firstLevel.childs.forEach((SecondLevel: any) => {
                            item.ClientCategory.results.forEach((clientcategory: any) => {
                                if (clientcategory.ParentClientCategoryStructure == undefined)
                                    clientcategory.ParentClientCategoryStructure = '';
                                if (SecondLevel.Parent != undefined && SecondLevel.Id == clientcategory.Id && SecondLevel.Parent.Title != undefined) {
                                    clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + SecondLevel.Title;
                                }
                            })
                            if (SecondLevel.childs != undefined && SecondLevel.childs.length > 0) {
                                SecondLevel.childs.forEach((ThirdLevel: any) => {
                                    item.ClientCategory.results.forEach((clientcategory: any) => {
                                        if (clientcategory.ParentClientCategoryStructure == undefined)
                                            clientcategory.ParentClientCategoryStructure = '';
                                        if (ThirdLevel.Parent != undefined && ThirdLevel.Id == clientcategory.Id && ThirdLevel.Parent.Title != undefined) {
                                            clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + ThirdLevel.Parent.Title + '>' + ThirdLevel.Title;
                                        }
                                    })


                                    if (ThirdLevel.childs != undefined && ThirdLevel.childs.length > 0) {
                                        ThirdLevel.childs.forEach((FouthLevel: any) => {
                                            item.ClientCategory.results.forEach((clientcategory: any) => {
                                                if (clientcategory.ParentClientCategoryStructure == undefined)
                                                    clientcategory.ParentClientCategoryStructure = '';
                                                if (FouthLevel.Parent != undefined && FouthLevel.Id == clientcategory.Id && FouthLevel.Parent.Title != undefined) {
                                                    clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + ThirdLevel.Parent.Title + '>' + FouthLevel.Parent.Title + '>' + FouthLevel.Title;
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                        })

                    }

                })
            }

           
            if (item.Author != undefined) {
                taskUsers.forEach((newuser: any) => {
                    if (item.Author == newuser.AssingedToUser.Title) {
                        if (newuser.Item_x0020_Cover != undefined)
                            item['autherimage'] = newuser.Item_x0020_Cover.Url;
                        item['autheruserId'] = newuser.AssingedToUserId;
                        item['autherusertitle'] = newuser.Title;
                    }
                    if (item.Editor == newuser.AssingedToUser.Title) {
                        if (newuser.Item_x0020_Cover != undefined)
                            item['editoreimage'] = newuser.Item_x0020_Cover.Url;
                        item['userid'] = newuser.AssingedToUserId;
                        item['usertitle'] = newuser.Title;
                    }

                })
            }

            if (item.PercentComplete != undefined && item.PercentComplete > 2) {
                item.PercentComplete = parseInt((item.PercentComplete / 100).toFixed(0));
            } else if (item.PercentComplete != undefined)
                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));

            else
                item.PercentComplete = 0;
            if (item.DueDate != undefined)
                item.DueDate = Moment(item.DueDate).format('DD/MM/YYYY');
            if (item.Modified != undefined)
                item.Modifiednew = Moment(item.Modified).format('DD/MM/YYYY');//SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY');
            if (item.Created != undefined)
                item.CreatedNew = Moment(item.Created).format('DD/MM/YYYY');//SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
            item['PortfolioItemsId'] = undefined

            if (item.Portfolio != undefined && item.Portfolio?.Title !=undefined) {
                item['PortfolioItemsId'] = item.Portfolio.Id;
            }
            item.NewTitle = item.Title;

            allitems.push(item);
            copyAllitemsdata = allitems;
            setAllitemsData((allitemsData) => allitems);


        })

        generateALLReportsItems(allitems);
        //   AllDataOfTask
        if (Mainportfolio == 'servicetype') {
            findservie(Mainportfolio);

        }
        allitems.forEach((task: any) => {
            task['CompleteStructure'] = makeFullStructureOfPortfolioTaskDatabase(task, allitems);
        })
    }
    const getportfolioitem = async (portfolioid: any) => {
        let web = new Web(SelectedProp.siteUrl);
        let results: any = [];
        results = await web.lists
            .getById(SelectedProp.MasterTaskListID)
            .items
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            .filter("id eq " + portfolioid + "")
            .expand('Parent,Portfolio,ServicePortfolio')
            .get()
        console.log(results);
        var newComponentportfolio: any = results[0];
        if (newComponentportfolio != undefined && newComponentportfolio != '')
            //  $scope.Alltagitem(newComponentportfolio);
            if (newComponentportfolio != undefined && newComponentportfolio.Parent.Id != undefined) {
                let resultschild: any = [];
                resultschild = await web.lists
                    .getById(SelectedProp.MasterTaskListID)
                    .items
                    .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
                    .top(4999)
                    .filter("id eq " + newComponentportfolio.Parent.Id + "")
                    .expand('Parent,Portfolio')
                    .get()
                console.log(resultschild);
                var newComponentsecondportfolio = resultschild[0];
                if (newComponentsecondportfolio != undefined && newComponentsecondportfolio != '')
                    // $scope.Alltagitem($scope.newComponentsecondportfolio)
                    if (newComponentsecondportfolio != undefined && newComponentsecondportfolio.Parent.Id != undefined) {
                         let Subschild: any = [];
                        Subschild = await web.lists
                            .getById(SelectedProp.MasterTaskListID)
                            .items
                            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
                            .top(4999)
                            .filter("id eq " + newComponentsecondportfolio.Parent.Id + "")
                            .expand('Parent,Portfolio')
                            .get()
                        console.log(Subschild);
                        var newComponentthridportfolio = Subschild[0];
                        // if (newComponentthridportfolio != undefined && newComponentthridportfolio != '')
                        // $scope.Alltagitem($scope.newComponentthridportfolio)


                    }

            }

    }
    const loadAlltask = async (NewType: any, newvalue: any) => {
        // $scope.orderBy1 = 'ItemRank';
        //  SharewebCommonFactoryService.showProgressBar();
        // let defer = $q.defer();
        // let allCalls = [];
        var filters: any = '';
        if (MainSite != undefined && MainSite != "") {
            var newsite = MainSite.toLowerCase();
            if (newsite == 'small projects' || newsite == 'smallprojects')
                newsite = 'small projects';
            if (newsite == 'offshore tasks' || newsite == 'offshoretasks')
                newsite = 'offshore tasks';
            if (newsite == 'de' || newsite == 'development effectiveness') {
                newsite = 'de';
            }
            var newsites: any = [];
            SitesConfig.forEach((newitem: any) => {
                var titlename = newitem.Title.toLowerCase();
                if (titlename == newsite) {
                    newsites.push(newitem);
                }

            })
            var SitesConfig = newsites;
            filters = "";
        }
        if (NewType == 'componenttype' && (CompnentId != undefined || CompnentId != "")) {
            if (CompnentId != undefined && CompnentId != "") {
                filters = "(Portfolio/Id eq '" + CompnentId + "')";
            }
            else {
                filters = "(Portfolio/Id gt 0)";
            }
            if (CompnentId != undefined || CompnentId != "") {
                getportfolioitem(CompnentId);

            }
        }

        if (NewType == 'servicetype' && newvalue != undefined) {
            filters = newvalue;
            if (Finalcomponent != undefined && Finalcomponent.ServicePortfolio.Id != undefined) {
                getportfolioitem(Finalcomponent.ServicePortfolio.Id);
            }

        }
        if (NewType == 'Loadalldataitems' && newvalue == undefined) {
            filters = "(Portfolio/Id gt 0)";

        }
        if (AllDataOfTask == undefined) { AllDataOfTask = []; }
        var Counter = 0;
        if (SitesConfig != undefined && SitesConfig.length > 0) {
            SitesConfig.forEach, async (config: any, index: any) => {
                let web = new Web(SelectedProp.siteUrl);
                let AllTasksMatches = [];
                AllTasksMatches = await web.lists
                    .getById(config.listId)
                    .items
                    .select('ParentTask/Title', 'ParentTask/Id', 'Portfolio/Title', 'ClientTime', 'Portfolio/Id','ItemRank', 'Portfolio_x0020_Type', 'SiteCompositionSettings', 'TaskLevel',
                        'TaskLevel', 'TimeSpent', 'BasicImageInfo', 'OffshoreComments', 'OffshoreImageUrl', 'CompletedDate', 'TaskID',
                        'ResponsibleTeam/Id', 'ResponsibleTeam/Title', 'TaskCategories/Id', 'TaskCategories/Title', 'ParentTask/TaskID', 'TaskType/Id', 'TaskType/Title',
                        'TaskType/Level', 'PriorityRank', 'TeamMembers/Title', 'TeamMembers/Name', 'Portfolio/ItemType',
                        'TeamMembers/Id', 'ComponentLink', 'IsTodaysTask', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id',
                        'ClientCategory/Id', 'ClientCategory/Title', 'FileLeafRef', 'FeedBack', 'Title', 'Id', 'PercentComplete', 'StartDate', 'DueDate', 'Comments', 'Categories', 'Status', 'Body',
                        'Mileage', 'PercentComplete', 'ClientCategory', 'Priority', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title'
                    )
                    .expand('ParentTask', 'Events', 'Portfolio', 'TaskType', 'AssignedTo', 'Component', 'ClientCategory', 'Author', 'Editor', 'TeamMembers', 'ResponsibleTeam', 'TaskCategories')
                    .filter("Status ne 'Completed'")
                    .orderBy('orderby', false)
                    .getAll(4000);

                console.log(AllTasksMatches);
                Counter++;
                AllDataOfTask = AllDataOfTask.concat(AllTasksMatches);
                console.log(AllTasksMatches.length);
                if (Counter == SitesConfig.length) {
                    if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {

                        AllDataOfTask.forEach((item: any) => {
                            item.com_title = '';
                            item.siteType = SitesConfig[index].Title;
                            // item.siteTypeLocal = MainSiteLocal;
                            item.listId = SitesConfig[index].listId;
                            item.TaskID = globalCommon.getTaskId(item);
                            item['PortfolioItemsId'] = undefined
                           
                            if (item.Portfolio?.Title !=undefined) {
                                item['PortfolioItemsId'] = item.Portfolio.Id;
                            }
                            item.Editor = item.Editor.Title;
                            item.Author = item.Author.Title;
                            if (item.Author != undefined) {
                                taskUsers.forEach((newuser: any) => {
                                    if (item.Author == newuser.AssingedToUser.Title) {
                                        if (newuser.Item_x0020_Cover != undefined)
                                            item['autherimage'] = newuser.Item_x0020_Cover.Url;
                                        item['autheruserId'] = newuser.AssingedToUserId;
                                        item['autherusertitle'] = newuser.Title;
                                    }
                                    if (item.Editor == newuser.AssingedToUser.Title) {
                                        if (newuser.Item_x0020_Cover != undefined)
                                            item['editoreimage'] = newuser.Item_x0020_Cover.Url;
                                        item['userid'] = newuser.AssingedToUserId;
                                        item['usertitle'] = newuser.Title;
                                    }

                                })
                            }

                            if (item.PercentComplete != undefined && item.PercentComplete > 2) {
                                item.PercentComplete = parseInt((item.PercentComplete / 100).toFixed(0));
                            } else if (item.PercentComplete != undefined)
                                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));

                            else
                                item.PercentComplete = 0;
                            if (item.Modified != undefined)
                                item.Modifiednew = globalCommon.ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY'); //SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY');
                            if (item.Created != undefined)
                                item.CreatedNew = globalCommon.ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');//SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');


                            //if (!$scope.isItemExistsById($scope.allitems, item.Id)) {
                            //    if (!$scope.isItemExistsById($scope.AllDataOfTask, item.Id)) {
                            //        item.flag = true;
                            //        item.NewTitle = item.Title;
                            //        $scope.AllDataOfTask.push(item);
                            //    }
                            //}
                            item.NewClientCategory = ''
                            if (item.ClientCategory.results.length > 0) {
                                item.ClientCategory.results.forEach((val: any) => {
                                    item.NewClientCategory += val.Title + ';';
                                })
                            }
                            TaxonomyItems.forEach((firstLevel: any) => {
                                item.ClientCategory.results.forEach((clientcategory: any) => {
                                    if (clientcategory.ParentClientCategoryStructure == undefined)
                                        clientcategory.ParentClientCategoryStructure = '';
                                    if (firstLevel.Parent != undefined && firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title != undefined) {
                                        clientcategory.ParentClientCategoryStructure = firstLevel.Parent.Title + '>' + firstLevel.Title;
                                    }
                                    else if (firstLevel.Parent != undefined && firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title == undefined) {
                                        clientcategory.ParentClientCategoryStructure = firstLevel.Title;
                                    }
                                })
                                if (firstLevel.childs != undefined && firstLevel.childs.length > 0) {
                                    firstLevel.childs.forEach((SecondLevel: any) => {
                                        item.ClientCategory.results.forEach((clientcategory: any) => {
                                            if (clientcategory.ParentClientCategoryStructure == undefined)
                                                clientcategory.ParentClientCategoryStructure = '';
                                            if (SecondLevel.Parent != undefined && SecondLevel.Id == clientcategory.Id && SecondLevel.Parent.Title != undefined) {
                                                clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + SecondLevel.Title;
                                            }
                                        })
                                        if (SecondLevel.childs != undefined && SecondLevel.childs.length > 0) {
                                            SecondLevel.childs.forEach((ThirdLevel: any) => {
                                                item.ClientCategory.results.forEach((clientcategory: any) => {
                                                    if (clientcategory.ParentClientCategoryStructure == undefined)
                                                        clientcategory.ParentClientCategoryStructure = '';
                                                    if (ThirdLevel.Parent != undefined && ThirdLevel.Id == clientcategory.Id && ThirdLevel.Parent.Title != undefined) {
                                                        clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + ThirdLevel.Parent.Title + '>' + ThirdLevel.Title;
                                                    }
                                                })


                                                if (ThirdLevel.childs != undefined && ThirdLevel.childs.length > 0) {
                                                    ThirdLevel.childs.forEach((FouthLevel: any) => {
                                                        item.ClientCategory.results.forEach((clientcategory: any) => {
                                                            if (clientcategory.ParentClientCategoryStructure == undefined)
                                                                clientcategory.ParentClientCategoryStructure = '';
                                                            if (FouthLevel.Parent != undefined && FouthLevel.Id == clientcategory.Id && FouthLevel.Parent.Title != undefined) {
                                                                clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + ThirdLevel.Parent.Title + '>' + FouthLevel.Parent.Title + '>' + FouthLevel.Title;
                                                            }
                                                        })
                                                    })
                                                }
                                            })
                                        }
                                    })

                                }
                            })

                            generateALLReportsItems(AllDataOfTask);
                            var copyAllDataOfTask = globalCommon.ArrayCopy(AllDataOfTask);
                        });

                        AllDataOfTask.forEach((task: any) => {
                            task['CompleteStructure'] = makeFullStructureOfPortfolioTaskDatabase(task, AllDataOfTask);
                        })
                        // if (CompnentId != undefined && CompnentId != "") {
                        //     $scope.loadLinkedComponentTask();
                        // }

                        // SharewebCommonFactoryService.hideProgressBar();
                        //  $scope.sortBy1('ItemRank', false);

                    }
                }
            }
        }
    }


    const getTaskUsers = async () => {
        let web = new Web(SelectedProp.siteUrl);
        let Response = [];
        Response = await web.lists
            .getById(SelectedProp.TaskUsertListID)
            .items
            .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id', 'UserGroup/Id')
            .expand('AssingedToUser', 'UserGroup')
            .get();
        taskUsers = Response;
        console.log(Response);
        setTaskUser(Response);
    }
    const LoadComponents = async () => {
        let web = new Web(SelectedProp.siteUrl);
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(SelectedProp.MasterTaskListID)
            .items
            .select("ID", "Id", "Title", "Mileage", "TaskListId", "TaskListName", "WorkspaceType", "PortfolioLevel", "PortfolioStructureID", "PortfolioStructureID",
                "ComponentLink", "Package", "Comments", "DueDate", "Sitestagging", "Body", "Deliverables", "SiteCompositionSettings", "StartDate",
                "Created", "Item_x0020_Type", "Help_x0020_Information", "Background", "Categories", "Short_x0020_Description_x0020_On", "TechnicalExplanations", "Idea", "ValueAdded",
                "CategoryItem", "PriorityRank", "Priority", "TaskDueDate", "PercentComplete", "Modified", "CompletedDate", "ItemRank", "Portfolio_x0020_Type",
                "Parent/Id", "Parent/Title", "Portfolio/Id", "Portfolio/Title", "Portfolio/ItemType", "Author/Title", 'Editor/Title',
                 "TaskCategories/Id", "TaskType/Title", "TaskCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", 'ResponsibleTeam/Id', 'ResponsibleTeam/Title',
            )
            .expand('Parent', 'Events', 'Portfolio', 'TaskType', 'AssignedTo', 'Component', 'ClientCategory', 'Author', 'Editor', 'TeamMembers', 'ResponsibleTeam', 'TaskCategories')
            .top(4999)
            .getAll()

        console.log(componentDetails);
        componentDetails.forEach((i: any) => {
            if (i.Synonyms != undefined) {
                i.Synonyms = JSON.parse(i.Synonyms);
            } else {
                i.Synonyms = [];
            }
            if (i.Portfolio_x0020_Type == 'Service') {
                i['isService'] = true;
            }
            if (i.Portfolio_x0020_Type == 'Events') {
                i['isEvents'] = true;
            } else {
                i['isService'] = false;
                i['isEvents'] = false;
            }
            if (i.PortfolioStructureID != null && i.PortfolioStructureID != undefined) {
                i['TaskID'] = i.PortfolioStructureID;
            }
            else {
                i['TaskID'] = '';
            }
            i['isNewItem'] = false;
            if (i.TaskCategories.length > 0) {
                i.TaskCategories.forEach((item: any) => {
                    if (item.Id == 290) {
                        i['isNewItem'] = true;
                    }
                })
            }
            if (i['isNewItem'] == false) {
                if (i.Categories == 'Draft') {
                    i['isNewItem'] = true;
                }
            }
            i['HaveChilds'] = false;
            i['HaveMoreChilds'] = false;
            i['isShowActive'] = true;
            i['ishideActive'] = false;
            i['isShifted'] = false;
            i['childs'] = [];
            i['expanded'] = true;
            i['flag'] = true;
            i['siteType'] = 'Master Tasks';
            i['ItemType'] = i.Item_x0020_Type;
            i['newTitle'] = i.Title;
            i['childsLength'] = 0;
            i['isRestructureActive'] = false;
            i['isSearch'] = false;
            i['isAlreadyHave'] = false;
            if (i['TaskDueDate'] != undefined) i['DateTaskDueDate'] = new Date(i['TaskDueDate']);
            i['HelpInformation'] = i.Help_x0020_Information;
            i['ShortDescription'] = i.Short_x0020_Description_x0020_On;
            i['AdminNotes'] = i.AdminNotes;
            i.PercentComplete = (i.PercentComplete * 100).toFixed(0);
            if (i['CompletedDate'] != undefined) i['DateTaskDueDate'] = new Date(i['CompletedDate']);
            if (i['CompletedDate'] != undefined) i['CompletedDate'] = Moment(i['CompletedDate']).format('DD/MM/YYYY'); //new Date(i['CompletedDate']).format('dd/MM/yyyy');
            if (i['StartDate'] != undefined) i['StartDate'] = Moment(i['StartDate']).format('DD/MM/YYYY');//new Date(i['StartDate']).format('dd/MM/yyyy');
            i.CreatedDate = globalCommon.ConvertLocalTOServerDate(i.Created, 'DD/MM/YYYY');
            i.ModifiedDate = globalCommon.ConvertLocalTOServerDate(i.Modified, 'DD/MM/YYYY');
        });

        // ComponetsData['allComponets'] = angular.copy(success.d.results);
        AllComponetsData = componentDetails;


        // LoadAllSiteTasks();
        AllComponetsDataNew = componentDetails;

    }
    const GetAllTaskTime = async () => {
        var SiteCount = 0;
        var filteres = '';
        var expendcolumn = '';
        var Displaycolumn = '';
        if (SitesConfig.length > 0) {
            SitesConfig.forEach((site: any, index: any) => {
                SiteCount++;
                if (site.Title != undefined && site.Title.toLowerCase() == 'shareweb')
                    site.Title = site.Title.toLowerCase().replace(/\b[a-z]/g, function (letter: any) { return letter.toUpperCase(); });
                if (site.Title != undefined && site.Title == 'Small Projects') {
                    site.Title = 'SmallProjects';
                }
                if (index == 0) {
                    filteres = "(Task" + site.Title + "/Id gt 0 )";
                    Displaycolumn = ",Task" + site.Title + "/Id,Task" + site.Title + '/Title';
                    expendcolumn = ",Task" + site.Title;
                } else {
                    filteres = "(Task" + site.Title + "/Id gt 0 )";
                    Displaycolumn += ",Task" + site.Title + "/Id,Task" + site.Title + '/Title';
                    expendcolumn += ",Task" + site.Title;
                }
            })
            filteres = "(" + filteres + ")";
            let select = "Id,Title,TaskDate,TaskTime,AdditionalTimeEntry,Description,Author/Id,AuthorId,Author/Title,Category/Id,Category/Title" + Displaycolumn + "&$expand=Author,Category" + expendcolumn;
            let TimesheetConfiguration: any = '';
            if (Mainsiteitem != undefined && Mainsiteitem.toLowerCase() == 'migration') {
                TimesheetConfiguration = { 'SiteUrl': SelectedProp.siteUrl, "listId": '9ed5c649-3b4e-42db-a186-778ba43c5c93', "query": select };  //"filter": filteres

            }
            else {
                TimesheetConfiguration = { 'SiteUrl': 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', "listId": '464fb776-e4b3-404c-8261-7d3c50ff343f', "query": select };
                //let TimesheetConfiguration = { 'SiteUrl': GlobalConstants.ADMIN_SITE_URL, "listId": GlobalConstants.TASK_TIME_SHEET_LISTID, "query": select };  //"filter": filteres



            }
            LoadAllTimeSheetData(TimesheetConfiguration, select);
        };
    }
    const LoadAllTimeSheetData = async (TimesheetConfiguration: any, query: any) => {
        var count = 0;
        const web = new Web(TimesheetConfiguration.SiteUrl);
        let returnValue: any = [];
        let result: any = [];
        try {
            result = await web.lists
                .getById(TimesheetConfiguration.listId)
                .items
                .select(query)
                .getAll(4000)
            setAllTimeSheetData(result);
            // if (Pageurlshareweb != "" && MainSite != "") {
            //     Getportfolioid(Pageurlshareweb, MainSite, Mainportfolio);
            //     // Sharewebselectionopen();
            // }


        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    const getChildsSmarttaxonomy = function (item: any, items: any) {
        item.childs = [];
        items.forEach((childItem: any) => {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChildsSmarttaxonomy(childItem, items);
            }
        });
    }
    const GetSmartmetadata = async () => {
        var metadatItem: any = []
        let web = new Web(SelectedProp.siteUrl);
        let smartmetaDetails: any = [];
        smartmetaDetails = await web.lists
            .getById(SelectedProp.SmartMetadataListID).items
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Color_x0020_Tag', 'Selectable', 'Parent/Id', 'Parent/Title')
            .expand('Parent')
            .top(4999)
            .get()

        setMetadata(smartmetaDetails);
        smartmetaDetails.forEach((newtest: any) => {
            newtest.Id = newtest.ID;
            if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Foundation" || newtest.Title == "Small Projects" || newtest.Title == "Offshore Tasks" || newtest.Title == "Health" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites' && MainSite != undefined && (newtest.Title.toLowerCase() == MainSite.toLowerCase()))
                SitesConfig.push(newtest)

            if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
                TaxonomyItems.push(newtest);
                getChildsSmarttaxonomy(newtest, smartmetaDetails);
                if (newtest.childs != undefined && newtest.childs.length > 0) {
                    TaxonomyItems.push(newtest)
                }
            }

        });
        if (Pageurls != "" && MainSite != "") {
            Getportfolioid(Pageurls, MainSite, Mainportfolio);
            // Sharewebselectionopen();
        }
        // GetAllTaskTime();
    }
    React.useEffect(() => {
        SelectedProp = SelectedProp.SelectedProp;
        // LoadAllTimeSheetData12();
        params = new URLSearchParams(window.location.href);
        (async () => {
            let Pageurlshareweb1 = await Promise.all([globalCommon.getParameterByName('PageUrl')]);
            if (Pageurlshareweb1[0] != "" && Pageurlshareweb1.length > 0)
                //  setPageurlshareweb(Pageurlshareweb => Pageurlshareweb1[0])
                Pageurls = Pageurlshareweb1[0];
        })();
        (async () => {
            let Compnent = await Promise.all([globalCommon.getParameterByName('Component')]);
            if (Compnent[0] != "" && Compnent.length > 0)
                CompnentId = Compnent[0]
        })();
        LoadComponents();
        GetSmartmetadata();
        getTaskUsers();
    }, [])
    // if (CompnentId != undefined && CompnentId != "") {
    //     LoadComponentsone()


    // }
    //Alreday linked with page table part
    // const columns = React.useMemo<ColumnDef<any, unknown>[]>(
    //     () => [
    //         {
    //             accessorKey: "TaskID",
    //             placeholder: "Task Id",
    //             header: "",
    //             // size: 175,
    //             // cell: ({ row, getValue }) => (

    //             //     <>
    //             //         {row?.original?.SiteIcon != undefined ?
    //             //             <a className="hreflink" title="Show All Child" data-toggle="modal">
    //             //                 <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
    //             //             </a> : <>{row?.original?.Title != "Others" ? <div className='Dyicons'>{row?.original?.SiteIconTitle}</div> : ""}</>
    //             //         }
    //             //         {getValue()}
    //             //     </>
    //             // ),
    //         },
    //         {
    //             accessorKey: "Services",
    //             placeholder: "Service",
    //             header: "",

    //         },
    //         {
    //             accessorKey: "Title",
    //             placeholder: "Title",
    //             header: "",

    //         },


    //         {
    //             accessorFn: (row) => row?.ClientCategory?.map((elem: any) => elem.Title).join("-"),
    //             cell: ({ row }) => (
    //                 <>
    //                     {row?.original?.ClientCategory?.map((elem: any) => {
    //                         return (
    //                             <> <span title={elem?.Title} className="ClientCategory-Usericon">{elem?.Title?.slice(0, 2).toUpperCase()}</span></>
    //                         )
    //                     })}
    //                 </>
    //             ),
    //             id: 'ClientCategory',
    //             placeholder: "Client Category",
    //             header: "",
    //             size: 200,
    //         },
    //         {
    //             accessorKey: "PercentComplete",
    //             placeholder: "Status",
    //             header: "",
    //             size: 70,
    //         },
    //         {
    //             accessorKey: "ItemRank",
    //             placeholder: "Item Rank",
    //             header: "",
    //             size: 60,
    //         },
    //         {
    //             accessorKey: "DueDate",
    //             placeholder: "Due Date",
    //             header: "",
    //             size: 90,
    //         },
    //     ],
    //     [allitemsData]
    // );


    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                cell: ({ row, getValue }) => (
                    <>
                        <span className="d-flex">
                            {row?.original?.Title != "Others" ? (
                                <IndeterminateCheckbox
                                    {...{
                                        checked: row.getIsSelected(),
                                        indeterminate: row.getIsSomeSelected(),
                                        onChange: row.getToggleSelectedHandler(),
                                    }}
                                />
                            ) : (
                                ""
                            )}{" "}
                            {getValue()}
                        </span>
                    </>
                ),
                accessorKey: "",
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                size: 30,
            },
            {
                accessorKey: "TaskID",
                cell: ({ row, getValue }) => (
                    <>
                        <span className="d-flex">
                            {row?.original?.SiteIcon &&
                                <a className="hreflink" title="Show All Child" data-toggle="modal" >
                                    <img src={row?.original?.SiteIcon}></img>
                                </a>
                            }
                            {getValue()}
                        </span>
                    </>
                ),
                placeholder: "Task Id",
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={SelectedProp.SelectedProp.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteName + ""} >
                            <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
                        </a>
                    </>
                ),
                id: "Title",
                placeholder: "Title",
                header: "",
            },
            {
                accessorFn: (row) => row?.ClientCategory?.map((elem: any) => elem.Title).join("-"),
                cell: ({ row }) => (
                    <>
                        <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                    </>
                ),
                id: "ClientCategory",
                placeholder: "Client Category",
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.Services?.map((elem: any) => elem.Title).join("-"),
                cell: ({ row, getValue }) => (
                    <>
                     {row?.original?.Services?.map((element:any)=>{
                        return(
                            <><a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={SelectedProp.SelectedProp.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + element.Id+""} >
                           {element.Title} </a>{getValue} </>
                        )
                     })} 
                    </>
                ),
                placeholder: "Services",
                header: "",
                id: "Services",
                size: 42,
            },
            {
                accessorKey: "PercentComplete",
                placeholder: "Status",
                header: "",
                size: 42,
            },
            {
                accessorKey: "ItemRank",
                placeholder: "Item Rank",
                header: "",
                size: 42,
            },
            {
                accessorKey: "Modifiednew",
                placeholder: "Modified",
                header: "",
                size: 100,
            },
            {
                accessorKey: "CreatedNew",
                placeholder: "Created",
                header: "",
                size: 100,
            },
            {
                accessorKey: "SmartTime",
                placeholder: "Smart Time",
                header: "",
                size: 60,
            }
        ],
        [allitemsData]
    );

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {


    }, []);


    return (

        <div className='serviepannelgreena'>
            {/* {Pageurls != '' && */}
                <section className="TableContentSection taskprofilepagegreen">
                <div className="ps-3"><span>Shareweb URL: {Pageurls != '' && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={Pageurls} >{Pageurls}</a>} - Component: {CompnentId && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={"https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Portfolio-Profile.aspx?taskId=" + CompnentId} >Key Profile Page</a>}</span><span><a data-interception="off" target="_blank" className="hreflink me-3 pull-right serviceColor_Active" href={params}>Old Smart Shareweb Page</a></span></div>
                    <div className="container-fluid">
                        <section className="TableSection">
                            <div className="container p-0">
                                <div className="Alltable mt-2">
                                    <div className="tbl-headings bg-white">
                                        <span className="leftsec">
                                            <span><FaChevronRight /></span>
                                            <label> Already Linked with Page</label>
                                            <span>
                                                <span><div className="container-2 mx-1">
                                                    <span className="icon">
                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
                                                    </span>
                                                    <input type="search" id="search" placeholder="Search All..." value="" /></div></span>
                                            </span>
                                        </span>
                                    </div>
                                    {allitemsData.length &&
                                        <div className="col-sm-12 p-0 smart">
                                            <div >
                                                <GlobalCommanTable  columns={columns} data={allitemsData}  TaskUsers={taskUsers}  showHeader={false} callBackData={callBackData} />
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                        </section>
                    </div>
                    {SelectedProp?.SelectedProp &&
                        <div className="col-sm-12 p-0 smart"><PortfolioTable SelectedProp={SelectedProp.SelectedProp} /></div>
                    }
                </section>
            {/* } */}




        </div>
    )

} export default SmartConnectTable;




