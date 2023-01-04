import * as React from "react";
// import ImagesC from "./Images";
import { arraysEqual, Modal } from 'office-ui-fabric-react';

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
import { map } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Picker from "../../globalComponents/EditTaskPopup/SmartMetaDataPicker";



function EditInstitution(item: any) {
    // Id:any

    const [CompoenetItem, setComponent] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [useeffectdata, setuseeffectdata] = React.useState(false);
    const [selectedOption, setselectedOption] = React.useState('');
    const [SharewebItemRank, setSharewebItemRank] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [SharewebCategory, setSharewebCategory] = React.useState('');
    const [AllComponents, setComponentsData] = React.useState([]);
    const [CollapseExpend, setCollapseExpend] = React.useState(false);
    const [date, setDate] = React.useState(undefined);
    const [Startdate, setStartdate] = React.useState(undefined);
    const [Completiondate, setCompletiondate] = React.useState(undefined);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    // $('.ms-Dialog-main .main-153').hide();
    const setModalIsOpenToTrue = (e: any) => {
        // e.preventDefault()
        setModalIsOpen(true)
    }
    const setModalIsOpenToFalse = () => {

        EditComponentCallback();
        setModalIsOpen(false)
    }
    const handleDate = (date: any) => {
        CompoenetItem[0].CompletedDate = date;
        setCompletiondate(date);
        setComponent(CompoenetItem => ([...CompoenetItem]));
    };
    const handleDatestart = (date: any) => {
        CompoenetItem[0].StartDate = date;
        setStartdate(date);
        setComponent(CompoenetItem => ([...CompoenetItem]));
    };
    const handleDatedue = (date: any) => {
        CompoenetItem[0].DueDate = date;
        setDate(date);
        setComponent(CompoenetItem => ([...CompoenetItem]));
    };
    const Call = React.useCallback((item1) => {
        if (CompoenetItem != undefined && item1 != undefined) {
            item.props.smartComponent = item1.smartComponent;
            // setComponent([ item.props]);
        }
        if (item1 != undefined && item1.Categories != "") {
            var title: any = {};
            title.Title = item1.categories;
            item.props.smartCategories.push(title);

        }
        setIsComponentPicker(false);
        setIsComponent(false);
       // setComponent(CompoenetItem => ([...CompoenetItem]));
    }, []);
    // var ConvertLocalTOServerDate = function (LocalDateTime: any, dtformat: any) {
    //     if (dtformat == undefined || dtformat == '') dtformat = "DD/MM/YYYY";

    //     // below logic works fine in all condition 
    //     if (LocalDateTime != '') {
    //         var serverDateTime;
    //         var vLocalDateTime = new Date(LocalDateTime);
    //         //var offsetObj = GetServerOffset();
    //         //var IANATimeZoneName = GetIANATimeZoneName();
    //         var mDateTime = moment(LocalDateTime);
    //         // serverDateTime = mDateTime.tz('Europe/Berlin').format(dtformat); // 5am PDT
    //         //serverDateTime = mDateTime.tz('America/Los_Angeles').format(dtformat);  // 5am PDT
    //         return serverDateTime;
    //     }
    //     return '';
    // }
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
    const handleChange = (newValue: any) => {
        console.log("newValue: ", newValue);
        // setStartdate(newValue);
        //  props.setDate( newValue );
    };
    const getpriority = function (item: any) {
        if (item.PriorityRank >= 0 && item.PriorityRank <= 3) {
            item.Priority = '(3) Low';
        }
        if (item.PriorityRank >= 4 && item.PriorityRank <= 7) {
            item.Priority = '(2) Normal';
        }
        if (item.PriorityRank >= 8) {
            item.Priority = '(1) High';
        }
    }
    var getMasterTaskListTasks = async function () {
        //  var query = "ComponentCategory/Id,ComponentCategory/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,SiteCompositionSettings,PortfolioStructureID,ItemRank,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,Deliverable_x002d_Synonyms,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title";
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            // .getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            .getByTitle('Master Tasks')
            .items
            .select("ComponentCategory/Id", "ComponentCategory/Title", "ComponentPortfolio/Id", "ComponentPortfolio/Title", "ServicePortfolio/Id", "ServicePortfolio/Title", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "Deliverable_x002d_Synonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "Admin_x0020_Notes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebComponent/Id", "SharewebCategories/Id", "SharewebCategories/Title", "Priority_x0020_Rank", "Reference_x0020_Item_x0020_Json", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "Item_x002d_Image", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")

            .expand("ClientCategory", "ComponentCategory", "AssignedTo", "Component", "ComponentPortfolio", "ServicePortfolio", "AttachmentFiles", "Author", "Editor", "Team_x0020_Members", "SharewebComponent", "SharewebCategories", "Parent")
            .filter("Id eq " + item.props.Id + "")
            .get()
        console.log(componentDetails);
        // var query = "ComponentCategory/Id,ComponentCategory/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,SiteCompositionSettings,PortfolioStructureID,ItemRank,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,Deliverable_x002d_Synonyms,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title&$expand=ClientCategory,ComponentCategory,AssignedTo,Component,ComponentPortfolio,ServicePortfolio,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Id eq " + item.props.Id + "";
        // $.ajax({
        //     url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items?$select=" + query + "",
        //     method: "GET",
        //     headers: {
        //         "Accept": "application/json; odata=verbose"
        //     },
        //     success: function (data) {
        var Tasks = componentDetails;
        $.each(Tasks, function (index: any, item: any) {
            item.DateTaskDueDate = new Date(item.DueDate);
            if (item.DueDate != null)
                item.TaskDueDate = moment(item.DueDate).format('DD/MM/YYYY');
            // item.TaskDueDate = ConvertLocalTOServerDate(item.DueDate, 'DD/MM/YYYY');
            item.FilteredModifiedDate = item.Modified;
            item.DateModified = new Date(item.Modified);
            item.DateCreatedNew = new Date(item.Created);

            item.DateCreated = item.CreatedDate = moment(item.Created).format('DD/MM/YYYY');// ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
            item.Creatednewdate = moment(item.Created).format('DD/MM/YYYY');//ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY HH:mm');
            // item.Modified = moment(item.Modified).format('DD/MM/YYYY');
            //ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY HH:mm');
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
            getpriority(item)
            item.assigned = getMultiUserValues(item);
            if (item.ItemRank != undefined)
                item.ItemRankTitle = TaskItemRank[0].filter((option: { rank: any; }) => option.rank == item.ItemRank)[0].rankTitle;
            item.PercentComplete = item.PercentComplete <= 1 ? item.PercentComplete * 100 : item.PercentComplete;
            if (item.PercentComplete != undefined) {
                item.PercentComplete = parseInt((item.PercentComplete).toFixed(0));
            }
            item.smartComponent = [];
            item.smartCategories = [];
            if (item.ComponentPortfolio != undefined) {
                if (item.ComponentPortfolio.Id != undefined) {
                    if (item.smartComponent != undefined)
                        item.smartComponent.push({ 'Title': item.ComponentPortfolio.Title, 'Id': item.ComponentPortfolio.Id });

                }
            }
            if (item.SharewebCategories != undefined) {
                if (item.SharewebCategories.results != undefined) {
                    map(item.SharewebCategories.results, (bj) => {
                        if (bj.Title != undefined)
                            item.smartCategories.push({ 'Title': bj.Title, 'Id': bj.Id });

                    }
                    )
                }
            }
            item.siteType = 'Master Tasks';
            item.taskLeader = 'None';
            if (item.AssignedTo != undefined && item.AssignedTo.results != undefined && item.AssignedTo.results.length > 0)
                item.taskLeader = getMultiUserValues(item);
            if (item.Task_x0020_Type == undefined)
                item.Task_x0020_Type = 'Activity Tasks';
            if (item.DueDate != undefined) {
                item.DueDate = moment(item.DueDate).format('DD/MM/YYYY')
                // setDate(item.DueDate);
            }
            if (item.StartDate != undefined) {
                item.StartDate = moment(item.StartDate).format('DD/MM/YYYY')
                //setStartdate(item.StartDate);
            }
            if (item.CompletedDate != undefined) {
                item.CompletedDate = moment(item.CompletedDate).format('DD/MM/YYYY')
                // item.CompletedDate = item.CompletedDate.toString();
                // setCompletiondatenew(item.CompletedDate);
            }
            item.SmartCountries = [];
            item.siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
            item['SiteIcon'] = item.siteType == "Master Tasks" ? GetIconImageUrl(item.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined) : GetIconImageUrl(item.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
            if (item.Synonyms != undefined && item.Synonyms.length > 0) {
                item.Synonyms = JSON.parse(item.Synonyms);
            }
        });
        //  deferred.resolve(Tasks);
        setComponent(Tasks);
        setModalIsOpenToTrue(true)

        //  setModalIsOpenToTrue();
    };

    //     error: function (error) {


    //     }
    // });
    // }



    var ListId: any = '';
    var CurrentSiteUrl: any = '';
    //var SharewebItemRank: any = '';
    const [state, setState] = React.useState("state");

    const loadDataOnlyOnce = React.useCallback(() => {
        console.log(`I need ${state}!!`);
    }, [state]);

    var Item: any = '';
    const TaskItemRank: any = [];
    const GetSmartmetadata = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmetaDetails = [];
        smartmetaDetails = await web.lists
            //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            .getByTitle('SmartMetadata')
            .items
            //.getById(this.state.itemID)
            .select("ID", "Title")
            .top(4999)
            .filter("TaxType eq 'Categories'")
            .get()

        console.log(smartmetaDetails);
    }
    React.useEffect(() => {
        var initLoading = function () {
            if (item.props != undefined && item.props.siteType != undefined) {
                var Item = item.props;
                if (Item.siteType == 'HTTPS:') {
                    Item.siteType = 'HHHH';
                }
                GetSmartmetadata();
                getMasterTaskListTasks();
                ListId = 'ec34b38f-0669-480a-910c-f84e92e58adf';
                CurrentSiteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/';
                TaskItemRank.push([{ rankTitle: 'Select Item Rank', rank: null }, { rankTitle: '(8) Top Highlights', rank: 8 }, { rankTitle: '(7) Featured Item', rank: 7 }, { rankTitle: '(6) Key Item', rank: 6 }, { rankTitle: '(5) Relevant Item', rank: 5 }, { rankTitle: '(4) Background Item', rank: 4 }, { rankTitle: '(2) to be verified', rank: 2 }, { rankTitle: '(1) Archive', rank: 1 }, { rankTitle: '(0) No Show', rank: 0 }]);
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

    var generateHierarchichalData = function (item: any, items: any) {
        var autoCompleteItem: any = {};
        autoCompleteItem["value"] = item.Title;
        autoCompleteItem['Id'] = item.Id;
        autoCompleteItem['description'] = item.Description1;
        autoCompleteItem['TaxType'] = item.TaxType;
        if (item.SiteType != undefined)
            autoCompleteItem['SiteType'] = item.SiteType
        autoCompleteItem['label'] = item.Title;
        map(items, (parentItem) => {
            if (item.ParentID == parentItem.Id) {
                autoCompleteItem['label'] = parentItem.Title + ' > ' + item.Title;
                if (parentItem.ParentID > 0) {
                    map(items, (gParentItem) => {
                        if (parentItem.ParentID == gParentItem.Id) {
                            autoCompleteItem['label'] = gParentItem.Title + ' > ' + autoCompleteItem.label;
                            if (gParentItem.ParentID > 0) {
                                map(items, (mParentItem) => {
                                    if (gParentItem.ParentID == mParentItem.Id) {
                                        autoCompleteItem['label'] = mParentItem.Title + ' > ' + autoCompleteItem.label;

                                        return false;

                                    }
                                });
                            }
                        }
                    });
                }


                return false;
            }
        });

        return autoCompleteItem;
    }
    // const bindAutoCompleteId = function (countrolId:any, taxItems:any, taxType:any, service:any, CompositionSiteType:any) {
    //     var Items:any = [];
    //     $.each(taxItems, function (taxItem:any) {
    //         if (taxItem.TaxType == taxType && taxItem.TaxType != 'Components') {
    //             var item = generateHierarchichalData(taxItem, taxItems);
    //             item["Title"] = item.value;
    //             Items.push(item);
    //         }
    //         if (taxItem.TaxType == 'Components') {
    //             var item = generateHierarchichalData(taxItem, taxItems);
    //             item["Title"] = item.value;
    //             Items.push(item);
    //         }
    //     });
    //     $("#" + countrolId).autocomplete({
    //         source: function (request:any, response:any) {
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
    const setPriority = function (item: any, val: number) {
        item.Priority_x0020_Rank = val;

        setComponent(CompoenetItem => ([...CompoenetItem]));
    }
    const setTime = function (item: any, val: any) {
        item.Mileage = val;
        setComponent(CompoenetItem => ([...CompoenetItem]));
    }
    const setStatus = function (item: any, val: any) {
        item.AdminStatus = val;
        setComponent(CompoenetItem => ([...CompoenetItem]));
    }
    const expendcollapsAccordion = (item: any, title: any) => {
        item[title] = item[title] = item[title] == true ? false : true;
        setComponent(CompoenetItem => ([...CompoenetItem]));
    };
    const test12 = (e: any, item: any) => {
        item.SynonymsTitle = e.target.value;
        setComponent(CompoenetItem => ([...CompoenetItem]));
    };
    const createSynonyms = (item: any) => {
        if (item.SynonymsTitle == undefined || item.SynonymsTitle == '') {
            alert('You have not enter Synonym name.');
        } else {
            let flag = true;
            if (item['Synonyms'] != undefined && item['Synonyms'].length > 0) {
                if (item['Synonyms'][item['Synonyms'].length - 1]['Title'] == item.SynonymsTitle) {
                    flag = false;
                    alert('You have a blank synonym try to fill it first');
                } else if (item['Synonyms'][item['Synonyms'].length - 1]['status'] == false) {
                    flag = false;
                    alert('You have not saved your last item.');
                }
            } else
                item['Synonyms'] = [];
            flag ? item['Synonyms'].push({ 'status': true, 'Title': item.SynonymsTitle, 'Id': '' }) : null;
            item.SynonymsTitle = '';
        }
        setComponent(CompoenetItem => ([...CompoenetItem]));
    }
    const deleteItem = (item: any) => {
        if (item['Synonyms'] != undefined && item['Synonyms'].length > 0) {
            map(item['Synonyms'], (val, index) => {
                item['Synonyms'].splice(index, 1)
            })
        }
        setComponent(CompoenetItem => ([...CompoenetItem]));
    }
    const SaveData = async () => {
        var UploadImage: any = []

        var item: any = {}
        var smartComponentsIds: any[] = [];
        var Items = CompoenetItem[0];

        if (Items.smartComponent != undefined) {
            Items.smartComponent.map((com: any) => {
                // if (com.Title != undefined) {

                //     component = com.Title

                // }

                if (Items.smartComponent != undefined && Items.smartComponent.length >= 0) {

                    $.each(Items.smartComponent, function (index: any, smart: any) {

                        smartComponentsIds.push(smart.Id);

                    })
                }
            })
        }
        if (Items.ItemRankTitle != undefined && Items.ItemRankTitle != 'Select Item Rank')
            var ItemRank = SharewebItemRank.filter((option: { rankTitle: any; }) => option.rankTitle == Items.ItemRankTitle)[0].rank;
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        await web.lists.getById('ec34b38f-0669-480a-910c-f84e92e58adf').items.getById(Items.ID).update({

            Title: Items.Title,

            ItemRank: ItemRank,
            Priority_x0020_Rank: Items.Priority_x0020_Rank,
            ComponentId: { "results": smartComponentsIds },
            Deliverable_x002d_Synonyms: Items.Deliverable_x002d_Synonyms,
            StartDate: Startdate != undefined ? new Date(Startdate).toDateString() : Startdate,
            DueDate: date != undefined ? new Date(date).toDateString() : date,
            CompletedDate: Completiondate != undefined ? new Date(Startdate).toDateString() : Completiondate,
            Synonyms: JSON.stringify(Items['Synonyms']),
            Package: Items.Package,
            AdminStatus: Items.AdminStatus,
            Priority: Items.Priority,
            Mileage: Items.Mileage,
            ValueAdded: Items.ValueAdded,
            Idea: Items.Idea,
            Background: Items.Background,
            Admin_x0020_Notes: Items.Admin_x0020_Notes,
            // component_x0020_link: {
            //     '__metadata': { 'type': 'SP.FieldUrlValue' },
            //     'Description': Items.component_x0020_link != undefined ? Items.component_x0020_link.Url : null,
            //     'Url': Items.component_x0020_link != undefined ? Items.component_x0020_link.Url : null,
            // },
            // PercentComplete: saveData.PercentComplete == undefined ? EditData.PercentComplete : saveData.PercentComplete,



            // Categories: Items.Categories

            // BasicImageInfo: JSON.stringify(UploadImage)

        })
            .then((res: any) => {
                console.log(res);

                setModalIsOpenToFalse();




            })



    }
    const EditComponentPicker = (item: any, title: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponentPicker(true);
        setSharewebCategory(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }


    return (
        <>
            {/* <img title="Edit Details" className="wid22" onClick={(e) => setModalIsOpenToTrue(e)}
                src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" /> */}
            <Modal
                isOpen={modalIsOpen}
                // onDismiss={setModalIsOpenToFalse}
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
                                            <button className="nav-link" id="cncept-tab" data-bs-toggle="tab" data-bs-target="#concept" type="button" role="tab" aria-controls="concept" aria-selected="false">Concept</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Architecture & Technologies</button>
                                        </li>
                                        {/* <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Help</button>
                                        </li> */}
                                    </ul>
                                    <div className="tab-content border border-top-0 clearfix " id="myTabContent">
                                        <div className="tab-pane  show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                            <div className="col  p-2">
                                                <div>
                                                    <div className="col-sm-5 mt-10">
                                                        <div className="row mb-10">
                                                            <div className="col-sm-6 ps-0">
                                                                <label className="form-label">Title</label>
                                                                <input type="text" className="form-control"
                                                                    defaultValue={item.Title != undefined ? item.Title : ""} onChange={(e) => item.Title = e.target.value} />
                                                            </div>
                                                            <div className="col-sm-6 pe0" title="Email">
                                                                <label className="form-label">Item Rank</label>
                                                                <select className="form-control" defaultValue={item.ItemRankTitle} onChange={(e) => item.ItemRankTitle = e.target.value}>
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
                                                        <div className="row mb-10">
                                                            <div className="col-sm-6 ps-0">
                                                                <div className="col-sm-11 padL-0 PadR0">
                                                                    <label className="form-label">
                                                                        Component Portfolio
                                                                    </label>
                                                                    <input type="text"
                                                                        className="form-control" />
                                                                    {/* <AutoSuggest
                                                                        options={stateOptions}
                                                                        handleChange={setState}
                                                                        value={state}
                                                                        name="State"
                                                                    /> */}
                                                                    <span className="input-group-text">
                                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                            onClick={(e) => EditComponent(item, 'Componet')} />
                                                                    </span>
                                                                </div>

                                                                <div className="col-sm-11  inner-tabb">
                                                                    <div>

                                                                        {item != undefined && item.smartComponent != undefined && item.smartComponent.map((childinew: any) =>
                                                                            < div className="block bgsiteColor"

                                                                            >
                                                                                <a className="hreflink" target="_blank"
                                                                                    href="{{pageContext}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}&amp;Site={{item.siteType}}">{childinew.Title}</a>
                                                                                <a className="hreflink"
                                                                                >
                                                                                    <img src="/_layouts/images/delete.gif"></img>
                                                                                </a>
                                                                            </div>
                                                                        )}

                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="col-sm-6 padL-0">
                                                                <label className="form-label">Deliverable-Synonyms</label>

                                                                <input type="text" className="form-control"
                                                                    defaultValue={item.Deliverable_x002d_Synonyms != undefined ? item.Deliverable_x002d_Synonyms : ""} onChange={(e) => item.Deliverable_x002d_Synonyms = e.target.value} />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-10">
                                                            <div className="col-sm-4 ps-0">
                                                                <label className="form-label">Start Date</label>
                                                                {/* <input type="text" className="form-control"
                                                                    defaultValue={item.CellPhone != null ? item.CellPhone : ""}
                                                                /> */}
                                                                <DatePicker className="form-control"
                                                                    selected={Startdate}
                                                                    // onChange={(Startdate) => setStartdate(Startdate)}
                                                                    value={item.StartDate}
                                                                    onChange={handleDatestart}
                                                                    //  value={item.Startdate}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    locale="es"
                                                                />
                                                            </div>
                                                            <div className="col-sm-4 ">
                                                                <label className="form-label">Due Date</label>
                                                                {/* <input type="text" className="form-control"
                                                                    defaultValue={item.HomePhone != null ? item.HomePhone : ""} /> */}
                                                                {/* <DatePicker onSelectDate={dueDate} dateFormat="dd/MM/yyyy" onChange={(date) => setStartDate(dueDate)} className="form-control ng-pristine ng-valid ng-touched ng-not-empty" /> */}
                                                                <DatePicker className="form-control"
                                                                    selected={date}
                                                                    // onChange={(date) => setDate(date)}
                                                                    value={item.DueDate}
                                                                    onChange={handleDatedue}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    locale="es"
                                                                />
                                                            </div>

                                                            <div className="col-sm-4 pe-0">
                                                                <label className="form-label">
                                                                    Completion Date </label>
                                                                {/* <input type="text" className="form-control"
                                                                    defaultValue={item.LinkedIn != null ? item.LinkedIn.Description : ""} /> */}
                                                                <DatePicker className="form-control"
                                                                    name="CompletionDate"
                                                                    selected={Completiondate}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    value={item.CompletedDate}

                                                                    // onChange={(Completiondate) => setCompletiondate(Completiondate)}
                                                                    onChange={handleDate}
                                                                    locale="es"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-10">
                                                            <div className="col-sm-4 ps-0">
                                                                <label className="form-label">Synonyms <a className="hreflink" target="_blank"><span className="pull-right"><i className="fa fa-instagram"></i></span></a></label>
                                                                <input type="text" className="form-control"
                                                                    defaultValue={item.SynonymsTitle} onChange={(e) => item.SynonymsTitle = e.target.value} />
                                                                <span className="input-group-text" onClick={(e) => createSynonyms(item)}> <img src="https://www.shareweb.ch/site/Joint/SiteCollectionImages/ICONS/24/save.png"></img></span>
                                                                {item["Synonyms"] != undefined && item["Synonyms"].length > 0 && map(item["Synonyms"], (obj, index) => {
                                                                    return (
                                                                        <>
                                                                            <div className="block full_width">
                                                                                {
                                                                                    obj.Title
                                                                                }
                                                                                <a className="input-group-text" onClick={(e) => deleteItem(item)}>
                                                                                    <img src="/_layouts/images/delete.gif"></img>
                                                                                </a>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                })
                                                                }
                                                            </div>

                                                            <div className="col-sm-4">
                                                                <label className="form-label">Client Activity <a className="hreflink" href={item.Twitter != null ? item.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                <input type="text" className="form-control"
                                                                    defaultValue={item.Twitter != null ? item.Twitter.Description : ""} />
                                                            </div>

                                                            <div className="col-sm-4 pe-0">
                                                                <label className="form-label">Package</label>
                                                                <input type="text" className="form-control"
                                                                    defaultValue={item.Package != null ? item.Package : ""} onChange={(e) => item.Package = e.target.value} />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-10">
                                                            <div className="col-sm-6 ps-0">
                                                                <label className="form-label">Status</label>
                                                                <input type="text" className="form-control"
                                                                    defaultValue={item.AdminStatus} />
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            name="NotStarted" type="radio" value="Not Started"
                                                                            checked={item.AdminStatus == "Not Started"}
                                                                            onChange={(e) => setStatus(item, 'Not Started')}
                                                                        ></input> Not Started
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            name="NotStarted" type="radio"
                                                                            value="In Preparation"
                                                                            onChange={(e) => setStatus(item, 'In Preparation')}
                                                                            defaultChecked={item.AdminStatus == "In Preparation"}></input> In Preparation
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            name="NotStarted" type="radio"
                                                                            value="In Development"
                                                                            onChange={(e) => setStatus(item, 'In Development')}
                                                                            defaultChecked={item.AdminStatus == "In Development"}></input> In Development
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input" name="NotStarted"
                                                                            type="radio" value="Active"
                                                                            onChange={(e) => setStatus(item, 'Active')}
                                                                            defaultChecked={item.AdminStatus == "Active"}></input> Active
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input className="form-check-input"
                                                                            name="NotStarted" type="radio" value="Archived"
                                                                            onChange={(e) => setStatus(item, 'Archived')}
                                                                            defaultChecked={item.AdminStatus == "Archived"}></input> Archived
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 pe-0">
                                                                <label className="form-label">Time <a className="hreflink" href={item.Twitter != null ? item.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                <input type="text" className="form-control"
                                                                    defaultValue={item.Mileage != null ? item.Mileage : ""} />
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" onChange={(e) => setTime(item, '05')} defaultChecked={item.Mileage == "05" ? true : false}
                                                                            type="radio"></input>Very Quick
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" onChange={(e) => setTime(item, '15')} defaultChecked={item.Mileage == "15"}
                                                                            type="radio" ></input>Quick
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" onChange={(e) => setTime(item, '60')} defaultChecked={item.Mileage == "60"}
                                                                            type="radio" ></input>Medium
                                                                    </label>
                                                                </div>
                                                                <div className="radio">
                                                                    <label>
                                                                        <input name="radioTime" onChange={(e) => setTime(item, "240")} defaultChecked={item.Mileage == "240"}
                                                                            type="radio" ></input>Long
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 mt-10">
                                                        <div className="col" title="Priority">
                                                            <label className="form-label">Priority</label>
                                                            <input type="text" className="form-control"
                                                                defaultValue={item.Priority_x0020_Rank} onChange={(e) => setPriority(item, 4)} value={item.Priority_x0020_Rank} />
                                                            <div className="radio">
                                                                <label>
                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(1) High" onChange={(e) => setPriority(item, 8)}
                                                                        defaultChecked={item.Priority === "(1) High"}></input>High
                                                                </label>
                                                            </div>
                                                            <div className="radio">
                                                                <label>
                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(2) Normal" onChange={(e) => setPriority(item, 4)}
                                                                        defaultChecked={item.Priority === "(2) Normal"}></input>Normal
                                                                </label>
                                                            </div>
                                                            <div className="radio">
                                                                <label>
                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(3) Low" onChange={(e) => setPriority(item, 1)}
                                                                        defaultChecked={item.Priority === "(3) Low"}></input>Low
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col position-relative mt-10">
                                                            <label className="form-label">Categories </label>
                                                            <input type="text" className="form-control"
                                                                defaultValue={item.Facebook != null ? item.Facebook.Description : ""} />
                                                            <span className="input-group-text"  >

                                                                {/* <Picker /> */}
                                                                <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                    onClick={(e) => EditComponentPicker(item, 'Categories')} />

                                                            </span>
                                                            <div className="col-sm-11  inner-tabb">
                                                                <div>

                                                                    {item != undefined && item.smartCategories != undefined && item.smartCategories.map((childi: any) =>
                                                                        // {childi.Title}
                                                                        // return (
                                                                        //     <>
                                                                        < div className="block bgsiteColor"

                                                                        >
                                                                            <a className="hreflink" target="_blank"  >{childi.Title}</a>
                                                                            <a className="hreflink"
                                                                            >
                                                                                <img src="/_layouts/images/delete.gif"></img>
                                                                            </a>
                                                                        </div>
                                                                        //     </>
                                                                        // )
                                                                    )}


                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-sm-4  mt-10">
                                                        <CommentCard siteUrl={item.siteUrl} userDisplayName={item.userDisplayName} listName={item.siteType} itemID={item.Id}></CommentCard>


                                                    </div>
                                                    <div className="col-sm-8 ps-0 mb-10">
                                                        <label className="form-label">Url</label>
                                                        <input type="text" className="form-control" placeholder="Url"></input>

                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                        <div className="tab-pane" id="concept" role="tabpanel" aria-labelledby="profile-tab">

                                            <div className="col  p-2">
                                                <div className="container">
                                                    <section className='accordionbox'>

                                                        <div className="accordion p-0  overflow-hidden">
                                                            <div className="card shadow-none mb-2">

                                                                <div className="accordion-item border-0" id="t_draggable1">
                                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => expendcollapsAccordion(item, 'showsAdmin')}><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                                        <span className="sign">{item.showsAdmin ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900"> Admin Notes</span></button></div>
                                                                    <div className="accordion-collapse collapse show"  >

                                                                        {item.showsAdmin &&
                                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                                <textarea defaultValue={item.Admin_x0020_Notes} onChange={(e) => item.Admin_x0020_Notes = e.target.value}>

                                                                                </textarea>
                                                                            </div>


                                                                        }


                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="card shadow-none  mb-2">
                                                                <div className="accordion-item border-0" id="t_draggable1">
                                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => expendcollapsAccordion(item, 'showdes')} ><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                                        <span className="fw-medium font-sans-serif text-900"><span className="sign">{item.showdes ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span> Description</span></button></div>
                                                                    <div className="accordion-collapse collapse show"  >

                                                                        {item.showdes &&
                                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                                {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}
                                                                                {/* <input type="textarea"
                                                                                    name="textValue" defaultValue={item.Short_x0020_Description_x0020_On}
                                                                                    onChange={this.handleChange}
                                                                                /> */}
                                                                                <span className="pull-right">
                                                                                    <input type="checkbox" defaultChecked={item.descriptionVerified == true}></input>
                                                                                    <span>Verified</span>
                                                                                </span>
                                                                                <Editor
                                                                                    toolbarClassName="toolbarClassName"
                                                                                    wrapperClassName="wrapperClassName"
                                                                                    editorClassName="editorClassName"
                                                                                    // defaultValue={item.Short_x0020_Description_x0020_On}
                                                                                    wrapperStyle={{ width: '100%', border: "2px solid black", height: '60%' }}
                                                                                />

                                                                                {/* <p className="m-0" dangerouslySetInnerHTML={{ __html: item.Short_x0020_Description_x0020_On }}>
                                                                                   
                                                                                </p> */}
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="card shadow-none  mb-2">
                                                                <div className="accordion-item border-0" id="t_draggable1">
                                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => expendcollapsAccordion(item, 'show')} ><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                                        <span className="fw-medium font-sans-serif text-900"><span className="sign">{item.show ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>  Short  Description</span></button></div>
                                                                    <div className="accordion-collapse collapse show"  >

                                                                        {item.show &&
                                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                                {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}
                                                                                <span className="pull-right">
                                                                                    <input type="checkbox" defaultChecked={item.ShortDescriptionVerified == true}></input>
                                                                                    <span>Verified</span>
                                                                                </span>
                                                                                <Editor
                                                                                    toolbarClassName="toolbarClassName"
                                                                                    wrapperClassName="wrapperClassName"
                                                                                    editorClassName="editorClassName"
                                                                                    // defaultValue={item.Short_x0020_Description_x0020_On}
                                                                                    wrapperStyle={{ width: '100%', border: "2px solid black", height: '60%' }}
                                                                                />
                                                                                {/* <p className="m-0" dangerouslySetInnerHTML={{ __html: item.Short_x0020_Description_x0020_On }}>
                                                                                   
                                                                                </p> */}
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>

                                                            </div>



                                                            <div className="card shadow-none  mb-2">

                                                                <div className="accordion-item border-0" id="t_draggable1">
                                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => expendcollapsAccordion(item, 'showl')} ><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                                        <span className="sign">{item.showl ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900" > Background</span></button></div>
                                                                    <div className="accordion-collapse collapse show" >


                                                                        {item.showl &&
                                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                                {/* <p className="m-0" > <a>{item.Background}</a></p> */}
                                                                                <span className="pull-right">
                                                                                    <input type="checkbox" defaultChecked={item.BackgroundVerified == true} onChange={(e) => item.BackgroundVerified = e.target.value}></input>
                                                                                    <span>Verified</span>
                                                                                </span>
                                                                                <textarea defaultValue={item.Background} onChange={(e) => item.Background = e.target.value}>

                                                                                </textarea>
                                                                            </div>
                                                                        }


                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="card shadow-none mb-2">

                                                                <div className="accordion-item border-0" id="t_draggable1">
                                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => expendcollapsAccordion(item, 'shows')}><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                                        <span className="sign">{item.shows ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900" > Idea</span></button></div>
                                                                    <div className="accordion-collapse collapse show"  >

                                                                        {item.shows &&
                                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                                <span className="pull-right">
                                                                                    <input type="checkbox" defaultChecked={item.IdeaVerified == true} onChange={(e) => item.BackgroundVerified = e.target.value}></input>
                                                                                    <span>Verified</span>
                                                                                </span>
                                                                                <textarea defaultValue={item.Idea} onChange={(e) => item.Idea = e.target.value}>

                                                                                </textarea>
                                                                            </div>

                                                                        }


                                                                    </div>
                                                                </div>

                                                            </div>





                                                            <div className="card shadow-none mb-2">

                                                                <div className="accordion-item border-0" id="t_draggable1">
                                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => expendcollapsAccordion(item, 'showj')}><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                                        <span className="sign">{item.showj ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900"> Value Added</span></button></div>
                                                                    <div className="accordion-collapse collapse show"  >

                                                                        {item.showj &&
                                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                                <span className="pull-right">
                                                                                    <input type="checkbox" defaultChecked={item.ValueAddedVerified == true} onChange={(e) => item.ValueAddedVerified = e.target.value}></input>
                                                                                    <span>Verified</span>
                                                                                </span>
                                                                                {/* <p className="m-0" dangerouslySetInnerHTML={{ __html: item.ValueAdded }}></p> */}

                                                                                <textarea defaultValue={item.ValueAdded} onChange={(e) => item.ValueAdded = e.target.value}>

                                                                                </textarea>
                                                                            </div>
                                                                        }


                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="card shadow-none mb-2">

                                                                <div className="accordion-item border-0" id="t_draggable1">
                                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => expendcollapsAccordion(item, 'showm')}><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                                        <span className="sign">{item.showm ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900" > Deliverables</span></button></div>
                                                                    <div className="accordion-collapse collapse show"  >

                                                                        {item.showm &&
                                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                                {/* <p className="m-0" dangerouslySetInnerHTML={{ __html: item.Deliverables }}></p> */}
                                                                                <span className="pull-right">
                                                                                    <input type="checkbox" defaultChecked={item.DeliverablesVerified == true}></input>
                                                                                    <span>Verified</span>
                                                                                </span>
                                                                                <Editor
                                                                                    toolbarClassName="toolbarClassName"
                                                                                    wrapperClassName="wrapperClassName"
                                                                                    editorClassName="editorClassName"
                                                                                    // defaultValue={item.Short_x0020_Description_x0020_On}
                                                                                    wrapperStyle={{ width: '100%', border: "2px solid black", height: '60%' }}
                                                                                />
                                                                            </div>
                                                                        }


                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>




                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">

                                            <div className="col  p-2">
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
                                        {/* <div className="tab-pane" id="contact" role="tabpanel" aria-labelledby="contact-tab">

                                            <div className="row  p-2">
                                                <div className="col-sm-12 mb-10">
                                                    <div className="col-sm-12 pull-left HedaBackclr">
                                                        <div className="col-sm-11 padL-0 hreflink"
                                                           >
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

                                        </div> */}
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
                                                    Created <span ng-bind="Item.Created | date:'dd/MM/yyyy'">{item.Created != null ? moment(item.Created).format('DD/MM/YYYY MM:SS') : ""}</span> by
                                                    <span className="footerUsercolor">
                                                        {/* {{Item.Author.Title}} */}
                                                        {item.Author.Title != undefined ? item.Author.Title : ""}
                                                    </span>
                                                </div>
                                                <div className="text-left">
                                                    Last modified <span>{item.Modified != null ? moment(item.Modified).format('DD/MM/YYYY MM:SS') : ""}</span> by <span className="footerUsercolor">
                                                        {/* {{Item.Editor.Title}} */}
                                                        {item.Editor.Title != undefined ? item.Editor.Title : ""}
                                                    </span>
                                                </div>
                                                <div className="text-left">
                                                    <a className="hreflink">
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
                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/15/images/ichtm.gif?rev=23" />Go to Profile page
                                                        </a>
                                                    </span>
                                                    <span className="ml5">|</span>
                                                    <a className="ml5" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/Master%20Tasks/EditForm.aspx?ID=${item.Id}`}
                                                        target="_blank">Open out-of-the-box form</a>
                                                    <button type="button" className="btn btn-primary ml5" onClick={(e) => SaveData()}>Save</button>
                                                    <button type="button" className="btn btn-default" onClick={setModalIsOpenToFalse}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {IsComponent && <ComponentPortPolioPopup props={SharewebComponent} Call={Call}></ComponentPortPolioPopup>}
                        {IsComponentPicker && <Picker props={SharewebCategory} Call={Call}></Picker>}

                    </div>
                )}
            </Modal>
        </>
    )
} export default EditInstitution;
