import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaHome, FaRegTimesCircle } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import { Modal } from 'office-ui-fabric-react';
var siteConfig: any = []
var AllTaskUsers: any = []
var Idd: number;
export default function ProjectOverview() {
    const [listIsVisible, setListIsVisible] = React.useState(false);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [AssignedTaskUser, SetAssignedTaskUser] = React.useState({ Title: '' });
    const [searchedNameData, setSearchedDataName] = React.useState([]);
    const [AllTasks, setAllTasks] = React.useState([]);
    const [inputStatus, setInputStatus] = React.useState(false);
    const [EditmodalIsOpen, setEditmodalIsOpen] = React.useState(false);
    const [AddmodalIsOpen, setAddmodalIsOpen] = React.useState(false);
    // const [Masterdata,setMasterdata] = React.useState([])
    //const [QueryId, setQueryId] = React.useState()
    React.useEffect(() => {
        TaskUser()
        GetMasterData();
    }, [])
    const TaskUser = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUser = [];
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
            .top(5000)
            .expand("AssingedToUser,Approver")
            .get();
        setAllTaskUser(taskUser);
        AllTaskUsers = taskUser;
        // console.log("all task user =====", taskUser)
        setSearchedDataName(taskUser)
    }
    const GetMasterData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        let Alltask: any = [];
        // var AllUsers: any = []
        taskUsers = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Deliverables,TechnicalExplanations,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title").expand("ComponentPortfolio,ServicePortfolio,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent").top(4999).get();
        taskUsers.PercentComplete = (taskUsers.PercentComplete * 100).toFixed(0);
        // if(taskUsers.ItemType=="Project"){
        taskUsers.map((item: any) => {
            if (item.Item_x0020_Type != null && item.Item_x0020_Type == "Project") {
                Alltask.push(item)
            }
            Alltask.map((items: any) => {
                items.AssignedUser = []
                if (items.AssignedTo != undefined) {
                    items.AssignedTo.map((taskUser: any) => {
                        var newuserdata: any = {};
                        AllTaskUsers.map((user: any) => {
                            if (user.AssingedToUserId == taskUser.Id) {
                                newuserdata['useimageurl'] = user.Item_x0020_Cover.Url
                                newuserdata['Suffix'] = user.Suffix
                                newuserdata['Title'] = user.Title
                                newuserdata['UserId'] = user.AssingedToUserId
                                items['Usertitlename'] = user.Title
                            }
                        })
                        items.AssignedUser.push(newuserdata);
                    })
                }
            })
        })
        setAllTasks(Alltask)
    }
    //    Save data in master task list
    const [title, settitle] = React.useState('')
    const addFunction = async () => {
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items.add({
            Title: `${title}`,
            Item_x0020_Type: "Project",
        }).then((res: any) => {
            setAddmodalIsOpenToFalse();
            GetMasterData();
            console.log(res);
        })
    }
    //Just Check 
    // AssignedUser: '',
    const [UpdateData, setUpdateData] = React.useState({
        Title: '',
        DueDate: '',
        Body: '',
        PercentComplete: '',
        Priority: ''
    })
    const updateDetails = async () => {
        try {
            let AssignedUsersArray = [];
            // AssignedUsersArray.push(UpdateData.AssignedUser)
            // let AssingedUser = {
            //     "results": AssignedUsersArray
            // }
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
            if (Idd != undefined) {
                await web.lists.getByTitle("Master%20Tasks").items.getById(Idd).update({
                    Title: `${UpdateData.Title}`,
                    // AssignedUser: AssingedUser,
                    DueDate: `${UpdateData.DueDate}`,
                    Body: `${UpdateData.Body}`,
                    PercentComplete: `${UpdateData.PercentComplete}`,
                    Priority: `${UpdateData.Priority}`
                }).then(i => {
                    GetMasterData()
                    setEditmodalIsOpenToFalse();
                    console.log("Update Success");
                })
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    // Delete Project
    const deleteUserDtl = async () => {
        try {
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
            await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items.getById(Idd).delete();
            GetMasterData();
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const setEditmodalIsOpenToTrue = (Id: any) => {
        setEditmodalIsOpen(true)
        Idd = Id;
    }
    const setEditmodalIsOpenToFalse = () => {
        setEditmodalIsOpen(false)
    }
    const setAddmodalIsOpenToTrue = () => {
        setAddmodalIsOpen(true)
    }
    const setAddmodalIsOpenToFalse = () => {
        setAddmodalIsOpen(false)
    }
    const searchedName = async (e: any) => {
        setListIsVisible(true);
        let Key: any = e.target.value.toLowerCase();
        const data: any = {
            nodes: AllTaskUser.filter((items: any) =>
                items.Title?.toLowerCase().includes(Key)
            ),
        };
        setSearchedDataName(data.nodes);
        if (Key.length == 0) {
            setSearchedDataName(AllTaskUser);
            setListIsVisible(false);
        }
    }
    const cancelButtonFunction = () => {
        SetAssignedTaskUser({ ...AssignedTaskUser, Title: "" })
        setInputStatus(false);
    }
    console.log(AllTasks);
    return (
        <div>
            {/* Edit Popup */}
            {AllTasks.length > 0 && AllTasks && AllTasks.map(function (item, index) {
                if (item.Id == Idd) {
                    return (
                        <Modal
                            isOpen={EditmodalIsOpen}
                            onDismiss={setEditmodalIsOpenToFalse}
                            isBlocking={false}
                        >
                            <div className='card' style={{ width: "700px" }}>
                                <div className='card-header'>
                                    <div className="d-flex justify-content-between">
                                        <h4 style={{ color: "#000066" }} >Edit Task</h4>
                                        <i className="fa fa-times-circle" onClick={setEditmodalIsOpenToFalse}>
                                            <img src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                                        </i>
                                    </div>
                                </div>
                                <div className='card-body px-5'>
                                    <span >
                                        <div>
                                            <span>
                                            <label>Title</label>
                                                <input type='text' className='form-control my-2' defaultValue={item.Title} onChange={(e) => setUpdateData({ ...UpdateData, Title: e.target.value })} />
                                            </span>
                                            <span>
                                            <label>% Complete</label>
                                                <input type='text' className='form-control my-2' placeholder='Enter PercentComplete' defaultValue={item.PercentComplete} onChange={(e) => setUpdateData({ ...UpdateData, PercentComplete: e.target.value })} />
                                            </span>
                                        </div>
                                        <div>
                                            <span>
                                            <label>Due Date</label>
                                                <input type='Date' placeholder="Select DueDate" className='form-control my-2' defaultValue={item.DueDate} onChange={(e) => setUpdateData({ ...UpdateData, DueDate: e.target.value })} />
                                            </span>
                                        </div>
                                        <div>
                                        <label>Description</label>
                                            <span><input type='text' placeholder="Enter Description" className='form-control my-2' defaultValue={item.Body} onChange={(e) => setUpdateData({ ...UpdateData, Body: e.target.value })} /></span>
                                            <label>Priority</label>
                                            <span><input type='text' placeholder="Enter Priority" className='form-control' defaultValue={item.Priority} onChange={(e) => setUpdateData({ ...UpdateData, Priority: e.target.value })} /></span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                        <div className='my-2'>
                                                <button type="button" className="btn-sm btn-danger mx-2"
                                                    onClick={deleteUserDtl} title="Delete this Project">
                                                    Delete
                                                </button>
                                            </div>
                                        <div className="d-flex flex-row-reverse my-2">
                                            <button type="button"
                                                style={{ background: "#000066", color: "#fff", border: "none", outline: "none", padding: "6px", borderRadius: "5px" }} onClick={updateDetails}>
                                                Update
                                            </button>
                                            <button type="button" className="btn-sm btn-danger mx-2"
                                                onClick={setEditmodalIsOpenToFalse}>
                                                Cancel
                                            </button>
                                        </div>
                                        </div>
                                     
                                    </span>
                                </div>
                            </div>
                        </Modal>
                    )
                }
            })}
            {/* Edit Popup End*/}
            {/* Add Popup */}
            <Modal
                isOpen={AddmodalIsOpen}
                onDismiss={setAddmodalIsOpenToFalse}
                isBlocking={false}
            >
                <div className='card' style={{ width: "600px" }}>
                    <div className='card-header'>
                        <div className="d-flex justify-content-between">
                            <h4 style={{ color: "#000066" }} >Create Project</h4>
                            <i className="fa fa-times-circle" onClick={setAddmodalIsOpenToFalse}>
                                <img src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                            </i>
                        </div>
                    </div>
                    <div className='card-body'>
                        <span >
                            <div>
                                <span>
                                    <input type='text' className='form-control' placeholder='Enter Task Name' value={title} onChange={(e) => { settitle(e.target.value) }} />
                                    {/* <input type='text' className='form-control' placeholder='Enter Task Name' defaultValue={title} onChange={(e) => { (e: any) => settitle(e.target.value) }} /> */}
                                </span>
                            </div>
                            <div className="d-flex flex-row-reverse my-2">
                                <button type="button" ng-click="FilterData('SmartTime')"
                                    style={{ background: "#000066", color: "#fff", border: "none", outline: "none", padding: "6px", borderRadius: "5px" }} onClick={addFunction}>
                                    Create
                                </button>
                                <button type="button" className="btn-sm btn-danger mx-2" ng-click="Filtercancel('SmartTime')"
                                    onClick={setAddmodalIsOpenToFalse}>
                                    Cancel
                                </button>
                            </div>
                        </span>
                    </div>
                </div>
            </Modal>
            {/* Add Popup End*/}
            <div className="col-sm-12 pad0 smart">
                <div className="section-event">
                    <div className="wrapper">
                        <div className='header-section d-flex justify-content-between'>
                            <h2 style={{ color: "#000066", fontWeight: "600" }}>Project Management Overview</h2>
                            <button style={{ background: "#000066", color: "#fff", border: "none", outline: "none" }} className='text-end btn-sm' type='button' onClick={setAddmodalIsOpenToTrue}>Create Project</button>
                        </div>
                        <table className="table table-hover my-3 py-3" id="EmpTable" style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "40%" }}>
                                        <div className="smart-relative">
                                            <input type="search" placeholder="Title" className="full_width form-control searchbox_height" />
                                        </div>
                                    </th>
                                    <th style={{ width: "15%" }}>
                                        <div className="smart-relative">
                                            <input type="search" placeholder="% Complete" className="full_width form-control searchbox_height" />
                                        </div>
                                    </th>
                                    <th style={{ width: "15%" }}>
                                        <div className="smart-relative">
                                            <input id="searchClientCategory" type="search" placeholder="Priority"
                                                title="Client Category" className="full_width searchbox_height form-control" />
                                        </div>
                                    </th>
                                    <th style={{ width: "15%" }}>
                                        <div className="smart-relative">
                                            <input id="searchClientCategory" type="search" placeholder="Team"
                                                title="Client Category" className="full_width form-control searchbox_height" />
                                        </div>
                                    </th>
                                    <th style={{ width: "13%" }}>
                                        <div className="smart-relative">
                                            <input id="searchClientCategory" type="search" placeholder="Due Date"
                                                title="Client Category" className="full_width form-control searchbox_height"
                                            />
                                        </div>
                                    </th>
                                    <th style={{ width: "2%" }}>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <div id="SpfxProgressbar" style={{ display: "none" }}>
                                    <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                </div>
                                {AllTasks.length > 0 && AllTasks && AllTasks.map(function (item, index) {
                                    return (
                                        <>
                                            <tr >
                                                <td>
                                                    <span><a style={{ textDecoration: "none", color: "#000066" }} href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${item.Id}`}  data-interception="off" target="_blank">{item.Title}</a></span>
                                                </td>
                                                <td><span className="ml-2">{item.PercentComplete}</span></td>
                                                <td>{item.Priority}</td>
                                                <td>
                                                    {item.AssignedUser != undefined &&
                                                        item.AssignedUser.map((Userda: any) => {
                                                            return (
                                                                <span className="headign">
                                                                    <img src={Userda.useimageurl} title={Userda.Title} />
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                </td>
                                                <td><span className="ml-2">{item.DueDate != null ? Moment(item.DueDate).format('DD/MM/YYYY') : ""}</span></td>
                                                <td><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e: any) => setEditmodalIsOpenToTrue(item.Id)}></img></td>
                                            </tr>
                                        </>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}