import * as React from 'react';
import * as $ from 'jquery';
import * as Moment from 'moment';
import '../../cssFolder/foundation.scss';
import { Modal } from 'office-ui-fabric-react';
//import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
import { MdAdd } from 'react-icons/Md';
import { CSVLink } from "react-csv";
import SmartFilter from './SmartFilter';
import '../../cssFolder/foundationmin.scss';






function Groupby() {

    const [maiArrayBackup, setmaiArrayBackup] = React.useState([])
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [show, setShow] = React.useState(false);
    //const [passData, setPassData] = React.useState([]);
    const [child, setChild] = React.useState(false);
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [data, setData] = React.useState([])
    const [Title, setTitle] = React.useState()
    const [itemType, setitemType] = React.useState()
    const [ComponentsData, setComponentsData] = React.useState([])
    const [SubComponentsData, setSubComponentsData] = React.useState([])
    const [FeatureData, setFeatureData] = React.useState([])
    const [table, setTable] = React.useState(data);
    const [Task, setTask] = React.useState([])
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [Editpopup, setEditpopup] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [showItem, setshowItem] = React.useState(false);
    const [state, setState] = React.useState([]);
    const [filterGroups, setFilterGroups] = React.useState([])
    const [filterItems, setfilterItems] = React.useState([])





    //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------

    const SingleLookDatatest = (e: any, item: any, value: any) => {
        const { checked } = e.target;
        if (checked) {
            state.push(item);

        }
        else {
            $.each(state, function (index: any, newite: any) {
                // if (newite.Title != undefined) {
                //     if (newite.Title == item.Title)
                //         state.splice(index, 1);
                // }
                if (newite.Id == item.Id) {
                    state.splice(index, 1);
                }
            })
        }
        setState(state)
    }
    const Clearitem = () => {
        // setData(maini...[maidataBackup])
        setData(maidataBackup)
        // const { checked } = e.target;

    }
    const Updateitem = () => {
        var filters: any[] = []
        if (state.length == 0) {
            setData(maidataBackup)
        }
        else {
            $.each(maidataBackup, function (index: any, item) {

                $.each(state, function (index: any, select) {
                    if (item.Id == select.Id) {
                        filters.push(item);
                    }
                    $.each(item.TeamLeaderUser, function (index: any, team) {
                        if (select.Title == team.Title) {

                            filters.push(item);
                        }

                    })
                    $.each(item.Child, function (index: any, childitem) {
                        if (childitem.Id == select.Id) {
                            filters.push(childitem);
                        }

                    })
                    $.each(item.Child.TeamLeaderUser, function (index: any, childteam) {
                        if (select.Title == childteam.Title) {

                            filters.push(childteam);
                        }

                    })

                })





            })
        }

        setData(filters)


    }



    const handleOpen2 = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setfilterItems(filterItems => ([...filterItems]));


    };
    const handleOpen = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setData(data => ([...data]));

    };


    const addModal = () => {
        setAddModalOpen(true)
    }
    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }


    const sortBy = () => {

        const copy = data

        copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

        setTable(copy)

    }
    const sortByDng = () => {

        const copy = data

        copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

        setTable(copy)

    }
    let handleChange = (e: { target: { value: string; }; }) => {
        setSearch(e.target.value.toLowerCase());
    };

    React.useEffect(() => {
        showProgressBar();


        function RetrieveSPData() {
            //--------------------------task user--------------------------------------------------------------------------------------------------
            var Response: any = []
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$top=1000";

            $.ajax({

                url: url,

                method: "GET",

                headers: {

                    "Accept": "application/json; odata=verbose"

                },

                success: function (data) {

                    Response = Response.concat(data.d.results);
                    console.log(Response);

                    if (data.d.__next) {

                        url = data.d.__next;



                    }
                    else setTask(Response);


                },

                error: function (error) {


                }

            });

            //-----------------------------------end taskuser data--------------------------------------------------------------------------------------------

            //----------------------------------------LoadSmartMetaData---------------------------------------------------------------------------------------------------------------------------
            var MetaData: any = []
            var TaxonomyItems: any = []
            var siteConfig: any = []
            var metadatItem: any = []
            var filterItems: any = [];
            // var filterGroups: any = [];
            filterGroups.push("Portfolio");
            filterGroups.push("Sites");
            filterGroups.push("Type");
            filterGroups.push("Team Members");
            // setFilterGroups(filterGroups);
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent&$orderby=SortOrder&$top=4999";


            $.ajax({

                url: url,

                method: "GET",

                headers: {

                    "Accept": "application/json; odata=verbose"

                },

                success: function (data) {

                    MetaData = MetaData.concat(data.d.results);
                    $.each(MetaData, function (item: any, newtest) {
                        if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
                            TaxonomyItems.push(newtest);

                        }
                        if (newtest.TaxType == 'Sites') {
                            siteConfig.push(newtest)
                        }


                    });
                    $.each(siteConfig, function (index: any, newsite) {
                        /*-- Code for default Load Task Data---*/
                        if (newsite.Title == "DRR" && newsite.Title == "Small Projects" && newsite.Title == "Gruene" && newsite.Title == "Offshore Tasks" && newsite.Title == "Health" && newsite.Title == "Shareweb Old") {
                            newsite.Selected = false;
                        }
                        else {
                            newsite.Selected = true;
                        }
                        if (newsite.Title != "Master Tasks" || newsite.Title != "Foundation")
                            siteConfig.push(newsite);
                    })
                    $.each(MetaData, function (newitem: any, item) {
                        if (item.TaxType != 'Status' && item.TaxType != 'Admin Status' && item.TaxType != 'Task Type' && item.TaxType != 'Time' && item.Id != 300 && item.TaxType != 'Portfolio Type' && item.TaxType != 'Task Types') {
                            if (item.TaxType == 'Sites') {
                                item.DataLoad = false;
                                /*-- Code for default Load Task Data---*/
                                if (item.Title == "DRR" || item.Title == "Small Projects" || item.Title == "Offshore Tasks" || item.Title == "Health") {
                                    item.Selected = false;
                                }
                                else {
                                    item.Selected = true;
                                }
                            }
                            else if (item.TaxType == 'Sites Old') {
                                /*-- Code for default Load Task Data---*/
                                item.Selected = true;
                            }
                            metadatItem.push(item);
                            //setFilterGroups(metadatItem)
                        }
                    })
                    $.each(Response, function (index: any, user) {
                        user.TaxType = 'Team Members';
                        user.SmartFilters = {};
                        user.SmartFilters.results = [];
                        user.SmartFilters.results.push('Portfolio');
                        if (user.UserGroupId == undefined)
                            user.ParentID = 0;
                        if (user.UserGroupId != undefined)
                            user.ParentID = user.UserGroupId;
                        metadatItem.push(user);
                    });
                    $.each(metadatItem, function (newi: any, item) {
                        if (item.Title == 'Shareweb Old') {
                            item.TaxType = 'Sites';
                        }
                    })
                    $.each(metadatItem, function (newitem: any, filterItem) {
                        if (filterItem.SmartFilters != undefined && filterItem.SmartFilters.results != undefined && filterItem.SmartFilters.results.indexOf('Portfolio') > -1) {
                            var item: any = [];
                            item.ID = item.Id = filterItem.Id;
                            item.Title = filterItem.Title;
                            item.Group = filterItem.TaxType;
                            item.TaxType = filterItem.TaxType;
                            if (item.Title == "Activities" || item.Title == "Workstream" || item.Title == "Task") {
                                item.Selected = true;
                            }


                            if (filterItem.ParentID == 0 || (filterItem.Parent != undefined && filterItem.Parent.Id == undefined)) {
                                if (item.TaxType == 'Team Members') {
                                    getChildsBasedonId(item, Response);
                                } else {
                                    getChildsBasedOn(item, MetaData);
                                }
                                filterItems.push(item);
                                if (filterItem.TaxType != "Type" && filterItem.TaxType != "Sites Old" && (filterGroups.length == 0 || filterGroups.indexOf(filterItem.TaxType) == -1)) {
                                    filterGroups.push(filterItem.TaxType);

                                }

                                setFilterGroups(filterGroups)

                            }

                        }
                    });

                    filterItems.push({ "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Component", "Selected": true, "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "SubComponent", "Selected": true, "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Feature", "Selected": true, "childs": [] });
                    $.each(filterItems, function (neww: any, item) {
                        if (item.TaxType == "Sites" && item.Title == 'SDC Sites' || item.Title == 'Tasks') {
                            item.Selected = true;
                        }
                    })
                    setfilterItems(filterItems)

                    function getChildsBasedonId(item: { childs: any[]; Id: any; }, items: any) {
                        item.childs = [];
                        $.each(items, function (child: any, childItem) {
                            if (childItem.UserGroupId != undefined && childItem.UserGroupId == item.Id) {
                                item.childs.push(childItem);
                                getChildsBasedonId(childItem, items);
                            }
                        });
                    }
                    function getChildsBasedOn(item: { childs: any[]; ID: number; }, items: any) {
                        item.childs = [];
                        $.each(MetaData, function (news: any, childItem) {
                            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                                item.childs.push(childItem);
                                getChildsBasedOn(childItem, items);
                            }
                        });
                    }

                },


                error: function (error) {


                }

            });
            //---------------------------------------End SmartMetaData-------------------------------------------------------------------------------------------------------------------------------------

            var spRequest = new XMLHttpRequest();
            var query = "Id,Mileage,TaskListId,TaskListName,WorkspaceType,PortfolioLevel,PortfolioStructureID,component_x0020_link,Package,Comments,DueDate,Sitestagging,Body,Deliverables,SiteCompositionSettings,StartDate,Created,Item_x0020_Type,Help_x0020_Information,Background,Categories,TechnicalExplanations,Idea,ValueAdded,Synonyms,Package,Short_x0020_Description_x0020_On,Admin_x0020_Notes,AdminStatus,CategoryItem,Priority_x0020_Rank,Priority,TaskDueDate,DueDate,PercentComplete,Modified,CompletedDate,ItemRank,Title,Portfolio_x0020_Type,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Events/Title,Events/ItemType,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,ClientCategory/Id,ClientCategory/Title&$expand=SharewebCategories,ClientCategory,Parent,Component,Services,Events,AssignedTo,Team_x0020_Members&$filter=((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature'))and (Portfolio_x0020_Type eq 'Component')&$top=4999";
            spRequest.open('GET', "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items?$select=" + query);
            spRequest.setRequestHeader("Accept", "application/json");

            spRequest.onreadystatechange = function () {
                var RootComponentsData: any[] = [];
                // var ComponentsData: any = [];
                // var SubComponentsData: any = [];
                // var FeatureData: any = [];
                var maiArrayBackup: any = []

                if (spRequest.readyState === 4 && spRequest.status === 200) {
                    var results = JSON.parse(spRequest.responseText);

                    maiArrayBackup.push(results.value)
                    setmaiArrayBackup(maiArrayBackup)

                    $.each(results.value, function (index: any, result: any) {
                        result.TeamLeaderUser = []
                        result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')

                        if (result.DueDate == 'Invalid date' || '') {
                            result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                        }
                        result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                        if (result.Short_x0020_Description_x0020_On != undefined) {
                            result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                        }

                        if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                            $.each(result.AssignedTo, function (index: any, Assig: any) {
                                if (Assig.Id != undefined) {
                                    $.each(Response, function (index: any, users: any) {

                                        if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                        }

                                    })
                                }
                            })
                        }
                        if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                            $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
                                if (Assig.Id != undefined) {
                                    $.each(Response, function (index: any, users: any) {
                                        if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                        }

                                    })
                                }
                            })
                        }

                        if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                            $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                                result.ClientCategory.push(catego);
                            })
                        }
                        if (result.Item_x0020_Type == 'Root Component') {
                            result['Child'] = [];
                            RootComponentsData.push(result);
                        }
                        if (result.Item_x0020_Type == 'Component') {
                            result['Child'] = [];
                            ComponentsData.push(result);


                        }

                        if (result.Item_x0020_Type == 'SubComponent') {
                            result['Child'] = [];
                            SubComponentsData.push(result);


                        }
                        if (result.Item_x0020_Type == 'Feature') {
                            result['Child'] = [];
                            FeatureData.push(result);
                        }
                    });

                    $.each(SubComponentsData, function (index: any, subcomp: any) {
                        if (subcomp.Title != undefined) {
                            $.each(FeatureData, function (index: any, featurecomp: any) {
                                if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                                    subcomp['Child'].push(featurecomp);;
                                }
                            })
                        }
                    })

                    $.each(ComponentsData, function (index: any, subcomp: any) {
                        if (subcomp.Title != undefined) {
                            $.each(SubComponentsData, function (index: any, featurecomp: any) {
                                if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                                    subcomp['Child'].push(featurecomp);;
                                }
                            })
                        }
                    })
                    //maidataBackup.push(ComponentsData)
                    setmaidataBackup(ComponentsData)
                    setData(ComponentsData);
                    showProgressHide();


                }
                else if (spRequest.readyState === 4 && spRequest.status !== 200) {
                    console.log('Error Occurred !');
                }

            },
                spRequest.send();
        }


        RetrieveSPData();



        $.each(data, function (index: any, item) {
            $.each(state, function (index: any, select) {
                if (item.Portfolio_x0020_Type == select.Title) {
                    select.Selected = true;

                }
                if (item.Id == select.Id) {
                    select.Selected = true;

                }

            })

        })
    }, [])
    function Buttonclick(e: any) {
        e.preventDefault();
        this.setState({ callchildcomponent: true });

    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }
    const closeModal = () => {
        setAddModalOpen(false)
    }


    const Prints = () => {
        window.print();
    }
    // ---------------------Export to Excel-------------------------------------------------------------------------------------

    const getCsvData = () => {
        const csvData = [['Title']];
        let i;
        for (i = 0; i < data.length; i += 1) {
            csvData.push([`${data[i].Title}`]);
        }
        return csvData;
    };
    const clearSearch = () => {
        setSearch('')

    }

    const openEditPopup = () => {
        setEditpopup(true)
    }
    const EditpopupClose = () => {
        setEditpopup(false)
    }
    var showProgressBar = () => {


        $(' #SpfxProgressbar').show();
    }
    var showProgressHide = () => {

        $(' #SpfxProgressbar').hide();
    }

    //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------

    const EditData = (e: any, Id: any) => {
        var spRequest = new XMLHttpRequest();
        spRequest.open('GET', "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items?$select=Id,Title&$filter= Id eq '" + Id + "'", true);
        spRequest.setRequestHeader("Accept", "application/json");

        spRequest.onreadystatechange = function () {

            if (spRequest.readyState === 4 && spRequest.status === 200) {
                var result = JSON.parse(spRequest.responseText);

                // setTitle(result.value[0].Title)


            }
            else if (spRequest.readyState === 4 && spRequest.status !== 200) {
                console.log('Error Occurred !');
            }
            openModal();
            AddItem();
        };
        spRequest.send();
    }



    const handleTitle = (e: any) => {
        setTitle(e.target.value)

    };
    function AddItem() {
        var MyData = JSON.stringify({
            '__metadata': {
                'type': 'SP.Data.Master_x0020_TasksListItem'
            },
            "Title": Title,
            "Item_x0020_Type": itemType,
            "Portfolio_x0020_Type": 'Component'
        })
        $.ajax({
            url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/contextinfo",
            type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose"
            },
            success: function (contextData: any) {
                $.ajax({
                    url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items",
                    method: "POST",
                    contentType: "application/json;odata=verbose",
                    data: MyData,
                    async: false,
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": contextData.d.GetContextWebInformation.FormDigestValue,
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "POST"
                    },
                    success: function (data: any) {
                        alert('success');
                        setModalIsOpenToFalse();
                        window.location.reload();
                    },
                    error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                        alert('error');
                    }
                });
            },
            error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                alert('error');
            }
        });


    }


    // React.useEffect(()=>{
    //     eventBus.on("Successful", (data:any) =>
    //     setPassData({data:selected2)
    //   );
    // },[])
    return (
        <div className="app">
            {/* {arr.map(function(item:any){
            return(
                <>
                <h4>{item.Group}</h4>
                </>
            )
        })} */}
            {/* ---------------------------------------Editpopup------------------------------------------------------------------------------------------------------- */}
            <Modal
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false} >
                <div className='modal-dialog modal-lg'>
                    <form>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'><span>Add Item</span></h5>
                                <button type="button" className='btn btn-danger pull-right' onClick={setModalIsOpenToFalse}>Cancel</button>
                            </div>
                            <div className='modal-body clearfix bg-f5f5'>
                                <div className="col-sm-12 tab-content">
                                    <div className="col-md-5">
                                        <div className="row">
                                            <div className="col-sm-4 mb-10 pad0" title="Task Name">
                                                <label>Title</label>
                                                <input type="text" className="form-control" placeholder="Task Name"
                                                    value={Title} onChange={handleTitle} />
                                            </div>
                                            <div className="col-sm-4 mb-10 Doc-align padR0">
                                                <label className="full_width">ItemRank
                                                </label>
                                                <select className="form-control" value="2">
                                                    <option value="">Select Item Rank</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>


                                            </div>
                                            <div className="col-4 mb-10">
                                                <label>Item Type</label>
                                                <select value={itemType} onChange={(e: any) => setitemType(e.target.value)}>
                                                    <option>Component</option>
                                                    <option>Feature</option>
                                                    <option>SubComponent</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">

                                            <div className="col-sm-6 pad0">
                                                <div ng-show="Item.Portfolio_x0020_Type=='Service'"
                                                    className="col-sm-12 mb-10 Doc-align padL-0">
                                                    <div className="col-sm-11 PadR0 Doc-align">
                                                        <label>
                                                            Component Portfolio
                                                            <span data-toggle="popover" data-placement="right"
                                                                data-trigger="hover"
                                                                data-content="Click to activate auto suggest for components/services"
                                                                data-original-title="Click to activate auto suggest for components/services"
                                                                title="Click to activate auto suggest for components/services">

                                                            </span>

                                                        </label>
                                                        <input type="text" className="form-control ui-autocomplete-input"
                                                            id="txtSharewebComponent" ng-model="SearchComponent"
                                                        /><span role="status" aria-live="polite"
                                                            className="ui-helper-hidden-accessible"></span>
                                                    </div>
                                                    <div className="col-sm-1 no-padding">
                                                        <label className="full_width">&nbsp;</label>
                                                        <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/edititem.gif"
                                                            ng-click="EditComponent('Components',item)" />
                                                    </div>

                                                </div>
                                                <div ng-show="Item.Portfolio_x0020_Type=='Component'"
                                                    className="col-sm-12 padL-0">
                                                    <div className="col-sm-11 pad0 Doc-align">

                                                        <label>
                                                            Service Portfolio
                                                            <span data-toggle="popover" data-placement="right"
                                                                data-trigger="hover"
                                                                data-content="Click to activate auto suggest for components/services"
                                                                data-original-title="Click to activate auto suggest for components/services"
                                                                title="Click to activate auto suggest for components/services">

                                                            </span>

                                                        </label>
                                                        <input type="text" className="form-control ui-autocomplete-input"
                                                            id="txtServiceSharewebComponent" ng-model="SearchService"
                                                        /><span role="status" aria-live="polite"
                                                            className="ui-helper-hidden-accessible"></span>
                                                    </div>
                                                    <div className="col-sm-1 no-padding">
                                                        <label className="full_width">&nbsp;</label>

                                                    </div>

                                                </div>

                                            </div>
                                            <div className="col-sm-6 padR0">
                                                <label>Deliverable-Synonyms </label>
                                                <input type="text" className="form-control ui-autocomplete-input"
                                                    id="txtDeliverable_x002d_Synonyms"
                                                    ng-model="Item.Deliverable_x002d_Synonyms" /><span
                                                        role="status" aria-live="polite"
                                                        className="ui-helper-hidden-accessible"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='modal-footer mt-3'>
                    <button type="button" className="btn btn-primary m-2" onClick={AddItem}>Save</button>
                    <button type="button" className="btn btn-danger" onClick={setModalIsOpenToFalse}>Cancel</button>
                </div>
            </Modal>
            {/* ------------------------Add Popup------------------------------------------------------------------------------------------------------------------------------ */}

            <Modal
                isOpen={addModalOpen}
                onDismiss={closeModal}
                isBlocking={false}>
                <div className='modal-dialog modal-lg'>
                    <div className='modal-header'>
                        <h5 className='modal-title'><span>Add Component</span></h5>
                        <button type="button" className='btn btn-danger pull-right' onClick={closeModal}>Cancel</button>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 mb-10" title="Task Name">
                            <label>Title</label>
                            <input type="text" className="form-control" placeholder="Task Name"
                                ng-required="true" />
                        </div>
                    </div>
                </div>
                <div className='modal-footer mt-3'>
                    <button type="button" className="btn btn-primary m-2" disabled={true}> Create & Open Popup</button>
                    <button type="button" className="btn btn-primary" disabled={true} onClick={closeModal}>Create</button>
                </div>
            </Modal>
            {/* -----------------------------------------end-------------------------------------------------------------------------------------------------------------------------------------- */}
            <div className="col-sm-12 padL-0 PadR0">
                <h2 className="alignmentitle ng-binding">
                    Component Portfolio
                    <span className="icontype display_hide padLR">
                    </span>

                </h2>
            </div>
            <div className="col-sm-12 padL-0 PadR0">
                <section className="ContentSection">
                    <div className="bg-f5f5 bdrbox pad10 clearfix">
                        <div className="togglebox">
                            <label className="toggler full_width mb-10">
                                <span className="pull-left">
                                    <img className="hreflink wid22" ng-show="pagesType=='componentportfolio'"
                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png" />
                                    SmartSearch –
                                </span>
                                <span className="ml20">
                                    <span ng-repeat="obj in ShowSelectdSmartfilter">Sites<span
                                        className="font-normal">(14)</span><span
                                            ng-if="$index != (ShowSelectdSmartfilter.length -1)"> | </span> </span>
                                </span>
                                <span className="pull-right">
                                    <img className="icon-sites-img  wid22 ml5" ng-show="pagesType=='componentportfolio'"
                                        title="Share SmartFilters selection" ng-click="GenerateUrl()"
                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Blue.png" />
                                </span>
                                <span className="pull-right">
                                    <span className="hreflink" ng-if="!smartfilter2.expanded">
                                        <img ng-show="pagesType=='componentportfolio'" className="hreflink wid22"
                                            ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New.png" />
                                    </span>
                                </span>
                            </label>
                            <div className="togglecontent">
                                <div className="col-sm-12 pad0">
                                    <table width="100%" className="indicator_search">
                                        <tr>
                                            {filterGroups.map(function (item) {
                                                return (
                                                    <>

                                                        <td valign="top">
                                                            <fieldset>
                                                                <legend>{item != 'teamSites' && <span>{item}</span>}</legend>
                                                                <legend>{item == 'teamSites' && <span>Sites</span>}</legend>
                                                            </fieldset>
                                                            {filterItems.map(function (ItemType, index) {
                                                                return (
                                                                    <>
                                                                        <div style={{ display: "block" }}> {ItemType.Group == item &&
                                                                            <>
                                                                                <span className="plus-icon hreflink" onClick={() => handleOpen2(ItemType)}>
                                                                                    {ItemType.childs.length > 0 &&
                                                                                        <a className='hreflink'
                                                                                            title="Tap to expand the childs">
                                                                                            {ItemType.showItem ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}

                                                                                        </a>}
                                                                                </span>
                                                                                {ItemType.TaxType != 'Status' &&
                                                                                    <span className="ml-1">


                                                                                        <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />

                                                                                        <span className="ml-2">
                                                                                            {ItemType.Title}

                                                                                        </span>

                                                                                    </span>
                                                                                }
                                                                                {ItemType.TaxType == 'Status' &&
                                                                                    <span className="ml-2">


                                                                                        <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                                        <span className="ml-2">
                                                                                            {ItemType.Title}

                                                                                        </span>

                                                                                    </span>
                                                                                }
                                                                                <ul id="id_{ItemType.Id}"
                                                                                    className="subfilter width-85">
                                                                                    <span>
                                                                                        {ItemType.show && (
                                                                                            <>
                                                                                                {ItemType.childs.map(function (child1: any, index: any) {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div style={{ display: "block" }}>
                                                                                                                {child1.childs.length > 0 && !child1.expanded &&
                                                                                                                    <span className="plus-icon hreflink"
                                                                                                                        ng-click="loadMoreFilters(child1);">
                                                                                                                        <img
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                                                                                    </span>
                                                                                                                }
                                                                                                                {child1.childs.length > 0 && child1.expanded &&
                                                                                                                    <span className="plus-icon hreflink"
                                                                                                                        ng-click="loadMoreFilters(child1);">
                                                                                                                        <img
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                                    </span>
                                                                                                                }
                                                                                                                <input type="checkbox" className="icon-input mr0" ng-model="child1.Selected"
                                                                                                                    onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child1.Title}

                                                                                                                <ul id="id_{{child1.Id}}" style={{ display: "none" }} className="subfilter"
                                                                                                                >
                                                                                                                    {child1.childs.map(function (child2: any) {
                                                                                                                        <li>
                                                                                                                            <input type="checkbox"

                                                                                                                                ng-model="child2.Selected"
                                                                                                                                onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child2.Title}
                                                                                                                        </li>
                                                                                                                    })}
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )

                                                                                                })}
                                                                                            </>
                                                                                        )}
                                                                                    </span>
                                                                                </ul>

                                                                            </>

                                                                        }
                                                                        </div>
                                                                    </>
                                                                )
                                                            })}

                                                        </td>

                                                    </>
                                                )
                                            })}


                                        </tr>
                                    </table>
                                </div>
                                <div className="pull-right">

                                    <button type="button" className="btn btn-primary"
                                        title="Smart Filter" onClick={() => Updateitem()}>
                                        Update
                                    </button>
                                    <button type="button" className="btn btn-grey ml5" title="Clear All"
                                        onClick={() => Clearitem()} >
                                        Clear All
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </section>
            </div>
            <section className="TableContentSection">
                <div className="container-fluid">
                    <section className="TableSection">
                        <div className="container pad0">
                            <div className="Alltable mt-10">
                                <div className="tbl-headings">
                                    <span className="leftsec w65">
                                        <label>
                                            Showing {ComponentsData.length} of {ComponentsData.length} Components
                                        </label>
                                        <label> | </label>
                                        <label>
                                            {SubComponentsData.length} of {SubComponentsData.length} SubComponents
                                        </label>
                                        <label> | </label>
                                        <label>
                                            {FeatureData.length} of {FeatureData.length} Features
                                        </label>
                                        <span className="g-search">
                                            <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all" />
                                            <span className="gsearch-btn" ><i><FaSearch /></i></span>
                                        </span>
                                        <span>
                                            <select className="ml2 searchbox_height">
                                                <option value="All Words">All Words</option>
                                                <option value="Any Words">Any Words</option>
                                                <option value="Exact Phrase">Exact Phrase</option>

                                            </select>
                                        </span>
                                    </span>
                                    <span className="toolbox mx-auto">
                                        <button type="button" className="btn btn-primary"
                                            ng-disabled="(isOwner!=true) || ( SelectedTasks.length > 0 || compareComponents[0].Item_x0020_Type =='Feature') "
                                            onClick={addModal} title=" Add Structure">
                                            Add Structure
                                        </button>

                                        <button type="button"
                                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                                            ng-click="openActivity()"
                                            disabled={true}>

                                            <MdAdd />
                                            Add Activity-Task
                                        </button>


                                        <button type="button"
                                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                                            ng-click="openRestructure()"
                                            disabled={true}>
                                            Restructure
                                        </button>
                                        <a onClick={Prints}>
                                            <i className="print"><FaPrint /></i>
                                        </a>
                                        <a>
                                            <CSVLink data={getCsvData()} >
                                                <i className="excal"><FaFileExcel /></i>
                                            </CSVLink>
                                        </a>
                                        <a onClick={clearSearch}>
                                            <i className="brush"><FaPaintBrush /></i>
                                        </a>
                                        {/* <span>
                                        <ExpandTable/>
                                        </span> */}
                                    </span>
                                </div>
                                <div className="col-sm-12 pad0 smart">
                                    <div className="section-event">
                                        <div className="wrapper">
                                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "2%" }}>
                                                            <div></div>
                                                        </th>

                                                        {/* <th style={{ width: "2%" }}></th> */}
                                                        <th style={{ width: "7%" }}>
                                                            <div>Id</div>
                                                        </th>
                                                        <th style={{ width: "20%" }}>
                                                            <div style={{ width: "19%" }} className="smart-relative">
                                                                <input type="search" placeholder="Title" className="full_width searchbox_height" onChange={handleChange} />

                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>


                                                            </div>
                                                        </th>
                                                        <th style={{ width: "18%" }}>
                                                            <div style={{ width: "17%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    onChange={handleChange} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "20%" }}>
                                                            <div style={{ width: "19%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    onChange={handleChange} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>
                                                            <div style={{ width: "9%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Status"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    onChange={handleChange} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>
                                                            <div style={{ width: "9%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Item Rank"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    onChange={handleChange} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>
                                                            <div style={{ width: "9%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Due"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    onChange={handleChange} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "3%" }}></th>
                                                        {/* <th style={{ width: "2%" }}></th>
                                                        <th style={{ width: "2%" }}></th>
                                                        <th style={{ width: "2%" }}></th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <div id="SpfxProgressbar" style={{ display: "none" }}>
                                                        <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                                    </div>
                                                    {data && data.map(function (item, index) {
                                                        if (search == "" || item.Title.toLowerCase().includes(search.toLowerCase())) {
                                                            return (
                                                                <>
                                                                    <tr >
                                                                        <td className="pad0" colSpan={9}>
                                                                            <table className="table" style={{ width: "100%" }}>
                                                                                <tr className="bold for-c0l">

                                                                                    <td style={{ width: "2%" }}>
                                                                                        <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                                                            {item.Child != undefined &&
                                                                                                <a className='hreflink'
                                                                                                    title="Tap to expand the childs">
                                                                                                    <div className="sign">{item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                                    </div>
                                                                                                </a>
                                                                                            }
                                                                                        </div>

                                                                                    </td>

                                                                                    <td style={{ width: "7%" }}>
                                                                                        <div className="">
                                                                                            <span>
                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                    <img className="icon-sites-img"
                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />
                                                                                                </a>
                                                                                            </span>
                                                                                            <span className="ml-2">{item.PortfolioStructureID}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    {/* <td style={{ width: "6%" }}></td> */}
                                                                                    <td style={{ width: "20%" }}>
                                                                                        <a className="hreflink serviceColor_Active" target="_blank"
                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item.Id}
                                                                                        >{item.Title}
                                                                                        </a>
                                                                                        {item.Child != undefined &&
                                                                                            <span>({item.Child.length})</span>
                                                                                        }

                                                                                        {item.Short_x0020_Description_x0020_On != null &&
                                                                                            <span className="project-tool"><img
                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                    <span className="tooltiptext">
                                                                                                        <div className="tooltip_Desc">
                                                                                                            <span>{item.Short_x0020_Description_x0020_On}</span>
                                                                                                        </div>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </span>
                                                                                        }
                                                                                    </td>
                                                                                    <td style={{ width: "18%" }}>
                                                                                        <div>
                                                                                            {item.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                return (
                                                                                                    <span className="ClientCategory-Usericon"
                                                                                                        title={client.Title}>
                                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                    </span>
                                                                                                )
                                                                                            })}</div>
                                                                                    </td>
                                                                                    <td style={{ width: "20%" }}>
                                                                                        <div>{item.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                            return (
                                                                                                <span className="ClientCategory-Usericon"
                                                                                                    title={client1.Title}>

                                                                                                    <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                </span>
                                                                                            )
                                                                                        })}</div></td>
                                                                                    <td style={{ width: "10%" }}>{item.PercentComplete}</td>
                                                                                    <td style={{ width: "10%" }}>{item.ItemRank}</td>
                                                                                    <td style={{ width: "10%" }}>{item.DueDate}</td>
                                                                                    {/* <td style={{ width: "3%" }}></td> */}
                                                                                    <td style={{ width: "3%" }}><a onClick={setModalIsOpenToTrue}><FaEdit /></a></td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>


                                                                    </tr>
                                                                    {item.show && (
                                                                        <>
                                                                            {item.Child.map(function (childitem: any) {

                                                                                return (

                                                                                    <>
                                                                                        <tr >
                                                                                            <td className="pad0" colSpan={9}>
                                                                                                <table className="table" style={{ width: "100%" }}>
                                                                                                    <tr className="for-c02">
                                                                                                        <td style={{ width: "2%" }}>
                                                                                                            <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                                {childitem.Child.length > 0 &&
                                                                                                                    <a className='hreflink'
                                                                                                                        title="Tap to expand the childs">
                                                                                                                        <div className="sign">{childitem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                                            : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                                                        </div>
                                                                                                                    </a>
                                                                                                                }

                                                                                                            </div>
                                                                                                        </td>
                                                                                                        {/* <td style={{ width: "2%" }}></td> */}
                                                                                                        <td style={{ width: "7%" }}>  <div className="d-flex">
                                                                                                            <span>

                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                    <img className="icon-sites-img"
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png" />
                                                                                                                </a>

                                                                                                            </span>
                                                                                                            <span className="ml-2">{childitem.PortfolioStructureID}</span>
                                                                                                        </div>
                                                                                                        </td>

                                                                                                        <td style={{ width: "20%" }}>
                                                                                                            <a className="hreflink serviceColor_Active" target="_blank"
                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                            >{childitem.Title}
                                                                                                            </a>
                                                                                                            {childitem.Child.length > 0 &&
                                                                                                                <span>({childitem.Child.length})</span>
                                                                                                            }

                                                                                                            {childitem.Short_x0020_Description_x0020_On != null &&
                                                                                                                <span className="project-tool"><img
                                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                        <span className="tooltiptext">
                                                                                                                            <div className="tooltip_Desc">
                                                                                                                                <span>{childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                                            </div>
                                                                                                                        </span>
                                                                                                                    </span>
                                                                                                                </span>
                                                                                                            }
                                                                                                        </td>
                                                                                                        <td style={{ width: "18%" }}>
                                                                                                            <div>
                                                                                                                {childitem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                    return (
                                                                                                                        <span className="ClientCategory-Usericon"
                                                                                                                            title={client.Title}>
                                                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                        </span>
                                                                                                                    )
                                                                                                                })}</div>
                                                                                                        </td>
                                                                                                        <td style={{ width: "20%" }}>
                                                                                                            <div>{childitem.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                return (
                                                                                                                    <div className="ClientCategory-Usericon"
                                                                                                                        title={client1.Title}>

                                                                                                                        <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                                    </div>
                                                                                                                )
                                                                                                            })}</div></td>
                                                                                                        <td style={{ width: "10%" }}>{childitem.PercentComplete}</td>
                                                                                                        <td style={{ width: "10%" }}>{childitem.ItemRank}</td>
                                                                                                        <td style={{ width: "10%" }}>{childitem.DueDate}</td>

                                                                                                        <td style={{ width: "3%" }}><a onClick={setModalIsOpenToTrue}><FaEdit /></a></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>

                                                                                        {childitem.show && (
                                                                                            <>
                                                                                                {childitem.Child.map(function (childinew: any) {
                                                                                                    return (
                                                                                                        <tr >
                                                                                                            <td className="pad0" colSpan={10}>
                                                                                                                <table className="table" style={{ width: "100%" }}>
                                                                                                                    <tr className="tdrow">
                                                                                                                        <td style={{ width: "2%" }}>
                                                                                                                            {/* <div className="accordian-header" onClick={() => handleOpen(childinew)}>
                                                                                                                        <a className='hreflink' onClick={(e) => this.EditData(e, item)}
                                                                                                                            title="Tap to expand the childs">
                                                                                                                            <div className="sign">{show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                                                : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                                                            </div>
                                                                                                                        </a>

                                                                                                                    </div> */}
                                                                                                                        </td>


                                                                                                                        <td style={{ width: "7%" }}> <div className="d-flex">
                                                                                                                            <span>

                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                    <img className="icon-sites-img"
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png" />
                                                                                                                                </a>

                                                                                                                            </span>
                                                                                                                            <span className="ml-2">{childinew.PortfolioStructureID}</span>
                                                                                                                        </div>
                                                                                                                        </td>

                                                                                                                        <td style={{ width: "20%" }}>

                                                                                                                            <a className="hreflink serviceColor_Active" target="_blank"
                                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childinew.Id}
                                                                                                                            >{childinew.Title}
                                                                                                                            </a>
                                                                                                                            {childinew.Child.length > 0 &&
                                                                                                                                <span>({childinew.Child.length})</span>
                                                                                                                            }

                                                                                                                            {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                                <span className="project-tool"><img
                                                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                        <span className="tooltiptext">
                                                                                                                                            <div className="tooltip_Desc">
                                                                                                                                                <span>{childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                                            </div>
                                                                                                                                        </span>
                                                                                                                                    </span>
                                                                                                                                </span>
                                                                                                                            }
                                                                                                                        </td>
                                                                                                                        <td style={{ width: "18%" }}>
                                                                                                                            <div>
                                                                                                                                {childinew.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                    return (
                                                                                                                                        <span className="ClientCategory-Usericon"
                                                                                                                                            title={client.Title}>
                                                                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                        </span>
                                                                                                                                    )
                                                                                                                                })}</div>
                                                                                                                        </td>
                                                                                                                        <td style={{ width: "20%" }}>
                                                                                                                            <div>{childinew.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                                return (
                                                                                                                                    <span className="ClientCategory-Usericon"
                                                                                                                                        title={client1.Title}>

                                                                                                                                        <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                                                    </span>
                                                                                                                                )
                                                                                                                            })}</div></td>
                                                                                                                        <td style={{ width: "10%" }}>{childinew.PercentComplete}</td>
                                                                                                                        <td style={{ width: "10%" }}>{childinew.ItemRank}</td>
                                                                                                                        <td style={{ width: "10%" }}>{childinew.DueDate}</td>

                                                                                                                        <td style={{ width: "3%" }}><a onClick={setModalIsOpenToTrue}><FaEdit /></a></td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                })}</>
                                                                                        )}</>
                                                                                )
                                                                            })}
                                                                        </>
                                                                    )}
                                                                </>


                                                            )
                                                        }
                                                    })}



                                                </tbody>



                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div></section>
                </div></section>
        </div>
    );
}
export default Groupby;
function RetrieveSPData() {
    throw new Error("Function not implemented.");
}


function openModal(): React.MouseEventHandler<HTMLAnchorElement> {
    throw new Error("Function not implemented.");
}

