import * as React from 'react';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from '../../../globalComponents/TeamConfiguration/TeamConfiguration';
import FroalaImageUploadComponent from '../../../globalComponents/FlorarComponents/FlorarImageUploadComponent';
import FroalaCommentBox from '../../../globalComponents/FlorarComponents/FroalaCommentBoxComponent';

//import "bootstrap/dist/css/bootstrap.min.css";

const CreateActivity = (props: any) => {
    var AllItems = props.props
    console.log(props)
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(true);
    const [siteTypess, setSiteType] = React.useState([]);
    const [Categories, setCategories] = React.useState([]);
    const [isActive, setIsActive] = React.useState({
        siteType: false,
        time: false,
        rank: false,
        dueDate: false,

    });
    const [save, setSave] = React.useState({ Title:'', siteType: '', linkedServices: [], recentClick: undefined, DueDate: undefined, taskCategory: ''})


    // const setModalIsOpenToTrue = () => {
    //     // e.preventDefault()
    //     setTaskStatuspopup(true)
    // }
    var CheckCategory: any = []
    CheckCategory.push({ "TaxType": "Categories", "Title": "Phone", "Id": 199, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Email Notification", "Id": 276, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Approval", "Id": 227, "ParentId": 225 },
        { "TaxType": "Categories", "Title": "Immediate", "Id": 228, "parentId": 225 });

    React.useEffect(() => {
        GetSmartMetadata()
    }, [])
    const GetSmartMetadata = async () => {
        var SitesTypes: any = [];
        var siteConfig = []
        var AllMetadata: any = []
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let MetaData = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
            .top(4999)
            .expand('Author,Editor')
            .get();
        AllMetadata = MetaData;
        siteConfig = getSmartMetadataItemsByTaxType(AllMetadata, 'Sites')
        siteConfig?.forEach((site: any) => {
            if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== 'Health' && site.Title !== 'Gender') {
                site.IscreateTask = false;
                SitesTypes.push(site);
            }
        })
        setSiteType(SitesTypes)
        //setModalIsOpenToTrue();
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems?.forEach((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });

        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    const setActiveTile = (item: keyof typeof save, isActiveItem: keyof typeof isActive, value: any) => {
        AllItems['SiteListItem'] = value.Title
        let saveItem = save;
        let isActiveData = isActive;
        if (value.IscreateTask == false || value.IscreateTask == undefined) {
            value.IscreateTask = true
        }
        getActivitiesDetails(value)
        if (save[item] !== value.Title) {
            saveItem[item] = value.Title;
            setSave(saveItem);
            if (isActive[isActiveItem] !== true) {
                isActiveData[isActiveItem] = true;
                setIsActive(isActiveData);
            }
        } else if (save[item] === value.Title) {
            saveItem[item] = '';
            setSave(saveItem);
            isActiveData[isActiveItem] = false;
            setIsActive(isActiveData);
        }
        // if (item === "dueDate") {
        //     DueDate(title)
        // }
        // if (item === "Time") {
        //     setTaskTime(title)
        // }
        setSave({ ...save, recentClick: isActiveItem })
    };
    const FlorarImageUploadComponentCallBack =()=>{
        console.log('Worrking')
    }
    var LatestTaskNumber: any = ''
    var SharewebID: any = ''
    const getActivitiesDetails = async (item: any) => {
        console.log(item)
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(item.listId)
            .items
            .select("FolderID,Shareweb_x0020_ID,SharewebTaskLevel1No,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,Title,Id,Priority_x0020_Rank,PercentComplete,StartDate,DueDate,Status,Body,PercentComplete,Attachments,Priority,Created,Modified,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,ParentTask/Id,ParentTask/Title,ParentTask/Shareweb_x0020_ID,Author/Id,Author/Title,Editor/Id,Editor/Title")
            .expand("SharewebTaskType,ParentTask,AssignedTo,AttachmentFiles,Author,Editor")
            .filter("SharewebTaskType/Title eq 'Activities'")
            .orderBy("SharewebTaskLevel1No", false)
            .top(4999)
            .get()
        console.log(componentDetails)
        if (componentDetails.length == 0) {
            LatestTaskNumber = 1;
            item.LatestTaskNumber = LatestTaskNumber
        } else {
            LatestTaskNumber = componentDetails[0].SharewebTaskLevel1No;
            LatestTaskNumber += 1;
            item.LatestTaskNumber = LatestTaskNumber
        }
        if (AllItems != undefined) {
            if (AllItems.Portfolio_x0020_Type != undefined) {
                if (AllItems.Portfolio_x0020_Type == 'Component') {
                    SharewebID = 'CA' + LatestTaskNumber;
                }
                if (AllItems.Portfolio_x0020_Type == 'Service') {
                    SharewebID = 'SA' + LatestTaskNumber;
                }
                if (AllItems.Portfolio_x0020_Type == 'Events') {
                    SharewebID = 'EA' + LatestTaskNumber;
                }
            } else {
                SharewebID = 'A' + LatestTaskNumber;
            }
            item.SharewebID = SharewebID
        }
    }
    const closeTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(false)
        props.Call();

    }
    const HtmlEditorCallBack=()=>{
        console.log('Working')
    }
    const saveNoteCall = () => {
        var CategoryID:any=[]
        // CategoriesData.map((category)=> {
        //     if (category.Id != undefined) {
        //         CategoryID.push(category.Id)
        //     }
        // })
        if (AllItems.Title == undefined) {
            alert("Enter The Task Name");
        }
        else if (AllItems.SiteListItem == undefined) {
            alert("Select Task List.");
        }

        else {
            siteTypess.forEach(async (value: any) => {
                if (value.IscreateTask == true) {
                    if (AllItems.NoteCall == 'Activities') {
                        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                        await web.lists.getById(value.listId).items.add({
                            Title: save.Title != undefined && save.Title != ''?save.Title:AllItems.Title,
                            SharewebTaskTypeId: 1,
                            Shareweb_x0020_ID: value.SharewebID,
                            SharewebTaskLevel1No: value.LatestTaskNumber
                            
                        }).then((res: any) => {
                            console.log(res);
                            closeTaskStatusUpdatePoup();
                            props.LoadAllSiteTasks();

                        })
                    }

                }
            })
       
}

    }
    const DDComponentCallBack = (dt: any) => {
      //  setTeamConfig(dt)
      //  setisDropItem(dt.isDrop)
       // setisDropItemRes(dt.isDropRes)
        console.log(dt)
        // if (dt?.AssignedTo?.length > 0) {
        //     let tempArray: any = [];
        //     dt.AssignedTo?.map((arrayData: any) => {
        //         if (arrayData.AssingedToUser != null) {
        //             tempArray.push(arrayData.AssingedToUser)
        //         } else {
        //             tempArray.push(arrayData);
        //         }
        //     })
        //     setTaskAssignedTo(tempArray);
        //     console.log("Team Config  assigadf=====", tempArray)
        // }
        // if (dt?.TeamMemberUsers?.length > 0) {
        //     let tempArray: any = [];
        //     dt.TeamMemberUsers?.map((arrayData: any) => {
        //         if (arrayData.AssingedToUser != null) {
        //             tempArray.push(arrayData.AssingedToUser)
        //         } else {
        //             tempArray.push(arrayData);
        //         }
        //     })
        //     setTaskTeamMembers(tempArray);
        //     console.log("Team Config member=====", tempArray)

        // }
        // if (dt.ResponsibleTeam != undefined && dt.ResponsibleTeam.length > 0) {
        //     let tempArray: any = [];
        //     dt.ResponsibleTeam?.map((arrayData: any) => {
        //         if (arrayData.AssingedToUser != null) {
        //             tempArray.push(arrayData.AssingedToUser)
        //         } else {
        //             tempArray.push(arrayData);
        //         }
        //     })
        //     setTaskResponsibleTeam(tempArray);
        //     console.log("Team Config reasponsible ===== ", tempArray)

        // }
        // else{
        //     setTaskResponsibleTeam([])
        // }
    }
    return (
        <>
            <Panel
                headerText="Create Quick Option - Activity"
                type={PanelType.custom}
                customWidth="1348px"
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={false}
            >
                <div className="modal-body">

                    <div className='row mt-2 border Create-taskpage'>
                        <fieldset>
                            <legend className="border-bottom fs-6 ">Sites</legend>
                            <ul className="quick-actions">
                                {siteTypess.map(function (item: any) {
                                    return (
                                        <>
                                            {(item.Title !== undefined && item.Title !== 'Offshore Tasks' && item.Title !== 'Master Tasks' && item.Title !== 'DRR' && item.Title !== 'SDC Sites' && item.Title !== 'QA') &&
                                                <>
                                                    <li
                                                        className={isActive.siteType && save.siteType === item.Title ? '  mx-1 p-2 bg-siteColor selectedTaskList text-center mb-2 position-relative' : "mx-1 p-2 position-relative bg-siteColor text-center  mb-2"} onClick={() => setActiveTile("siteType", "siteType", item)} >
                                                        {/*  */}
                                                        <a className='text-white text-decoration-none' >
                                                            <span className="icon-sites">
                                                                <img className="icon-sites"
                                                                    src={item.Item_x005F_x0020_Cover.Url} />
                                                            </span>{item.Title}
                                                        </a>
                                                    </li>
                                                </>
                                            }
                                        </>)
                                })}
                            </ul>
                        </fieldset>
                    </div>
                    <div className='row'>
                        <div className='col-sm-10'>
                            <div className="row">
                                <div className="col-sm-10 mb-10">
                                    <label className="full_width">
                                        Task Name <a id='siteName'
                                            ng-click="countClick==0?AddPlaceHolder():Test()">Site Name</a>
                                    </label>
                                    <input className="form-control" type="text" ng-required="true" placeholder="Enter Task Name"
                                        defaultValue={AllItems.Title} onChange={(e) => setSave({ ...save, Title: e.target.value })}/>

                                </div>
                                <div className="col-sm-2 mb-10 padL-0">
                                    <label>Due Date</label>
                                    <input type="text" id="dueDatePicker" placeholder="DD/MM/YYYY"
                                        className="form-control" value={AllItems.DueDate} />
                                </div>
                                <div className='row mt-2'>
                                   
                                    <TeamConfigurationCard ItemInfo={AllItems} parentCallback={DDComponentCallBack}></TeamConfigurationCard>
                                    
                                </div>
                                <div className='row'>
                                    <div className='col-sm-5'>
                                        <FroalaImageUploadComponent callBack={FlorarImageUploadComponentCallBack}/>
                                    </div>
                                    <div className='col-sm-7'>
                                    <FroalaCommentBox
                                        EditorValue={AllItems.Title != undefined ? AllItems.Title : ''}
                                        callBack={HtmlEditorCallBack}
                                    >
                                    </FroalaCommentBox>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-2'>
                            {AllItems.Portfolio_x0020_Type == 'Component'
                                &&
                                <div className="col-sm-12 padL-0 PadR0">
                                    <div ng-show="smartComponent.length==0" className="col-sm-11 mb-10 padL-0">
                                        <label ng-show="!IsShowComSerBoth" className="full_width">Component</label>
                                        <input type="text" className="ui-autocomplete-input" id="txtSharewebComponentcrt"
                                        /><span role="status" aria-live="polite"
                                            className="ui-helper-hidden-accessible"></span>
                                    </div>
                                    <div className="col-sm-12 padL-0 PadR0">
                                        <div className="col-sm-12  top-assign  mb-10 padL-0 PadR0">

                                            <div className=" col-sm-11 block" ng-mouseover="HoverIn(item);"
                                                ng-mouseleave="ComponentTitle.STRING='';" title="{{ComponentTitle.STRING}}"
                                            >

                                                <a className="hreflink" target="_blank"
                                                    ng-href="{{CuurentSiteUrl}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}">{AllItems.Title}</a>
                                                <a className="hreflink" ng-click="removeSmartComponent(item.Id)">
                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" />
                                                </a>
                                            </div>
                                            <span ng-show="smartComponent.length!=0" className="col-sm-1">
                                                <a className="hreflink" title="Edit Component" data-toggle="modal"
                                                    ng-click="EditComponent('Components',Item.SharewebComponent)">

                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png" />
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>}
                            <div className="col-sm-12 padL-0 Prioritytp PadR0 mt-2">
                                <fieldset>
                                    <label>Priority</label>
                                    <input type="text" className="" placeholder="Priority" ng-model="PriorityRank"
                                        ng-change="getpriority()" />
                                    <div className="mt-2">
                                        <label>
                                            <input style={{ margin: "-1px 2px 0" }} className="form-check-input" name="radioPriority"
                                                type="radio" value="(1) High" ng-click="SelectPriority()"
                                                ng-model="Priority" />High
                                        </label>
                                    </div>
                                    <div className="">
                                        <label>
                                            <input style={{ margin: "-1px 2px 0" }} className="form-check-input" name="radioPriority"
                                                type="radio" value="(2) Normal" ng-click="SelectPriority()"
                                                ng-model="Priority" />Normal
                                        </label>
                                    </div>
                                    <div className="">
                                        <label>
                                            <input style={{ margin: "-1px 2px 0" }} className="form-check-input" name="radioPriority"
                                                type="radio" value="(3) Low" ng-click="SelectPriority()" ng-model="Priority" />Low
                                        </label>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="row mt-2">
                                <div className="col-sm-12">
                                    <div className="col-sm-11 padding-0">
                                        <label>Categories</label>
                                        <input type="text" className="ui-autocomplete-input" id="txtCategories" />
                                    </div>
                                    <div className="col-sm-1 no-padding">

                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png"
                                            ng-click="openSmartTaxonomyPopup('Categories', Item.SharewebCategories);" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mt-2">
                                    {CheckCategory.map((item: any) => {
                                        return (
                                            <>
                                                <div
                                                    className="col-sm-12 padL-0 checkbox">
                                                    <input type="checkbox"
                                                        ng-click="selectRootLevelTerm(item)" />
                                                    <span style={{ marginLeft: "20px" }}> {item.Title}</span>
                                                </div>
                                            </>
                                        )
                                    })}
                                </div>


                            </div>
                        </div>

                    </div>

                </div>


                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={() => saveNoteCall()}>
                        Submit
                    </button>

                </div>

            </Panel>

        </>
    )
}

export default CreateActivity;