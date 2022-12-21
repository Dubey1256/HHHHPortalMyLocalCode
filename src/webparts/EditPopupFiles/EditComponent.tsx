import * as React from "react";
// import ImagesC from "./Images";
import { arraysEqual, Modal } from 'office-ui-fabric-react';
import Tabs from "./Tabs/Tabs";
import Tab from "./Tabs/Tab";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import "bootstrap/js/dist/tab.js";
import * as moment from 'moment';
import './Tabs/styles.css';
import { Web } from "sp-pnp-js";
import ComponentPortPolioPopup from './ComponentPortfolioSelection';
import CommentCard from "../../globalComponents/Comments/CommentCard";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function EditInstitution(item: any) {
    // Id:any




    const [CompoenetItem, setComponent] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [useeffectdata, setuseeffectdata] = React.useState(false);
    const [selectedOption, setselectedOption] = React.useState('');
    const [SharewebItemRank, setSharewebItemRank] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [AllComponents, setComponentsData] = React.useState([]);
    const [CollapseExpend, setCollapseExpend] = React.useState(false);
    $('.ms-Dialog-main .main-153').hide();
    const setModalIsOpenToTrue = (e: any) => {
        // e.preventDefault()
        setModalIsOpen(true)
    }
    const setModalIsOpenToFalse = () => {

        EditComponentCallback();
        setModalIsOpen(false)
    }

    const Call = React.useCallback((item1) => {
        if (CompoenetItem != undefined && item1 != undefined) {
            item.props.smartComponent = item1.smartComponent;
            // setComponent([ item.props]);
        }
        setIsComponent(false);
    }, []);
    var ConvertLocalTOServerDate = function (LocalDateTime: any, dtformat: any) {
        if (dtformat == undefined || dtformat == '') dtformat = "DD/MM/YYYY";

        // below logic works fine in all condition 
        if (LocalDateTime != '') {
            var serverDateTime;
            var vLocalDateTime = new Date(LocalDateTime);
            //var offsetObj = GetServerOffset();
            //var IANATimeZoneName = GetIANATimeZoneName();
            var mDateTime = moment(LocalDateTime);
            // serverDateTime = mDateTime.tz('Europe/Berlin').format(dtformat); // 5am PDT
            //serverDateTime = mDateTime.tz('America/Los_Angeles').format(dtformat);  // 5am PDT
            return serverDateTime;
        }
        return '';
    }
    var getMultiUserValues = function (item: any) {
        var users = '';
        var isuserexists = false;
        var userarray = [];
        if (item.AssignedTo != undefined && item.AssignedTo.results != undefined)
            userarray = item.AssignedTo.results;
        for (var i = 0; i < userarray.length; i++) {
            users += userarray[i].Title + ', ';
        }
        if (users.length > 0)
            users = users.slice(0, -2);
        return users;
    };
    var parseJSON = function (jsonItem: any) {
        var json = [];
        try {
            json = JSON.parse(jsonItem);
        } catch (err) {
            console.log(err);
        }
        return json;
    };
    var LIST_CONFIGURATIONS_TASKS = '[{"Title":"Gruene","listId":"2302E0CD-F41A-4855-A518-A2B1FD855E4C","siteName":"Gruene","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.gruene-washington.de","MetadataName":"SP.Data.GrueneListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/logo-gruene.png"},{"Title":"DE","listId":"3204D169-62FD-4240-831F-BCDDA77F5028","siteName":"DE","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Development-Effectiveness","MetadataName":"SP.Data.DEListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png"},{"Title":"DRR","listId":"CCBCBAFE-292E-4384-A800-7FE0AAB1F70A","siteName":"DRR","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.DRRListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_drr.png"},{"Title":"Education","listId":"CF45B0AD-7BFF-4778-AF7A-7131DAD2FD7D","siteName":"Education","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/education","MetadataName":"SP.Data.EducationListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png"},{"Title":"EI","listId":"E0E1FC6E-0E3E-47F5-8D4B-2FBCDC3A5BB7","siteName":"EI","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei","MetadataName":"SP.Data.EIListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png"},{"Title":"EPS","listId":"EC6F0AE9-4D2C-4943-9E79-067EC77AA613","siteName":"EPS","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/eps","MetadataName":"SP.Data.EPSListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png"},{"Title":"Gender","listId":"F8FD0ADA-0F3C-40B7-9914-674F63F72ABA","siteName":"Gender","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.GenderListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png"},{"Title":"Health","listId":"E75C6AA9-E987-43F1-84F7-D1818A862076","siteName":"Health","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Health","MetadataName":"SP.Data.HealthListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_health.png"},{"Title":"HHHH","listId":"091889BD-5339-4D11-960E-A8FF38DF414B","siteName":"HHHH","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.HHHHListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png"},{"Title":"KathaBeck","listId":"beb3d9d7-daf3-4c0f-9e6b-fd36d9290fb9","siteName":null,"siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://kathabeck.sharepoint.com/sites/TeamK4Bundestag","MetadataName":"SP.Data.KathaBeckListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png"},{"Title":"QA","listId":"61B71DBD-7463-4B6C-AF10-6609A23AE650","siteName":"QA","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/qa","MetadataName":"SP.Data.QAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png"},{"Title":"ALAKDigital","listId":"d70271ae-3325-4fac-9893-147ee0ba9b4d","siteName":"ALAKDigital","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei/digitaladministration","MetadataName":"SP.Data.ALAKDigitalListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_DA.png"},{"Title":"Shareweb","listId":"B7198F49-D58B-4D0A-ADAD-11995F6FADE0","siteName":"Shareweb","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/joint","MetadataName":"SP.Data.SharewebListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png"},{"Title":"Small Projects","listId":"3AFC4CEE-1AC8-4186-B139-531EBCEEA0DE","siteName":"Small Projects","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Small_x0020_ProjectsListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/small_project.png"},{"Title":"Offshore Tasks","listId":"BEB90492-2D17-4F0C-B332-790BA9E0D5D4","siteName":"Offshore Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.SharewebQAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/offshore_Tasks.png"},{"Title":"Migration","listId":"D1A5AC25-3DC2-4939-9291-1513FE5AC17E","siteName":"Migration","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Migration","MetadataName":"SP.Data.MigrationListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png"},{"Title":"Master Tasks","listId":"EC34B38F-0669-480A-910C-F84E92E58ADF","siteName":"Master Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Master_x0020_TasksListItem","ImageUrl":"","ImageInformation":[{"ItemType":"Component","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/feature_icon.png"}]}]'
    var GetIconImageUrl = function (listName: any, listUrl: any, Item: any) {
        var IconUrl = '';
        if (listName != undefined) {
            let TaskListsConfiguration = parseJSON(LIST_CONFIGURATIONS_TASKS);
            let TaskListItem = TaskListsConfiguration.filter(function (filterItem: any) {
                let SiteRelativeUrl = filterItem.siteUrl;
                return (filterItem.Title.toLowerCase() == listName.toLowerCase() && SiteRelativeUrl.toLowerCase() == (listUrl).toLowerCase());
            });
            if (TaskListItem.length > 0) {
                if (Item == undefined) {
                    IconUrl = TaskListItem[0].ImageUrl;
                }
                else if (TaskListItem[0].ImageInformation != undefined) {
                    var IconUrlItem = (TaskListItem[0].ImageInformation.filter(function (index: any, filterItem: any) { return filterItem.ItemType == Item.Item_x0020_Type && filterItem.PortfolioType == Item.Portfolio_x0020_Type }));
                    if (IconUrlItem != undefined && IconUrlItem.length > 0) {
                        IconUrl = IconUrlItem[0].ImageUrl;
                    }
                }
            }
        }
        return IconUrl;
    }
    var getpriority = function (item: any) {
        if (item.PriorityRank >= 0 && item.PriorityRank <= 3) {
            item.Item.Priority = '(3) Low';
        }
        if (item.PriorityRank >= 4 && item.PriorityRank <= 7) {
            item.Item.Priority = '(2) Normal';
        }
        if (item.PriorityRank >= 8) {
            item.Item.Priority = '(1) High';
        }
    }
    // var SelectPriority = function (Item:any) {
    //     switch (Item.Priority) {
    //         case '(3) Low':
    //             setselectedOption(PriorityRank = '1';
    //             break;
    //         case '(2) Normal':
    //             PriorityRank = '4';
    //             break;
    //         case '(1) High':
    //             $scope.PriorityRank = '8';
    //             break;
    //     }
    // }
    var getMasterTaskListTasks = function () {
        var query = "ComponentCategory/Id,ComponentCategory/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,SiteCompositionSettings,PortfolioStructureID,ItemRank,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,Deliverable_x002d_Synonyms,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title&$expand=ClientCategory,ComponentCategory,AssignedTo,Component,ComponentPortfolio,ServicePortfolio,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Id eq " + item.props.Id + "";
        $.ajax({
            url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items?$select=" + query + "",
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                var Tasks = data.d.results;
                $.each(Tasks, function (index: any, item: any) {
                    item.DateTaskDueDate = new Date(item.DueDate);
                    if (item.DueDate != null)
                        item.TaskDueDate = ConvertLocalTOServerDate(item.DueDate, 'DD/MM/YYYY');
                    item.FilteredModifiedDate = item.Modified;
                    item.DateModified = new Date(item.Modified);
                    item.DateCreatedNew = new Date(item.Created);

                    item.DateCreated = item.CreatedDate = ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
                    item.Creatednewdate = ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY HH:mm');
                    item.Modified = ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY HH:mm');
                    if (item.Priority_x0020_Rank == undefined && item.Priority != undefined) {
                        switch (item.Priority) {
                            case '(1) High':
                                item.Priority_x0020_Rank = 8;
                                break;
                            case '(2) Normal':
                                item.Priority_x0020_Rank = 4;
                                break;
                            case '(3) Low':
                                item.Priority_x0020_Rank = 1;
                                break;


                        }
                    }
                    item.assigned = getMultiUserValues(item);
                    if (item.ItemRank != undefined)
                        item.ItemRankTitle = TaskItemRank[0].filter((option: { rank: any; }) => option.rank == item.ItemRank)[0].rankTitle;
                    item.PercentComplete = item.PercentComplete <= 1 ? item.PercentComplete * 100 : item.PercentComplete;
                    if (item.PercentComplete != undefined) {
                        item.PercentComplete = parseInt((item.PercentComplete).toFixed(0));
                    }
                    item.smartComponent = [];
                    if (item.ComponentPortfolio != undefined) {
                        if (item.ComponentPortfolio.Id != undefined) {
                            if (item.smartComponent != undefined)
                                item.smartComponent.push({ 'Title': item.ComponentPortfolio.Title, 'Id': item.ComponentPortfolio.Id });

                        }
                    }
                    item.siteType = 'Master Tasks';
                    item.taskLeader = 'None';
                    if (item.AssignedTo != undefined && item.AssignedTo.results != undefined && item.AssignedTo.results.length > 0)
                        item.taskLeader = getMultiUserValues(item);
                    if (item.Task_x0020_Type == undefined)
                        item.Task_x0020_Type = 'Activity Tasks';
                    item.SmartCountries = [];
                    item.siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
                    item['SiteIcon'] = item.siteType == "Master Tasks" ? GetIconImageUrl(item.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined) : GetIconImageUrl(item.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
                });
                //  deferred.resolve(Tasks);
                setComponent(Tasks);
                setModalIsOpenToTrue(true)

                //  setModalIsOpenToTrue();
            },

            error: function (error) {


            }
        });
    }



    var ListId: any = '';
    var CurrentSiteUrl: any = '';
    //var SharewebItemRank: any = '';
    const [state, setState] = React.useState("state");

    const loadDataOnlyOnce = React.useCallback(() => {
        console.log(`I need ${state}!!`);
    }, [state]);

    var Item: any = '';
    const TaskItemRank: any = [];
    React.useEffect(() => {
        var initLoading = function () {
            if (item.props != undefined && item.props.siteType != undefined) {
                var Item = item.props;
                if (Item.siteType == 'HTTPS:') {
                    Item.siteType = 'HHHH';
                }
                getMasterTaskListTasks();
                ListId = 'ec34b38f-0669-480a-910c-f84e92e58adf';
                CurrentSiteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/';
                TaskItemRank.push([{ rankTitle: 'Select Item Rank', rank: 67677 }, { rankTitle: '(8) Top Highlights', rank: 8 }, { rankTitle: '(7) Featured Item', rank: 7 }, { rankTitle: '(6) Key Item', rank: 6 }, { rankTitle: '(5) Relevant Item', rank: 5 }, { rankTitle: '(4) Background Item', rank: 4 }, { rankTitle: '(2) to be verified', rank: 2 }, { rankTitle: '(1) Archive', rank: 1 }, { rankTitle: '(0) No Show', rank: 0 }]);
                setSharewebItemRank(TaskItemRank[0]);
                if (useeffectdata == false)
                    setuseeffectdata(true);
                else setuseeffectdata(false);
                //loadColumnDetails();
            }
        }
        initLoading();

    },
        []);
    const EditComponent = (item: any, title: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const GetComponents = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            .getByTitle('Master Tasks')
            .items
            //.getById(this.state.itemID)
            .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo")
            .top(4999)
            .filter("Item_x0020_Type eq Component")
            .get()

        console.log(componentDetails);
    }
    function EditComponentCallback() {

        item.Call();

    }
    let mentionUsers: any = [];
    //  mentionUsers = this.taskUsers.map((i:any)=>{      
    //     return({id : i.Title,display: i.Title})
    // });

    // var generateHierarchichalData = function (item, items) {
    //     var autoCompleteItem = {};
    //     autoCompleteItem['value'] = item.Title;
    //     autoCompleteItem['Id'] = item.Id;
    //     autoCompleteItem['description'] = item.Description1;
    //     autoCompleteItem['TaxType'] = item.TaxType;
    //     if (item.SiteType != undefined)
    //         autoCompleteItem['SiteType'] = item.SiteType
    //     autoCompleteItem['label'] = item.Title;
    //     angular.forEach(items, function (parentItem) {
    //         if (item.ParentID == parentItem.Id) {
    //             autoCompleteItem['label'] = parentItem.Title + ' > ' + item.Title;
    //             if (parentItem.ParentID > 0) {
    //                 angular.forEach(items, function (gParentItem) {
    //                     if (parentItem.ParentID == gParentItem.Id) {
    //                         autoCompleteItem['label'] = gParentItem.Title + ' > ' + autoCompleteItem.label;



    //                         if (gParentItem.ParentID > 0) {
    //                             angular.forEach(items, function (mParentItem) {
    //                                 if (gParentItem.ParentID == mParentItem.Id) {
    //                                     autoCompleteItem['label'] = mParentItem.Title + ' > ' + autoCompleteItem.label;

    //                                     return false;

    //                                 }
    //                             });
    //                         }
    //                     }
    //                 });
    //             }


    //             return false;
    //         }
    //     });

    //     return autoCompleteItem;
    // }
    // const bindAutoCompleteId = function (countrolId:any, taxItems:any, taxType:any, service:any, CompositionSiteType:any) {
    //     var Items:any = [];
    //     $.each(taxItems, function (taxItem:any) {
    //         if (taxItem.TaxType == taxType && taxItem.TaxType != 'Components') {
    //             var item = SharewebCommonFactoryService.generateHierarchichalData(taxItem, taxItems);
    //             item["Title"] = item.value;
    //             Items.push(item);
    //         }
    //         if (taxItem.TaxType == 'Components') {
    //             var item = SharewebCommonFactoryService.generateHierarchichalData(taxItem, taxItems);
    //             item["Title"] = item.value;
    //             Items.push(item);
    //         }
    //     });
    //     $("#" + countrolId).autocomplete({
    //         source: function (request, response) {
    //             // delegate back to autocomplete, but extract the last term
    //             //var index= request.term.indexOf("@");
    //             // if (request.term != undefined && request.term[index] == '@') 
    //             //     request.term = request.term.substr(index + 1, request.term.length);
    //             //response($.ui.autocomplete.filter(Items, $scope.extractLast(request.term)));
    //             var responseItems = $.ui.autocomplete.filter(Items, $scope.extractLast(request.term));
    //             SharewebCommonFactoryService.DynamicSortitems(responseItems, 'label', 'Text', 'Ascending')
    //             response(responseItems);

    //         },
    //         focus: function () {
    //             // prevent value inserted on focus
    //             return false;
    //         },
    //         select: function (event, ui) {
    //             var terms = $scope.split(this.value);
    //             // remove the current input
    //             terms.pop();
    //             // add the selected item
    //             terms.push(ui.item.value);
    //             // add placeholder to get the comma-and-space at the end
    //             terms.push("");
    //             this.value = terms.join("; ");
    //             if (ui.item.TaxType != undefined && service == 'Service') {
    //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.ServicesmartComponent, ui.item.Id)) {
    //                     ui.item['siteType'] = 'Master Tasks';
    //                     $scope.ServicesmartComponent[0] = ui.item;
    //                     $scope.SmartCompCopy[0] = ui.item;
    //                     $scope.$apply();
    //                 }
    //                 $('#txtServiceSharewebComponent').val('');
    //                 $('#txtServiceSharewebComponentselsction').val('');
    //             } else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Components') {
    //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartComponent, ui.item.Id)) {
    //                     ui.item['siteType'] = 'Master Tasks';
    //                     $scope.smartComponent[0] = ui.item;
    //                     $scope.SmartCompCopy[0] = ui.item;
    //                     $scope.$apply();
    //                     $scope.Item.Portfolio_x0020_Type == 'Component'
    //                 }
    //                 $('#txtSharewebComponent').val('');
    //                 $('#txtSharewebComponentselsction').val('');
    //             } else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Categories') {
    //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartCategories, ui.item.Id)) {
    //                     $scope.smartCategories.push(ui.item);
    //                     $scope.$apply();
    //                 }
    //                 $('#txtCategories').val('');
    //             } else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Sites') {
    //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.TargetedSites, ui.item.Id)) {
    //                     $scope.TargetedSites.push(ui.item);
    //                     $scope.$apply();
    //                 }
    //                 $('#txtSites').val('');
    //             }
    //             else if (ui.item.TaxType != undefined && ui.item.TaxType == 'SPComponents') {
    //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartSPComponents, ui.item.Id)) {
    //                     $scope.smartSPComponents.push(ui.item);
    //                     $scope.$apply();
    //                 }
    //                 $('#txtSPComponents').val('');
    //                 $('#txtSPComponentsselsction').val('');
    //             }
    //             else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Client Category') {
    //                 $scope.IsUpdateClientCategory = true;
    //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartClientCategories, ui.item.Id)) {
    //                     if ($scope.smartClientCategories != undefined && $scope.smartClientCategories.length > 0) {
    //                         angular.forEach($scope.smartClientCategories, function (clientcategory, index) {
    //                             $scope.IsPushed = true;
    //                             if (clientcategory.SiteType == ui.item.SiteType && !$scope.isItemExists($scope.smartClientCategories, ui.item.Id)) {
    //                                 $scope.smartClientCategories.push(ui.item);
    //                                 $scope.IsPushed = false
    //                             }
    //                         })
    //                         if ($scope.IsPushed == true && !$scope.isItemExists($scope.smartClientCategories, ui.item.Id))
    //                             $scope.smartClientCategories.push(ui.item);
    //                     }
    //                     else {
    //                         if (!$scope.isItemExists($scope.smartClientCategories, ui.item.Id))
    //                             $scope.smartClientCategories.push(ui.item);
    //                     }
    //                 }
    //                 angular.forEach($scope.smartClientCategories, function (item) {
    //                     if (item.SiteType == 'EI' && !$scope.isItemExists($scope.EIClientCategory, item.Id)) {
    //                         $scope.EIClientCategory.push(item);
    //                     }

    //                     else if (item.SiteType == 'EPS' && !$scope.isItemExists($scope.EPSClientCategory, item.Id)) {
    //                         $scope.EPSClientCategory.push(item);
    //                     }
    //                     else if (item.SiteType == 'Education' && !$scope.isItemExists($scope.EducationClientCategory, item.Id)) {
    //                         $scope.EducationClientCategory.push(item);
    //                     }

    //                 })
    //                 $scope.$apply();
    //                 $scope.CurrentCCSiteType = CompositionSiteType;
    //                 $('#UpdateCCItem').show();
    //                 $('#txtclientCategories').val('');
    //                 $('#EItxtclientCategories').val('');
    //                 $('#EPStxtclientCategories').val('');
    //                 $('#EducationtxtclientCategories').val('');
    //                 $('#txtclientCategories1').val('');
    //             }
    //             return false;
    //         }
    //     });
    // }
    const setPriority = function (item:any, val: number) {
        item.Priority_x0020_Rank =val;
     
     setComponent(CompoenetItem => ([...item]));
    }

    return (
        <>
            {/* <img title="Edit Details" className="wid22" onClick={(e) => setModalIsOpenToTrue(e)}
                src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" /> */}
            <Modal
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false}
            // {width:"1250px"}
            >
                {CompoenetItem != undefined && CompoenetItem.map(item =>
                    <div id="EditGrueneContactSearch">

                        <div className="modal-dialog modal-lg modal-fixed ">

                            <div className="modal-content">

                                <div className="modal-header">



                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Service-Portfolio<span > {">"} </span>
                                        {item.Title}
                                        <span className="text-end">
                                        </span>
                                    </h5>

                                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={setModalIsOpenToFalse} aria-label="Close"></button>

                                </div>
                                <div className="modal-body">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">BASIC INFORMATION</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Architecture & Technologies</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Help</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content border border-top-0" id="myTabContent">
                                        <div className="tab-pane  show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                            <div className="row  p-2">
                                                <div>
                                                    <div className="col-sm-5 mt-10">
                                                        <div className="row form-group">
                                                            <div className="col-sm-6">
                                                                <label className="full_width">Title</label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.Title != undefined ? item.Title : ""} />
                                                            </div>
                                                            <div className="col-sm-6 padL-0" title="Email">
                                                                <label className="full_width">Item Rank</label>
                                                                <select className="full_width searchbox_height" value={item.ItemRankTitle}>
                                                                    {
                                                                        SharewebItemRank &&
                                                                        SharewebItemRank.map((h: any, i: any): JSX.Element => {
                                                                            return (
                                                                                (
                                                                                    <option key={i} defaultValue={item.ItemRankTitle == h.rankTitle ? item.ItemRankTitle : h.rankTitle} >{item.ItemRankTitle == h.rankTitle ? item.ItemRankTitle : h.rankTitle}</option>)
                                                                            )
                                                                        }
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="row form-group">
                                                            <div className="col-sm-6">
                                                                <div className="col-sm-11 padL-0 PadR0">
                                                                    <label className="full_width">
                                                                        Component Portfolio
                                                                    </label>
                                                                    <input style={{ width: "100%" }} type="text"
                                                                        className="full_width searchbox_height" id="txtSmartCountries" defaultValue={item.Priority_x0020_Rank != undefined ? item.Priority_x0020_Rank : ""} />


                                                                </div>
                                                                <div className="col-sm-1 PadR0">
                                                                    <label className="full_width">&nbsp;</label>
                                                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                        onClick={(e) => EditComponent(item, 'Componet')} />
                                                                </div>
                                                                <div className="col-sm-11 padL-0 PadR0 inner-tabb">
                                                                    <div className="row">
                                                                        <div className="col-sm-12 PadR0">
                                                                            {item != undefined && item.smartComponent != undefined && item.smartComponent.map((childinew: any) =>
                                                                                < div className="block bgsiteColor"
                                                                                    ng-mouseover="HoverIn(item);"
                                                                                    ng-mouseleave="ComponentTitle.STRING='';"
                                                                                    title="{{ ComponentTitle.STRING }}"
                                                                                >
                                                                                    <a className="hreflink" target="_blank"
                                                                                        ng-href="{{pageContext}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}&amp;Site={{item.siteType}}">{childinew.Title}</a>
                                                                                    <a className="hreflink"
                                                                                        ng-click="removeSmartComponent(item.Id)">
                                                                                        <img ng-src="/_layouts/images/delete.gif"></img>
                                                                                    </a>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="col-sm-6 padL-0">
                                                                <label className="full_width">Deliverable-Synonyms</label>

                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.WorkAddress != undefined ? item.WorkAddress : ""} />
                                                            </div>
                                                        </div>
                                                        <div className="row form-group">
                                                            <div className="col-sm-4">
                                                                <label className="full_width">Start Date</label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.CellPhone != null ? item.CellPhone : ""}
                                                                />
                                                            </div>
                                                            <div className="col-sm-4 padL-0">
                                                                <label className="full_width">Due Date</label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.HomePhone != null ? item.HomePhone : ""} />
                                                            </div>

                                                            <div className="col-sm-4 padL-0">
                                                                <label className="full_width">
                                                                    Completion Date <a className="hreflink" href={item.LinkedIn != null ? item.LinkedIn.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-linkedin"></i></span></a></label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.LinkedIn != null ? item.LinkedIn.Description : ""} />
                                                            </div>
                                                        </div>
                                                        <div className="row form-group">
                                                            <div className="col-sm-4">
                                                                <label className="full_width">Synonyms <a className="hreflink" href={item.Instagram != null ? item.Instagram.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-instagram"></i></span></a></label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.Instagram != null ? item.Instagram.Description : ""} />
                                                            </div>

                                                            <div className="col-sm-4 padL-0">
                                                                <label className="full_width">Client Activity <a className="hreflink" href={item.Twitter != null ? item.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.Twitter != null ? item.Twitter.Description : ""} />
                                                            </div>

                                                            <div className="col-sm-4 padL-0">
                                                                <label className="full_width">Package <a className="hreflink" href={item.Twitter != null ? item.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.Twitter != null ? item.Twitter.Description : ""} />
                                                            </div>
                                                        </div>
                                                        <div className="row form-group">
                                                            <div className="col-sm-6">
                                                                <label className="full_width">Status</label>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            ng-checked="Item.AdminStatus=='Not Started'"
                                                                            name="Not Started" type="radio" value="Not Started"
                                                                            defaultChecked={item.Status === "Not Started"} ng-click="Adminstatus('Not Started')"
                                                                        ></input> Not Started
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            name="In Preparation" type="radio"
                                                                            value="In Preparation"
                                                                            ng-click="Adminstatus('In Preparation')"
                                                                            defaultChecked={item.Status === "In Preparation"}></input> In Preparation
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            name="In Development" type="radio"
                                                                            value="In Development"
                                                                            ng-click="Adminstatus('In Development')"
                                                                            defaultChecked={item.Status === "In Development"}></input> In Development
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input" name="Active"
                                                                            type="radio" value="Active"
                                                                            ng-click="Adminstatus( 'Active')"
                                                                            defaultChecked={item.Status === "Active"}></input> Active
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            name="Archived" type="radio" value="Archived"
                                                                            ng-click="Adminstatus('Archived')"
                                                                            defaultChecked={item.Status === "Archived"}></input> Archived
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 padL-0">
                                                                <label className="full_width">Time <a className="hreflink" href={item.Twitter != null ? item.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                <input type="text" className="full_width searchbox_height"
                                                                    defaultValue={item.Twitter != null ? item.Twitter.Description : ""} />
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" defaultChecked={item.Mileage === "05"}
                                                                            type="radio" ng-click="SelectTime('05')"></input>Very Quick
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" defaultChecked={item.Mileage === "15"}
                                                                            type="radio" ng-click="SelectTime('15')"></input>Quick
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" defaultChecked={item.Mileage === "60"}
                                                                            type="radio" ng-click="SelectTime('60')"></input>Medium
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" defaultChecked={item.Mileage === "240"}
                                                                            type="radio" ng-click="SelectTime('240')"></input>Long
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 mt-10">
                                                        <div className="col-sm-12 padL-0" title="Priority">
                                                            <label className="full_width">Priority</label>
                                                            <input type="text" className="full_width searchbox_height"
                                                                defaultValue={item.Priority_x0020_Rank != undefined ? item.Priority_x0020_Rank : ""} />
                                                            <div className="radio">
                                                                <label>
                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(1) High" onChange={(e) => setPriority(item,8)}
                                                                        defaultChecked={item.Priority === "(1) High"}></input>High
                                                                </label>
                                                            </div>
                                                            <div className="radio">
                                                                <label>
                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(2) Normal" onChange={(e) => setPriority(item,4)}
                                                                        defaultChecked={item.Priority === "(2) Normal"}></input>Normal
                                                                </label>
                                                            </div>
                                                            <div className="radio">
                                                                <label>
                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(3) Low" onChange={(e) => setPriority(item,1)}
                                                                        defaultChecked={item.Priority === "(3) Low"}></input>Low
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 padL-0">
                                                            <label className="full_width">Categories <a className="hreflink" href={item.Facebook != null ? item.Facebook.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-facebook"></i></span></a></label>
                                                            <input type="text" className="full_width searchbox_height"
                                                                defaultValue={item.Facebook != null ? item.Facebook.Description : ""} />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4 padL-0 mt-10">
                                                        <CommentCard siteUrl={item.siteUrl} userDisplayName={item.userDisplayName} listName={item.siteType} itemID={item.Id}></CommentCard>


                                                    </div>
                                                    <div className="col-sm-8 mb-10">
                                                        <label className="full_width">Url</label>
                                                        <input type="text" className="full_width searchbox_height" placeholder="Url" ng-model="Item.component_x0020_link.Url"></input>

                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                        <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">

                                            <div className="row  p-2">
                                                <div className="container">
                                                    <dl className='Sitecomposition'>
                                                        <div className="dropdown">

                                                            <a className="btn btn-secondary p-0" title="Tap to expand the childs" onClick={() => (setCollapseExpend(CollapseExpend => !CollapseExpend))} >

                                                                <span className="sign">{CollapseExpend ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>  Technical Concept

                                                            </a>

                                                            {CollapseExpend &&
                                                                <div className='spxdropdown-menu'>
                                                                    <span className="pull-right">
                                                                        <input type="checkbox"
                                                                            ng-click="chTechnicalExplanationsVerified(TechnicalExplanationsVerified)"
                                                                            defaultValue={item.TechnicalExplanationsVerified} />
                                                                        <span>Verified</span>
                                                                    </span>

                                                                    <Editor
                                                                        toolbarClassName="toolbarClassName"
                                                                        wrapperClassName="wrapperClassName"
                                                                        editorClassName="editorClassName"
                                                                        wrapperStyle={{ width: '100%', border: "2px solid black", height: '60%' }}
                                                                    />

                                                                </div>
                                                            }
                                                        </div>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="contact" role="tabpanel" aria-labelledby="contact-tab">

                                            <div className="row  p-2">
                                                <div className="col-sm-12 mb-10">
                                                    <div className="col-sm-12 pull-left HedaBackclr">
                                                        <div ng-if="!HelpInformationExpandad" className="col-sm-11 padL-0 hreflink"
                                                            ng-click="forExpand('HelpInformation')">
                                                            <img
                                                                ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/right-list-iconwhite.png"></img>
                                                            <span className="txtSizeClr">
                                                                <label ng-bind-html="GetColumnDetails('HelpInformation') | trustedHTML"></label>
                                                            </span>
                                                        </div>
                                                        <div ng-if="HelpInformationExpandad" className="col-sm-11 padL-0 hreflink"
                                                            ng-click="forCollapse('HelpInformation')">
                                                            <img
                                                                ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/list-iconwhite.png"></img>
                                                            <span className="txtSizeClr">
                                                                <label ng-bind-html="GetColumnDetails('HelpInformation') | trustedHTML"></label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 mb-10  BdrBoxBlue" ng-show="HelpInformationExpandad">
                                                        <div className="col-sm-12 pad0">
                                                            <div className="form-group">
                                                                <label></label>
                                                                <span className="pull-right">
                                                                    <input type="checkbox"
                                                                        ng-click="chHelpInformationVerified(Item.HelpInformationVerified)"
                                                                        ng-model="Item.HelpInformationVerified" />
                                                                    <span>Verified</span>
                                                                </span>
                                                                <div id="HelpInformation"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="col-md-12">
                                                        <div className="col-sm-12  mt-10 pad0">
                                                            <label className="">
                                                                Questions
                                                                Description
                                                            </label><a className="hreflink pull-right"
                                                                ng-click="AskQuestion('Question')">Add Questions</a>
                                                        </div>
                                                        <div className="col-sm-12 pad0 section-event pt-0">
                                                            <table className="mb-10" width="100%" cellSpacing="0">

                                                                <div className="accordin-header ng-scope"
                                                                    ng-repeat="item in AllComponentRelated">
                                                                    <input className="toggle-box-content" id="identifier-{{item.Id}}"
                                                                        type="checkbox"></input>
                                                                    <label htmlFor="identifier-{{item.Id}}" className="ng-binding">
                                                                        <span>{item.Title}</span>
                                                                        <span className="pull-right">
                                                                            <a className="hreflink" ng-click="UpdateQuestion(item)">
                                                                                <img ng-src="/_layouts/images/edititem.gif"></img>
                                                                            </a> <a className="hreflink"
                                                                                ng-click="DeleteQuestion(item)">
                                                                                <img src="/_layouts/images/delete.gif" />
                                                                            </a>
                                                                        </span>
                                                                    </label>
                                                                    <div ng-show="item.QuestionStatus=='Approved'"
                                                                        className="ng-binding">
                                                                        <div className="accordin-content"
                                                                            ng-bind-html="item.Body | trustedHTML">
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </table>
                                                            <div ng-show="AllComponentRelated.length==0"
                                                                className="text-center panel-heading">
                                                                No Questions Description available
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">

                                                        <div className="col-sm-12 mb-5 mt-10 pad0">
                                                            <label className="">
                                                                Help
                                                                Description
                                                            </label> <a className="pull-right hreflink"
                                                                ng-click="AskQuestion('Help')">Add Help</a>
                                                        </div>
                                                        <div className="col-sm-12 pad0 section-event pt-0">
                                                            <table width="100%" cellSpacing="0" className="mb-10">
                                                                <div className="accordin-header ng-scope"
                                                                    ng-repeat="item in AllComponentRelatedHelp">
                                                                    <input className="toggle-box-content" id="identifier-{{item.Id}}"
                                                                        type="checkbox"></input>
                                                                    <label htmlFor="identifier-{{item.Id}}" className="ng-binding">
                                                                        <span>{item.Title}</span>
                                                                        <span className="pull-right">
                                                                            <a className="hreflink" ng-click="UpdateHelp(item)">
                                                                                <img ng-src="/_layouts/images/edititem.gif"></img>
                                                                            </a>
                                                                            <div className="col-sm-12 mb-10">
                                                                                <div className="col-sm-12 pull-left HedaBackclr">
                                                                                    <div ng-if="!HelpInformationExpandad" className="col-sm-11 padL-0 hreflink"
                                                                                        ng-click="forExpand('HelpInformation')">
                                                                                        <img
                                                                                            ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/right-list-iconwhite.png"></img>
                                                                                        <span className="txtSizeClr">
                                                                                            <label ng-bind-html="GetColumnDetails('HelpInformation') | trustedHTML"></label>
                                                                                        </span>
                                                                                    </div>
                                                                                    <div ng-if="HelpInformationExpandad" className="col-sm-11 padL-0 hreflink"
                                                                                        ng-click="forCollapse('HelpInformation')">
                                                                                        <img
                                                                                            ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/list-iconwhite.png"></img>
                                                                                        <span className="txtSizeClr">
                                                                                            <label ng-bind-html="GetColumnDetails('HelpInformation') | trustedHTML"></label>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-12 mb-10  BdrBoxBlue" ng-show="HelpInformationExpandad">
                                                                                    <div className="col-sm-12 pad0">
                                                                                        <div className="form-group">
                                                                                            <label></label>
                                                                                            <span className="pull-right">
                                                                                                <input type="checkbox"
                                                                                                    ng-click="chHelpInformationVerified(Item.HelpInformationVerified)"
                                                                                                    ng-model="Item.HelpInformationVerified" />
                                                                                                <span>Verified</span>
                                                                                            </span>
                                                                                            <div id="HelpInformation"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="">
                                                                                <div className="col-md-12">
                                                                                    <div className="col-sm-12  mt-10 pad0">
                                                                                        <label className="">
                                                                                            Questions
                                                                                            Description
                                                                                        </label><a className="hreflink pull-right"
                                                                                            ng-click="AskQuestion('Question')">Add Questions</a>
                                                                                    </div>
                                                                                    <div className="col-sm-12 pad0 section-event pt-0">
                                                                                        <table className="mb-10" width="100%" cellSpacing="0">

                                                                                            <div className="accordin-header ng-scope"
                                                                                                ng-repeat="item in AllComponentRelated">
                                                                                                <input className="toggle-box-content" id="identifier-{{item.Id}}"
                                                                                                    type="checkbox"></input>
                                                                                                <label htmlFor="identifier-{{item.Id}}" className="ng-binding">
                                                                                                    <span>{item.Title}</span>
                                                                                                    <span className="pull-right">
                                                                                                        <a className="hreflink" ng-click="UpdateQuestion(item)">
                                                                                                            <img ng-src="/_layouts/images/edititem.gif"></img>
                                                                                                        </a> <a className="hreflink"
                                                                                                            ng-click="DeleteQuestion(item)">
                                                                                                            <img src="/_layouts/images/delete.gif" />
                                                                                                        </a>
                                                                                                    </span>
                                                                                                </label>
                                                                                                <div ng-show="item.QuestionStatus=='Approved'"
                                                                                                    className="ng-binding">
                                                                                                    <div className="accordin-content"
                                                                                                        ng-bind-html="item.Body | trustedHTML">
                                                                                                    </div>

                                                                                                </div>

                                                                                            </div>
                                                                                        </table>
                                                                                        <div ng-show="AllComponentRelated.length==0"
                                                                                            className="text-center panel-heading">
                                                                                            No Questions Description available
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                                <div className="col-md-12">

                                                                                    <div className="col-sm-12 mb-5 mt-10 pad0">
                                                                                        <label className="">
                                                                                            Help
                                                                                            Description
                                                                                        </label> <a className="pull-right hreflink"
                                                                                            ng-click="AskQuestion('Help')">Add Help</a>
                                                                                    </div>
                                                                                    <div className="col-sm-12 pad0 section-event pt-0">
                                                                                        <table width="100%" cellSpacing="0" className="mb-10">
                                                                                            <div className="accordin-header ng-scope"
                                                                                                ng-repeat="item in AllComponentRelatedHelp">
                                                                                                <input className="toggle-box-content" id="identifier-{{item.Id}}"
                                                                                                    type="checkbox"></input>
                                                                                                <label htmlFor="identifier-{{item.Id}}" className="ng-binding">
                                                                                                    <span>{item.Title}</span>
                                                                                                    <span className="pull-right">
                                                                                                        <a className="hreflink" ng-click="UpdateHelp(item)">
                                                                                                            <img ng-src="/_layouts/images/edititem.gif"></img>
                                                                                                        </a> <a className="hreflink" ng-click="DeleteHelp(item)">
                                                                                                            <img src="/_layouts/images/delete.gif" />
                                                                                                        </a>
                                                                                                    </span>
                                                                                                </label>
                                                                                                <div className="ng-binding">
                                                                                                    <div className="accordin-content"
                                                                                                        ng-bind-html="item.Body | trustedHTML">
                                                                                                    </div>

                                                                                                </div>

                                                                                            </div>

                                                                                        </table>
                                                                                        <div ng-show="AllComponentRelatedHelp.length==0"
                                                                                            className="text-center panel-heading">
                                                                                            No Help Description available
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <img src="/_layouts/images/delete.gif" />

                                                                        </span>
                                                                    </label>
                                                                    <div className="ng-binding">
                                                                        <div className="accordin-content"
                                                                            ng-bind-html="item.Body | trustedHTML">
                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </table>
                                                            <div ng-show="AllComponentRelatedHelp.length==0"
                                                                className="text-center panel-heading">
                                                                No Help Description available
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* <div className="modal-footer">

      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

      <button type="button" className="btn btn-primary">Save changes</button>

    </div> */}

                                <div className="modal-footer">
                                    <div className="col-sm-12">
                                        <div className="row">
                                            <div className="ItemInfo col-sm-6">
                                                <div className="text-left">
                                                    Created <span ng-bind="Item.Created | date:'dd/MM/yyyy'">{item.Created != null ? moment(item.Created).format('DD/MM/YYYY') : ""}</span> by
                                                    <span className="footerUsercolor">
                                                        {/* {{Item.Author.Title}} */}
                                                        {item.Author.Title != undefined ? item.Author.Title : ""}
                                                    </span>
                                                </div>
                                                <div className="text-left">
                                                    Last modified <span ng-bind="Item.Modified | date:'dd/MM/yyyy hh:mm'">{item.Modified != null ? moment(item.Modified).format('DD/MM/YYYY') : ""}</span> by <span className="footerUsercolor">
                                                        {/* {{Item.Editor.Title}} */}
                                                        {item.Editor.Title != undefined ? item.Editor.Title : ""}
                                                    </span>
                                                </div>
                                                <div className="text-left">
                                                    <a className="hreflink" ng-click="removeItem(institution.Id)">
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/images/delete.gif" /> Delete this item
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 PadR0 ItemInfo-right">
                                                <div className="pull-right">
                                                    <span>
                                                        <a className="ForAll hreflink" target="_blank"
                                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${item.Id}&name=${item.Title}`}>
                                                            <img className="mb-3 icon_siz19" style={{ marginRight: "3px" }}
                                                                ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/15/images/ichtm.gif?rev=23" />Go to Profile page
                                                        </a>
                                                    </span>
                                                    <span className="ml5">|</span>
                                                    <a className="ml5" ng-href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/Master%20Tasks/EditForm.aspx?ID=${item.Id}`}
                                                        target="_blank">Open out-of-the-box form</a>
                                                    <button type="button" className="btn btn-primary ml5" ng-click="SaveItem()">Save</button>
                                                    <button type="button" className="btn btn-default" onClick={setModalIsOpenToFalse}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {IsComponent && <ComponentPortPolioPopup props={SharewebComponent} Call={Call}></ComponentPortPolioPopup>}

                    </div>
                )}
            </Modal>
        </>
    )
} export default React.memo(EditInstitution);
