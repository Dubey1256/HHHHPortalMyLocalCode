import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Web } from "sp-pnp-js";
import pnp, { PermissionKind } from "sp-pnp-js";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import './style.scss'
var AllMetadata: any = []
var siteConfig: any = []
var SitesTypes: any = []



const CreateTaskCom = () => {
    const [siteType, setSiteType] = React.useState([])
    const [TaskTypes, setTaskTypes] = React.useState([])
    const [subCategory, setsubCategory] = React.useState([])
    const [priorityRank, setpriorityRank] = React.useState([])
    const [Timing, setTiming] = React.useState([])
    const [selectedsiteType, setSelectedsiteType] = React.useState({})
    const [isActiveSite, setIsActiveSite] = React.useState(false);
    const [isActiveCategory, setIsActiveCategory] = React.useState(false);
    const [isActivePriority, setIsActivePriority] = React.useState(false);
    const [IsActiveCategoryParent, setIsActiveCategoryParent] = React.useState(false);
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false)
    const [passdata, setpassdata] = React.useState('');
    const [isActiveTime, setIsActiveTime] = React.useState(false);
    const [taskUrl, setTaskUrl] = React.useState('');
    const [save, setSave] = React.useState({ siteType: '', taskCategory: '', taskCategoryParent: '', rank: undefined, Time: '', taskName: '', taskUrl: undefined, portfolioType: '' })
    React.useEffect(() => {
        GetSmartMetadata()
    }, [])
    const CallBack = React.useCallback(() => {
        setisOpenEditPopup(false)
    }, [])


    const GetSmartMetadata = async () => {
        var TaskTypes: any = []
        var Priority: any = []
        var Timing: any = []
        var subCategories: any = []
        var Task: any = []
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
        siteConfig.map((site: any) => {
            if (site.Title != undefined && site.Title != 'Foundation' && site.Title != 'Master Tasks' && site.Title != 'DRR' && site.Title != 'Health' && site.Title != 'Gender') {
                SitesTypes.push(site);
            }

        })
        setSiteType(SitesTypes)
        TaskTypes = getSmartMetadataItemsByTaxType(AllMetadata, 'Categories');
        Priority = getSmartMetadataItemsByTaxType(AllMetadata, 'Priority Rank');
        Timing = getSmartMetadataItemsByTaxType(AllMetadata, 'Timings');
        setTiming(Timing)
        setpriorityRank(Priority)
        TaskTypes.map((task: any) => {
            if (task.ParentID != undefined && task.ParentID == 0 && task.Title != 'Phone') {
                Task.push(task);
                getChilds(task, TaskTypes);
            }
            if (task.ParentID != undefined && task.ParentID != 0 && task.IsVisible) {
                subCategories.push(task);
            }

        })

        setsubCategory(subCategories)
        setTaskTypes(Task)
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        return Items;
    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        items.map((childItem: any) => {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }
    const savaData = () => {
        var data: any = {}
        data['taskName'] = save.taskName;
        data['taskUrl'] = save.taskUrl;
        data['siteType'] = save.siteType;
        data['taskCategory'] = save.taskCategory;
        data['taskCategoryParent'] = save.taskCategoryParent;
        data['priorityRank'] = save.rank;
        data['Time'] = save.Time;
        data['portfolioType'] = save.portfolioType;
        console.log(data)
    }
    const createTask = async () => {

        try {
            let selectedSite: any;
            let priority: any;
            if (save.siteType != undefined && save.siteType.length > 0) {
                siteType.map((site: any) => {
                    if (site.Title == save.siteType) {
                        selectedSite = site;
                    }
                })
                let priorityRank=4;
                if (save.rank == undefined || parseInt(save.rank) <= 0) {
                    setSave({ ...save, rank: 4 })
                    priority = '(2) Normal';
                }
                else {
                    priorityRank=parseInt(save.rank);
                    if (priorityRank >= 8 && priorityRank <= 10) {
                        priority = '(1) High';
                    }
                    if (priorityRank >= 4 && priorityRank <= 7) {
                        priority = '(2) Normal';
                    }
                    if (priorityRank >= 1 && priorityRank <= 3) {
                        priority = '(3) Low';
                    }
                }
                let web = new Web(selectedSite?.siteUrl?.Url);
                await web.lists.getById(selectedSite?.listId).items.add({
                    Title: save.taskName,
                    Priority_x0020_Rank: priorityRank,
                    Priority: priority,
                    PercentComplete: 0,
                    component_x0020_link: {
                        __metadata: { 'type': 'SP.FieldUrlValue' },
                        Description: taskUrl.length>0 ? taskUrl : null,
                        Url: taskUrl.length>0 ? taskUrl : null,
                    }

                }).then((data) => {
                    data.data.siteUrl = selectedSite?.siteUrl?.Url;
                    data.data.siteType = save.siteType;
                    data.data.siteUrl = selectedSite?.siteUrl?.Url;
                    window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-SPFx.aspx?taskId=" + data.data.Id + "&Site=" + save.siteType, "_self")

                })
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const EditPopup = React.useCallback((item: any) => {

        setpassdata(item)
        setisOpenEditPopup(true)

    }, [])

    const urlChange=(e:any)=>{
        setTaskUrl(e.target.value)
        UrlPasteTitle(e)
    }

    const UrlPasteTitle = (e: any) => {
        let selectedSiteTitle = ''
        var testarray = e.target.value.split('&');
        let TestUrl = e.target.value;
        // TestUrl = $scope.component_x0020_link;
        var item = '';
        if (TestUrl != undefined) {
            siteType.map((site: any) => {
                if (TestUrl.toLowerCase().indexOf('.com') > -1)
                    TestUrl = TestUrl.split('.com')[1];
                else if (TestUrl.toLowerCase().indexOf('.ch') > -1)
                    TestUrl = TestUrl.split('.ch')[1];
                else if (TestUrl.toLowerCase().indexOf('.de') > -1)
                    TestUrl = TestUrl.split('.de')[1];
                if (TestUrl != undefined && ((TestUrl.toLowerCase().indexOf('/eps/')) > -1) && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() == 'eps') {
                        item = site.Title == 'EPS' ? item = 'EPS' : site = site.Title;
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/ei/') > -1 || TestUrl.toLowerCase().indexOf('/ee/') > -1) && TestUrl.toLowerCase().indexOf('/digitaladministration/') <= -1 && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() == 'ei') {
                        item = site.Title == 'EI' ? item = 'EI' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/digitaladministration/') > -1) && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() == 'alakdigital') {
                        item = site.Title == 'ALAKDigital' ? item = 'ALAKDigital' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/migration/') > -1) && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() == 'migration') {
                        item = site.Title == 'Migration' ? item = 'MIGRATION' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/education/') > -1)) {
                    if (site.Title.toLowerCase() == 'education') {
                        item = site.Title == 'Education' ? item = 'Education' : site = site.Title;
                        // if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/gender/') > -1)) {
                    if (site.Title.toLowerCase() == 'gender') {
                        item = site.Title == 'Gender' ? item = 'Gender' : site = site.Title;
                        // if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/drr/') > -1)) {
                    if (site.Title.toLowerCase() == 'drr') {
                        item = site.Title == 'DRR' ? item = 'DRR' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/health') > -1)) {
                    if (site.Title.toLowerCase() == 'health') {
                        item = site.Title == 'Health' ? item = 'Health' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }

                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/development-effectiveness/')) > -1 && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() == 'de') {
                        item = site.Title == 'DE' ? item = 'DE' : site = site.Title;
                        // if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/qa/') > -1)) {
                    if (site.Title.toLowerCase() == 'qa') {
                        item = site.Title == 'QA' ? item = 'QA' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/shareweb') > -1)) {
                    if (site.Title.toLowerCase() == 'shareweb') {
                        item = site.Title == 'Shareweb' ? item = 'Shareweb' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/joint') > -1)) {
                    if (site.Title.toLowerCase() == 'shareweb') {
                        item = site.Title == 'Shareweb' ? item = 'Shareweb' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('www.gruene-washington.de') > -1)) {
                    if (site.Title.toLowerCase() == 'gruene') {
                        item = site.Title == 'Gruene' ? item = 'Gruene' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('kathabeck.sharepoint.com') > -1)) {
                    if (site.Title.toLowerCase() == 'kathabeck') {
                        item = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('hhhhteams.sharepoint.com') > -1) || (TestUrl.toLowerCase().indexOf('hhhh') > -1)) {
                    if (site.Title.toLowerCase() == 'hhhh') {
                        item = site.Title == 'HHHH' ? item = 'HHHH' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('hhhhteams.sharepoint.com') > -1)) {
                    if (site.Title.toLowerCase() == 'Offshore Tasks') {
                        item = site.Title == 'Offshore Tasks' ? item = 'Offshore Tasks' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl != undefined && (TestUrl.toLowerCase().indexOf('/sco-belgrade-online-monitoring-tool') > -1)) {
                    if (site.Title.toLowerCase() == 'shareweb') {
                        item = site.Title == 'Shareweb' ? item = 'Shareweb' : site = site.Title;
                        //if (item != undefined && getLatestSiteName.toLowerCase() == site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
            })
            //if (item != undefined && getLatestSiteName.toLowerCase() == item.toLowerCase())
            //$scope.selectedsiteMetadata(item);
        }
        setSave({ ...save, siteType: selectedSiteTitle })
        if (selectedSiteTitle != undefined) {
            setIsActiveSite(true);
        }
        else {
            setIsActiveSite(false);
        }
    }

    const handleClick = (event: any) => {
        setIsActiveSite(current => !current);
    };
    const handleClick2 = (event: any) => {
        setIsActiveCategory(current => !current);
    };
    const handleClickParent = (event: any) => {
        setIsActiveCategoryParent(current => !current);
    };
    const handleClick3 = (event: any) => {
        setIsActivePriority(current => !current);
    };
    const handleClick4 = (event: any) => {
        setIsActiveTime(current => !current);
    };
    return (
        <>
            <div className='row'>
                <div className='col-sm-12'>
                    <dl className='d-grid text-right pull-right'><span className="pull-right"> <a target='_blank' href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx" style={{ cursor: "pointer" }}>Old Create Task</a></span></dl>
                </div>
                <div className='col-sm-4'>
                    <label>Task Name</label>
                    <input type="text" placeholder='Enter task Name' className='form-control' onChange={(e) => setSave({ ...save, taskName: e.target.value })}></input>
                </div>
                <div className='col-sm-2 mt-4'>
                    <input
                        type="radio" className="form-check-input"
                        name="taskcategory" onChange={() => setSave({ ...save, portfolioType: 'Component' })} />
                    <label className='form-check-label'>Component</label>
                </div>
                <div className='col-sm-2 mt-4'>
                    <input
                        type="radio" className="form-check-input"
                        name="taskcategory" onChange={() => setSave({ ...save, portfolioType: 'Service' })} />
                    <label className='form-check-label'>Service</label>
                </div>
                <div className='col-sm-4'>
                    <label>Component Portfolio</label>
                    <input type="text" placeholder='Enter task Name' className='form-control'></input>
                </div>
            </div>
            <div className='row mt-2'>
                <div className='col-sm-12'>
                    <input type="text" placeholder='Enter task Url' className='form-control' onChange={(e) =>urlChange(e)}></input>
                </div>
            </div>
            <div className='row mt-2'>
                <fieldset className='fieldsett'>
                    <legend className="reset">Sites</legend>
                    <dl className="quick-actions d-flex">
                        {siteType.map((item: any) => {
                            return (
                                <>
                                    {(item.Title != undefined && item.Title != 'Offshore Tasks' && item.Title != 'Master Tasks' && item.Title != 'DRR' && item.Title != 'SDC Sites' && item.Title != 'QA') &&
                                        <>
                                            <dt
                                                className={isActiveSite && save.siteType == item.Title ? ' mx-1 p-2 px-4 sitecolor selectedTaskList' : "mx-1 p-2 px-4 sitecolor"} onClick={handleClick} >

                                                <a onClick={(e: any) => setSave({ ...save, siteType: item.Title })}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src={item.Item_x005F_x0020_Cover.Url} />
                                                    </span>{item.Title}
                                                </a>

                                            </dt>

                                        </>
                                    }
                                </>)
                        })}

                    </dl>
                </fieldset>
            </div>
            <div className='row mt-2'>
                <fieldset className='fieldsett'>
                    <legend className="reset">Task Categories</legend>
                    <dl className="row" style={{ width: "100%" }}>
                        {TaskTypes.map((Task: any) => {
                            return (
                                <>

                                    <>

                                        <dt
                                            className={isActiveCategory && save.taskCategoryParent == Task.Title ? 'tasks col-sm-2 selectedTaskList' : "tasks col-sm-2"} onClick={handleClick2} >

                                            <a onClick={(e) => setSave({ ...save, taskCategoryParent: Task.Title })} className='task manage_tiles'>
                                                <span className="icon-box">
                                                    {(Task.Item_x005F_x0020_Cover != undefined && Task.Item_x005F_x0020_Cover.Url != undefined) &&
                                                        <img className="icon-task"
                                                            src={Task.Item_x005F_x0020_Cover.Url} />}
                                                </span>
                                                <span className="tasks-label">{Task.Title}</span>
                                            </a>

                                        </dt>
                                        <dt className={IsActiveCategoryParent ? ' subcategoryTasks kind_task col-sm-10 selectedTaskList' : 'subcategoryTasks kind_task col-sm-10'} onClick={handleClickParent}>
                                            {subCategory?.map((item: any) => {
                                                return (
                                                    <>

                                                        {Task.Id == item.ParentID && <>

                                                            <a onClick={(e) => setSave({ ...save, taskCategory: item.Title })} className='text-center subcategoryTask'>

                                                                <span className="icon-box">
                                                                    {(item.Item_x005F_x0020_Cover != undefined && item.Item_x005F_x0020_Cover.Url != undefined) &&
                                                                        <img className="icon-task"
                                                                            src={item.Item_x005F_x0020_Cover.Url} />}
                                                                </span> <span className="tasks-label">{item.Title}</span>
                                                            </a>



                                                        </>
                                                        }

                                                    </>
                                                )
                                            })}
                                        </dt>


                                    </>

                                </>)
                        })}

                    </dl>
                </fieldset>
            </div>
            <div className='row mt-2'>
                <fieldset className='fieldsett'>
                    <legend className="reset">Priority Rank</legend>
                    <dl className="quick-actions d-flex">
                        {priorityRank.map((item: any) => {
                            return (
                                <>

                                    <>
                                        <dt
                                            className={isActivePriority && save.rank == item.Title ? 'mx-1 p-2 px-4 sitecolor selectedTaskList' : 'mx-1 p-2 px-4 sitecolor'} onClick={handleClick3}>

                                            <a onClick={(e) => setSave({ ...save, rank: item.Title })}>
                                                <span className="icon-sites">
                                                    <img className="icon-sites"
                                                        src={item.Item_x005F_x0020_Cover.Url} />
                                                </span>
                                            </a>

                                        </dt>

                                    </>

                                </>)
                        })}

                    </dl>
                </fieldset>
            </div>
            <div className='row mt-2'>
                <fieldset className='fieldsett'>
                    <legend className="reset">Time</legend>
                    <dl className="quick-actions d-flex center-Box">
                        {Timing.map((item: any) => {
                            return (
                                <>

                                    <>
                                        <dt
                                            className="mx-1 p-2 px-4 sitecolor" >
                                            <div className={isActiveTime && save.Time == item.Title ? 'selectedTaskList' : ''} onClick={handleClick4}>
                                                <a onClick={(e) => setSave({ ...save, Time: item.Title })}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src={item.Item_x005F_x0020_Cover.Url} />
                                                    </span>{item.Title}
                                                </a>
                                            </div>
                                        </dt>

                                    </>

                                </>)
                        })}

                    </dl>
                </fieldset>
            </div>
            <div className='row mt-2'>
                <fieldset className='fieldsett'>
                    <legend className="reset">Due Date</legend>
                    <dl className="quick-actions d-flex center-Box">
                        <dt>
                            <a className="mx-1 p-2 px-4 sitecolor">
                                Today&nbsp;<span >17/01/2023</span>
                            </a>
                        </dt>
                        <dt ng-click="DueDate('Tomorrow');" id="Tomorrow"><a className="mx-1 p-2 px-4 sitecolor">Tomorrow</a> </dt>
                        <dt id="ThisWeek" ng-click="DueDate('ThisWeek');"><a className="mx-1 p-2 px-4 sitecolor">This Week</a> </dt>
                        <dt ng-click="DueDate('NextWeek');" id="NextWeek"><a className="mx-1 p-2 px-4 sitecolor">Next Week</a> </dt>
                        <dt id="ThisMonth" ng-click="DueDate('ThisMonth');"><a className="mx-1 p-2 px-4 sitecolor">This Month</a> </dt>
                    </dl>
                </fieldset>
            </div>
            <div className='pull-right'>
                {
                    siteType.map((site: any) => {
                        if (site.Title == save.siteType) {
                            return (
                                <span>
                                    <img className="client-icons"
                                        src={site?.Item_x005F_x0020_Cover?.Url} />
                                </span>
                            )
                        }
                    })
                }
                <button type="button" className='btn btn-primary' onClick={() => createTask()}>Submit</button>
            </div>
            {isOpenEditPopup ? <EditTaskPopup Items={passdata} Call={CallBack} /> : ''}
        </>
    )
}
export default CreateTaskCom;