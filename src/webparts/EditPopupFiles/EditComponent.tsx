import * as React from "react";
// import ImagesC from "./Images";
import { arraysEqual, Modal } from 'office-ui-fabric-react';
import Tabs from "./Tabs/Tabs";
import Tab from "./Tabs/Tab";
import * as moment from 'moment';
import './Tabs/styles.css';

// import { Editor } from "react-draft-wysiwyg";
//import { Editor, EditorState, ContentState } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
//import Tooltip from "./Tooltip/popup";




function EditInstitution(item: any) {
    // Id:any




    const [CompoenetItem, setComponent] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [useeffectdata, setuseeffectdata] = React.useState(false);
    const [selectedOption, setselectedOption] = React.useState('');
    const [SharewebItemRank, setSharewebItemRank] = React.useState([]);
    const setModalIsOpenToTrue = (e:any) => {
        e.preventDefault()
        setModalIsOpen(true)
    }



    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }
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
        var query = "ComponentCategory/Id,ComponentCategory/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,SiteCompositionSettings,PortfolioStructureID,ItemRank,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,Deliverable_x002d_Synonyms,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title&$expand=ClientCategory,ComponentCategory,AssignedTo,Component,ComponentPortfolio,ServicePortfolio,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Id eq " + item.item.Id + "";
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
                    item.PercentComplete = item.PercentComplete <= 1 ? item.PercentComplete * 100 : item.PercentComplete;
                    if (item.PercentComplete != undefined) {
                        item.PercentComplete = parseInt((item.PercentComplete).toFixed(0));
                    }
                    item.siteType = 'Master Tasks';
                    item.taskLeader = 'None';
                    if (item.AssignedTo != undefined && item.AssignedTo.results != undefined && item.AssignedTo.results.length > 0)
                        item.taskLeader = getMultiUserValues(item);
                    if (item.Task_x0020_Type == undefined)
                        item.Task_x0020_Type = 'Activity Tasks';
                    item.SmartCountries = [];
                    item['SiteIcon'] = item.siteType == "Master Tasks" ? GetIconImageUrl(item.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined) : GetIconImageUrl(item.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
                });
                //  deferred.resolve(Tasks);
                setComponent(Tasks);
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
    React.useEffect(() => {
        var initLoading = function () {
            if (item.item != undefined && item.item.siteType != undefined) {
                var Item = item.item;
                if (Item.siteType == 'HTTPS:') {
                    Item.siteType = 'HHHH';
                }
                getMasterTaskListTasks();
                ListId = 'ec34b38f-0669-480a-910c-f84e92e58adf';
                CurrentSiteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/';
                setSharewebItemRank([{ rankTitle: '(8) Top Highlights', rank: '8' }, { rankTitle: '(7) Featured Item', rank: '7' }, { rankTitle: '(6) Key Item', rank: '6' }, { rankTitle: '(5) Relevant Item', rank: '5' }, { rankTitle: '(4) Background Item', rank: '4' }, { rankTitle: '(2) to be verified', rank: '2' }, { rankTitle: '(1) Archive', rank: '1' }, { rankTitle: '(0) No Show', rank: '0' }]);
                if(useeffectdata ==false)
                setuseeffectdata(true);
                else  setuseeffectdata(false);
                //loadColumnDetails();
            }
        }
        initLoading();
 
    },
       [] );

   
    return (
        <>
            <img title="Edit Details" className="wid22" onClick={(e) => setModalIsOpenToTrue(e)}
                src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" />
            <Modal
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false}
            // {width:"1250px"}
            >
                {CompoenetItem != undefined && CompoenetItem.map(institution =>
                    <div id="EditGrueneContactSearch">
                        <div className="panel panel-default" ng-cloak>
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    <img style={{ width: "22px" }} ng-if="selectedImageUrl != undefined" id="selectedimage"
                                        ng-src="{{selectedImageUrl}}?RenditionID=12" />
                                    <img style={{ width: "22px" }} ng-if="selectedImageUrl == undefined"
                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/InstitutionPicture.jpg" />
                                    Edit Institution-
                                    {institution.Title}
                                    <span className="pull-right">
                                        {/* <page-settings-info webpartid="'EditInstitutionPopup'"></page-settings-info> */}
                                        {/* <Tooltip /> */}
                                    </span>
                                </h3>
                                <button type="button" style={{ minWidth: "10px" }} className="close" data-dismiss="modal"
                                    onClick={setModalIsOpenToFalse}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <form name="ItemForm" noValidate role="form">
                                    <div id="table-wrapper">
                                        <div id="table-scroll">
                                            <div id="itemtabs" className="exTab3">

                                                <div className="tab-content clearfixnew">
                                                    <Tabs>
                                                        <Tab title="BASIC INFORMATION">


                                                            <div id="basicinfo">
                                                                <div className="col-sm-12">
                                                                    <div className="row form-group">
                                                                        <div className="col-sm-3">
                                                                            <label className="full_width">Title</label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.Title != undefined ? institution.Title : ""} />
                                                                        </div>
                                                                        <div className="col-sm-3 padL-0" title="Email">
                                                                            <label className="full_width">Item Rank</label>
                                                                            <select className="form-control">
                                                                                <option>---select---</option>
                                                                                {
                                                                                    SharewebItemRank &&
                                                                                    SharewebItemRank.map((h: any, i: any) =>
                                                                                        (<option key={i} value={h.rankTitle}>{h.rankTitle}</option>))
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-sm-3 padL-0" title="Categories">
                                                                            <label className="full_width">Priority</label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.Categories != undefined ? institution.Categories : ""} />
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input" name="radioPriority"
                                                                                        type="radio" value="(1) High" ng-click="SelectPriority()"
                                                                                        checked={selectedOption === 'High'}></input>High
                                                                                </label>
                                                                            </div>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input" name="radioPriority"
                                                                                        type="radio" value="(2) Normal" ng-click="SelectPriority()"
                                                                                        checked={selectedOption === 'Normal'}></input>Normal
                                                                                </label>
                                                                            </div>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input" name="radioPriority"
                                                                                        type="radio" value="(3) Low" ng-click="SelectPriority()"
                                                                                        checked={selectedOption === 'Low'}></input>Low
                                                                                </label>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="row form-group">

                                                                        <div className="col-sm-3">
                                                                            <div className="col-sm-11 padL-0 PadR0">
                                                                                <label className="full_width">
                                                                                    Component Portfolio
                                                                                </label>
                                                                                <input style={{ width: "100%" }} type="text"
                                                                                    className="form-control" id="txtSmartCountries" />

                                                                            </div>
                                                                            <div className="col-sm-1 PadR0">
                                                                                <label className="full_width">&nbsp;</label>
                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/PublishingImages/Logos/EMMCopyTerm.png"
                                                                                    ng-click="openSmartTaxonomy('Countries');" />
                                                                            </div>
                                                                            <div className="col-sm-11 padL-0 PadR0 inner-tabb">
                                                                                <div className="block mt-5" >

                                                                                    {institution.SmartCountries.length != 0 ? institution.SmartCountries.Title : ""}


                                                                                    <a className="hreflink"
                                                                                        ng-click="removeSmartCountry(item.Id,Item)">
                                                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/images/delete.gif" />
                                                                                    </a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className="col-sm-3 padL-0">
                                                                            <label className="full_width">Deliverable-Synonyms</label>

                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.WorkAddress != undefined ? institution.WorkAddress : ""} />
                                                                        </div>
                                                                        <div className="col-sm-3 padL-0">
                                                                            {/* <label className="full_width">Institution Type</label>

                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.InstitutionType != undefined ? institution.InstitutionType : ""} /> */}
                                                                        </div>
                                                                        <div className="col-sm-3">
                                                                            <form name="validURLFormforWebPage">
                                                                                {/* <label className="full_width">Website</label>
                                                                                <input type="text" name="validUrl"
                                                                                    ng-pattern="/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,7}(:[0-9]{1,7})?(\/.*)?$/"
                                                                                    className="form-control form-group"

                                                                                    defaultValue={institution.WebPage != null ? institution.WebPage.Description : ""}
                                                                                /> */}
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row form-group">
                                                                        <div className="col-sm-3">
                                                                            <label className="full_width">Start Date</label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.CellPhone != null ? institution.CellPhone : ""}
                                                                            />
                                                                        </div>
                                                                        <div className="col-sm-3 padL-0">
                                                                            <label className="full_width">Due Date</label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.HomePhone != null ? institution.HomePhone : ""} />
                                                                        </div>

                                                                        <div className="col-sm-3 padL-0">
                                                                            <label className="full_width">
                                                                                Completion Date <a className="hreflink" href={institution.LinkedIn != null ? institution.LinkedIn.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-linkedin"></i></span></a></label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.LinkedIn != null ? institution.LinkedIn.Description : ""} />
                                                                        </div>

                                                                        <div className="col-sm-3 padL-0">
                                                                            <label className="full_width">Categories <a className="hreflink" href={institution.Facebook != null ? institution.Facebook.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-facebook"></i></span></a></label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.Facebook != null ? institution.Facebook.Description : ""} />
                                                                        </div>


                                                                    </div>
                                                                    <div className="row form-group">

                                                                        <div className="col-sm-3">
                                                                            <label className="full_width">Synonyms <a className="hreflink" href={institution.Instagram != null ? institution.Instagram.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-instagram"></i></span></a></label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.Instagram != null ? institution.Instagram.Description : ""} />
                                                                        </div>

                                                                        <div className="col-sm-3 padL-0">
                                                                            <label className="full_width">Client Activity <a className="hreflink" href={institution.Twitter != null ? institution.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.Twitter != null ? institution.Twitter.Description : ""} />
                                                                        </div>

                                                                        <div className="col-sm-3 padL-0">
                                                                            <label className="full_width">Package <a className="hreflink" href={institution.Twitter != null ? institution.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.Twitter != null ? institution.Twitter.Description : ""} />
                                                                        </div>


                                                                    </div>
                                                                    <div className="row form-group">
                                                                        <div className="col-sm-3">
                                                                            <label className="full_width">Status</label>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input"
                                                                                        ng-checked="Item.AdminStatus=='Not Started'"
                                                                                        name="Not Started" type="radio" value="Not Started"
                                                                                        ng-click="Adminstatus('Not Started')"
                                                                                        ng-model="AdminStatusChecked"></input> Not Started
                                                                                </label>
                                                                            </div>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input"
                                                                                        ng-checked="Item.AdminStatus=='In Preparation'"
                                                                                        name="In Preparation" type="radio"
                                                                                        value="In Preparation"
                                                                                        ng-click="Adminstatus('In Preparation')"
                                                                                        ng-model="AdminStatusChecked"></input> In Preparation
                                                                                </label>
                                                                            </div>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input"
                                                                                        ng-checked="Item.AdminStatus=='In Development'"
                                                                                        name="In Development" type="radio"
                                                                                        value="In Development"
                                                                                        ng-click="Adminstatus('In Development')"
                                                                                        ng-model="AdminStatusChecked"></input> In Development
                                                                                </label>
                                                                            </div>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input"
                                                                                        ng-checked="Item.AdminStatus=='Active'" name="Active"
                                                                                        type="radio" value="Active"
                                                                                        ng-click="Adminstatus( 'Active')"
                                                                                        ng-model="AdminStatusChecked"></input> Active
                                                                                </label>
                                                                            </div>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input className="form-check-input"
                                                                                        ng-checked="Item.AdminStatus=='Archived'"
                                                                                        name="Archived" type="radio" value="Archived"
                                                                                        ng-click="Adminstatus('Archived')"
                                                                                        ng-model="AdminStatusChecked"></input> Archived
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-3 padL-0">
                                                                            <label className="full_width">Time <a className="hreflink" href={institution.Twitter != null ? institution.Twitter.Url : ""} target="_blank"><span className="pull-right"><i className="fa fa-twitter"></i></span></a></label>
                                                                            <input type="text" className="form-control"
                                                                                defaultValue={institution.Twitter != null ? institution.Twitter.Description : ""} />
                                                                        </div>

                                                                    </div>
                                                                    <div className="col-sm-12">
                                                                        <label className="full_width">Url</label>
                                                                        <div className="forFullScreenButton" id="itemDescription" ng-model="localaboutdescription">

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="clearfix"></div>
                                                            </div>
                                                        </Tab>

                                                        <Tab title="IMAGES INFOMATION">
                                                            {/* <div id="ImageInfo">
                                                                <ImagesC id={null} />
                                                            </div> */}
                                                        </Tab>

                                                        <Tab title="DIVISION">
                                                            <div id="Institution" className="tab-pane fade">
                                                                <div className="divPanelBody clearfix">
                                                                    <div className="col-sm-12 clearfix">
                                                                        <ul id="main-menu" className="new">
                                                                            <li>
                                                                                <a className="hreflink" ng-click="editDivisionpopup()">
                                                                                    <img src="https://kathabeck.sharepoint.com/sites/42/SiteCollectionImages/ICONS/Shareweb/Add-New.png"
                                                                                        alt="" title="Add Taxonomy Item"
                                                                                        className="img-icon" />
                                                                                </a>
                                                                            </li>
                                                                            <li id="node_{{item.Id}}" ng-repeat="item in AllDivisions">
                                                                                <a target="_blank" className="hreflink"
                                                                                    ng-href="{{CurrentSiteUrl}}/SitePages/Institution-Profile.aspx?contactId={{item.Id}}&name={{item.Title}}">
                                                                                    {/* {{item.Title}} */}
                                                                                </a>
                                                                                <a style={{ padding: "0px 6px" }}
                                                                                    className="hreflink pull-right"
                                                                                    ng-click="deleteitem(item);">
                                                                                    <img ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/images/delete.gif" />
                                                                                </a>
                                                                            </li>

                                                                        </ul>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </Tab>

                                                        <Tab title="SYNONYMS">
                                                            <div id="AddSynonyms" className="tab-pane fade">
                                                                <div className="fixed-divPanelBody clearfix">
                                                                    <div className="col-sm-12">
                                                                        <span className="pull-right mb-10 mt-10">
                                                                            <button type="button" className="btn btn-primary" ng-click="addsynonyms()">
                                                                                Add
                                                                                Synonyms
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-sm-12">
                                                                        <div ng-if="Item['Synonyms'].length==0">
                                                                            <div className="current_commnet">No Synonyms Available</div>
                                                                        </div>
                                                                        <div ng-if="Item['Synonyms'].length>0">
                                                                            <div className="section-event">
                                                                                <div className="container-new">
                                                                                    <table className="table  compare_item" style={{ width: "100%" }}>
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th style={{ width: "80%" }}>
                                                                                                    <div className="text" style={{ width: "80%" }}>
                                                                                                        Title
                                                                                                    </div>
                                                                                                </th>
                                                                                                <th style={{ width: "10%" }}>
                                                                                                    <div style={{ width: "10%" }}></div>
                                                                                                </th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr ng-repeat="val in Item['Synonyms']">
                                                                                                <td style={{ width: "95%" }}>
                                                                                                    <input className="form-control" type="text"
                                                                                                        ng-model="val.Title"
                                                                                                        ng-disabled="val.status" />
                                                                                                </td>
                                                                                                <td>
                                                                                                    <span ng-if="!val.status"
                                                                                                        ng-click="val.status=!val.status"
                                                                                                        title="Save">
                                                                                                        <img src="https://www.shareweb.ch/site/Joint/SiteCollectionImages/ICONS/24/save.png" />
                                                                                                    </span>
                                                                                                    <span ng-if="val.status"
                                                                                                        ng-click="val.status=!val.status"
                                                                                                        title="Edit">
                                                                                                        <img src="https://www.shareweb.ch/site/Joint/SiteCollectionImages/ICONS/24/edit.png" />
                                                                                                    </span>
                                                                                                    <a className="hreflink"
                                                                                                        ng-click="Item['Synonyms'].splice($index,1);">
                                                                                                        <img ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/images/delete.gif" />
                                                                                                    </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                {/* <!--<item-info></item-info>--> */}

                            </div>
                            <div className="modal-footer">
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="ItemInfo col-sm-6">
                                            <div className="text-left">
                                                Created <span ng-bind="Item.Created | date:'dd/MM/yyyy'">{institution.Created != null ? moment(institution.Created).format('DD/MM/YYYY') : ""}</span> by
                                                <span className="footerUsercolor">
                                                    {/* {{Item.Author.Title}} */}
                                                    {institution.Author.Title != undefined ? institution.Author.Title : ""}
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                Last modified <span ng-bind="Item.Modified | date:'dd/MM/yyyy hh:mm'">{institution.Modified != null ? moment(institution.Modified).format('DD/MM/YYYY') : ""}</span> by <span className="footerUsercolor">
                                                    {/* {{Item.Editor.Title}} */}
                                                    {institution.Editor.Title != undefined ? institution.Editor.Title : ""}
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <a className="hreflink" ng-click="removeItem(institution.Id)">
                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/images/delete.gif" /> Delete this item
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 ItemInfo-right">
                                            <div className="pull-right">
                                                <span>
                                                    <a className="ForAll hreflink" target="_blank"
                                                        href={`https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SitePages/Institution-Profile.aspx?contactId=${institution.Id}&name=${institution.Title}`}>
                                                        <img className="mb-3 icon_siz19" style={{ marginRight: "3px" }}
                                                            ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/15/images/ichtm.gif?rev=23" />Go to Profile page
                                                    </a>
                                                </span>
                                                <span>|</span>
                                                <a ng-href={`https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/Lists/Institutions/EditForm.aspx?ID=${institution.Id}`}
                                                    target="_blank">Open out-of-the-box form</a>
                                                <button type="button" className="btn btn-primary" ng-click="SaveItem()">Save</button>
                                                <button type="button" className="btn btn-default" onClick={setModalIsOpenToFalse}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="getDivisionPopUp" className="modal fade in" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="false" style={{ display: "none" }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <form name="createInstitutionForm" noValidate role="form">
                                        <div className="panel-title">
                                            <button type="button" className="close ml-2" style={{ minWidth: "10px" }} data-dismiss="modal"
                                                ng-click="cancelDivisionpopup()">
                                                &times;
                                            </button>
                                            {/* <page-settings-info webpartid="'CreateContactPopupItem'"></page-settings-info> */}
                                            <h3 className="">Add Division</h3>
                                        </div>
                                        <div className="modal-body">
                                            <div className="col-sm-12 tab-content phase mb-10 mt-10  PadR0">
                                                <div className="form-group">
                                                    <div className="form-group col-sm-12 padL-0">
                                                        <label ng-bind-html="GetColumnDetails('InstitutionTitle') | trustedHTML">
                                                        </label>
                                                        <div>
                                                            <input type="text" ng-model="Title"
                                                                className="form-control" ng-required="true" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <div className="col-sm-12 mt-10">
                                                {/* <!--<button type="button" ng-show="IsTitleSelected" className="btn btn-primary" ng-click="createJoinInstitution()">Ok</button>--> */}
                                                <button type="button" className="btn btn-primary"
                                                    ng-click="saveDivision()">
                                                    Save
                                                </button>
                                                <button type="button" className="btn btn-default" ng-click="setModalIsOpenToFalse()">Cancel</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div id="modalAllCovers" className="modal fade in" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="false" style={{ display: "none" }}>
                            <div className="modal-dialog" style={{ width: "90%" }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" style={{ minWidth: "10px" }} ng-click="cancelItemCover()"
                                            title="Click to exit">
                                            &times;
                                        </button>
                                        <h4 className="modal-title">Select Item Cover</h4>
                                        <div className="pull-right">
                                            <button type="button" ng-disabled="rowPosition <= 115" className="btn btn-primary"
                                                style={{ marginRight: "10px", marginTop: "-35px" }} ng-click="LoadPrevCovers(rowPosition)"
                                                title="Click to load prev 100 Covers">
                                                Prev
                                            </button>
                                            <button type="button" ng-disabled="rowPosition >= AllImages.length" className="btn btn-primary"
                                                style={{ marginRight: "30px", marginTop: "-35px" }} ng-click="LoadNextCovers(rowPosition)"
                                                title="Click to load next 100 Covers">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <div id="coverImagesPopup">
                                            <img title="{{img.FileLeafRef}}" id="{{img.Id}}_imagepopup"
                                                ng-src="{{img.EncodedAbsUrl}}?RenditionID=9" ng-click="selectImagePopup(img)"
                                                className="morecovers" ng-repeat="img in Images" />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" ng-click="cancelItemCover()"
                                            title="Save changes & exit">
                                            Save
                                        </button>
                                        <button type="button" className="btn btn-default" ng-click="cancelItemCover()"
                                            title="Discard unsaved changes & exit" onClick={setModalIsOpenToFalse}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </div>
                )}
            </Modal>
        </>
    )
} export default React.memo(EditInstitution);