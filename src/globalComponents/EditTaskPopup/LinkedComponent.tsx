import * as React from "react";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";

import Tooltip from "../Tooltip";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
import * as moment from "moment";
var LinkedServicesBackupArray: any = [];
var ComponentsData: any = [];
const LinkedServices = (item: any) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [CheckBoxData, setCheckBoxData] = React.useState([]);
    const [table, setTable] = React.useState(data);
    const [selectedComponent, setSelectedComponent] = React.useState('');
    React.useEffect(() => {
        if (item.smartComponent != undefined && item.smartComponent.length > 0)
            setSelectedComponent(item.smartComponent[0]);
        GetComponents();
    },
        []);
    function Example(callBack: any, type: any) {
        item.Call(callBack.props, type);
    }
    const setModalIsOpenToFalse = () => {
        Example(item, "LinkedComponent");
        setModalIsOpen(false)
    }
    const setModalIsOpenToOK = () => {
        if (item.props.linkedComponent != undefined && item.props.linkedComponent.length == 0)
            item.props.linkedComponent = CheckBoxData;
        else {
            item.props.linkedComponent = [];
            item.props.linkedComponent = CheckBoxData;
        }
        Example(item, "LinkedComponent");
        setModalIsOpen(false);
    }
    const handleOpen = (item: any) => {
        item.show = item.show = item.show == true ? false : true;
        setData(data => ([...data]));
    };
    var Response: [] = [];
    const GetTaskUsers = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        taskUsers = await web.lists
            .getByTitle('Task Users')
            .items
            .get();
        Response = taskUsers;
    }
    const GetComponents = async () => {
        var RootComponentsData: any = [];
        var SubComponentsData: any = [];
        var FeatureData: any = [];
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            .getByTitle('Master Tasks')
            .items
            .select("ID", "Title", "DueDate", "Status", "Portfolio_x0020_Type", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
            .top(4999)
            .get()

        console.log(componentDetails);
        await GetTaskUsers();

        $.each(componentDetails, function (index: any, result: any) {
            result.TeamLeaderUser = []
            if (result.Portfolio_x0020_Type == "Service") {
                result.DueDate = moment(result.DueDate).format('DD/MM/YYYY')
                if (result.DueDate == 'Invalid date' || '') {
                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                }
                if (result.PercentComplete != undefined)
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
                    $.each(result.Team_x0020_Members, function (index: any, categoryData: any) {
                        result.ClientCategory.push(categoryData);
                    })
                }
                if (result.Item_x0020_Type == 'Root Component') {
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

            }
        });
        $.each(SubComponentsData, function (subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(FeatureData, function (featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp['Child'].push(featurecomp);
                    }
                })
            }
        })
        $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(SubComponentsData, function (index: any, featurecomp: any) {
                    if (featurecomp != undefined) {
                        if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                            subcomp['Child'].push(featurecomp);
                        }
                    }
                })
            }
        })
        //maidataBackup.push(ComponentsData)
        // setmaidataBackup(ComponentsData)
        setCheckBoxData(item.linkedComponentData);
        setData(ComponentsData);
        setModalIsOpen(true);
        LinkedServicesBackupArray = ComponentsData;
    }
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        {`Select Services`}
                    </span>
                </div>
                <Tooltip ComponentId="1667" />
            </div>
        );
    };
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

    // const ColumnSearchForLinkedServices = (e: any, columnName: any) => {
    //     let searchKey = e.target.value.toLoserCase();
    //     let tempArray: any = [];
    //     if (columnName == "Title") {
    //         data?.map((dataItem: any) => {
    //             if (dataItem.Title.toLowerCase() == searchKey) {
    //                 if (dataItem.Child?.length > 0 && dataItem.Child != null) {
    //                     dataItem.Child?.map((childItem: any) => {
    //                         if (childItem.Title.toLoserCase() == searchKey) {
    //                             tempArray.push(dataItem);
    //                         }
    //                     })
    //                 } else {
    //                     tempArray.push(dataItem);
    //                 }
    //             }
    //         })
    //         setData(tempArray);
    //     }
    //     if (columnName == "Client-Category") { }
    //     if (columnName == "Team-Member") { }
    //     if (columnName == "Status") { }
    //     if (columnName == "Item-Rank") { }
    //     if (columnName == "Due-Date") { }
    //     if(searchKey.length == 0){
    //         setData(LinkedServicesBackupArray);
    //     }
    // }
    const ColumnSearchForLinkedServices = (e: any, columnName: any) => {
        let searchKey = e.target.value.toLowerCase();
        let tempArray: any = [];
        let childs: any = [];
        if(searchKey == ''){
            tempArray?.forEach((item:any)=>{
              item.show=false;
            })
            setData(ComponentsData)
        }
        if (columnName == "Title") {
            data?.forEach((dataItem: any) => {
                let IsAvailable= dataItem.Title.toLowerCase().includes(searchKey.toLowerCase())
                if (IsAvailable) {
                    tempArray.push(dataItem)
                } 
                if(dataItem.Child != undefined && dataItem.Child.length>0){
                    dataItem.Child.forEach((childData:any)=>{
                        let IsAvailable = childData.Title.toLowerCase(). includes(searchKey.toLowerCase())
                        if(IsAvailable){
                           dataItem.show=true;
                           childs.push(childData)
                           tempArray.push(dataItem)
                        }
                    })
                }
            })
           
            tempArray?.forEach((item:any)=>{
                item.Child=[]
                childs?.forEach((childData:any)=>{
                    if(childData.Parent.Id == item.Id)
                    item.Child.push(childData)
                })
            })
            const finalData = tempArray.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            setData(finalData);
        }
        // if (columnName == "Client-Category") { }
        // if (columnName == "Team-Member") { }
        // if (columnName == "Status") { }
        // if (columnName == "Item-Rank") { }
        // if (columnName == "Due-Date") { }
        // if(searchKey.length == 0){
        //     setData(LinkedServicesBackupArray);
        // }
    }

    const CustomFooter = () => {
        return (
            <div className="me-4 p-2 pe-3 text-end">
                <button type="button" className="btn btn-primary" onClick={setModalIsOpenToOK}>OK</button>
                <button type="button" className="btn btn-default ms-2" onClick={setModalIsOpenToFalse}>Cancel</button>
            </div>
        )
    }
    return (
        <Panel
            type={PanelType.custom}
            customWidth="1100px"
            isOpen={modalIsOpen}
            onDismiss={setModalIsOpenToFalse}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
            onRenderFooter={CustomFooter}
        >
            <div className="serviepannelgreena">
                <div className="modal-body p-0 mt-2">
                    <div className="Alltable mt-10">
                        <div className="col-sm-12 p-0 smart">
                            <div className="section-event">
                                <div className="wrapper">
                                    <table className=" mb-0 table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "2%" }}>
                                                    <div style={{ width: "2%" }}>
                                                        <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                            {item.Child != undefined &&
                                                                <a className='hreflink'
                                                                    title="Tap to expand the childs">
                                                                    <div className="sign">{item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                    </div>
                                                                </a>
                                                            }
                                                        </div>
                                                    </div>
                                                </th>
                                                <th style={{ width: "2%" }}>
                                                    <div></div>
                                                </th>
                                                <th style={{ width: "4%" }}>
                                                    <div></div>
                                                </th>
                                                <th style={{ width: "2%" }}>
                                                    <div></div>
                                                </th>
                                                <th style={{ width: "22%" }}>
                                                    <div style={{ width: "21%" }} className="smart-relative">
                                                        <input type="search" placeholder="Title" onChange={(e) => ColumnSearchForLinkedServices(e, "Title")} className="full_width searchbox_height" />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>
                                                                < FaAngleUp />
                                                            </span>
                                                            <span className="down" onClick={sortByDng}>
                                                                < FaAngleDown />
                                                            </span>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th style={{ width: "18%" }}>
                                                    <div style={{ width: "17%" }} className="smart-relative">
                                                        <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                            title="Client Category" className="full_width searchbox_height"
                                                            onChange={(e) => ColumnSearchForLinkedServices(e, "Client-Category")}
                                                        />
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
                                                            onChange={(e) => ColumnSearchForLinkedServices(e, "Team-Member")}
                                                        />
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
                                                            onChange={(e) => ColumnSearchForLinkedServices(e, "Status")}
                                                        />
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
                                                            onChange={(e) => ColumnSearchForLinkedServices(e, "Item-Rank")}
                                                        />
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
                                                            onChange={(e) => ColumnSearchForLinkedServices(e, "Due-Date")}
                                                        />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <div id="SpfxProgressbar" style={{ display: "none" }}>
                                                <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                            </div>
                                            {data && data.map(function (item, index) {
                                                return (
                                                    <>
                                                        <tr >
                                                            <td className="p-0" colSpan={10}>
                                                                <table className="mb-0 table taskprofilepagegreen" style={{ width: "100%" }}>
                                                                    <tr className="bold for-c0l">

                                                                        <td style={{ width: "2%" }}>
                                                                            <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                                                {item.Child != undefined &&
                                                                                    <a className='hreflink'
                                                                                        title="Tap to expand the childs">
                                                                                        <div className="sign">{item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                            : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                        </div>
                                                                                    </a>
                                                                                }
                                                                            </div>

                                                                        </td>
                                                                        <td style={{ width: "2%" }}>
                                                                            <input type="checkbox" name="Active" checked={item.Id == (CheckBoxData != undefined && CheckBoxData.length > 0 && CheckBoxData[0]["Id"] ? CheckBoxData[0]["Id"] : CheckBoxData)} onClick={() => { item.checked = !item.checked; setCheckBoxData([item.Title == (CheckBoxData != undefined && CheckBoxData.length > 0 ? CheckBoxData[0]["Title"] : CheckBoxData) ? [] : item]) }} ></input>

                                                                        </td>

                                                                        <td style={{ width: "4%" }}>
                                                                            <div className="">
                                                                                <span>
                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                        <img className="icon-sites-img"
                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/service_icons/component_icon.png " />
                                                                                    </a>
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "2%" }}>
                                                                            <div className="">
                                                                                <span>
                                                                                    <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                                                        {item.Child != undefined &&
                                                                                            <a className='hreflink'
                                                                                                title="Tap to expand the childs">
                                                                                                <div className="sign">{item.show ? <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png" />
                                                                                                    : <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png" />}
                                                                                                </div>
                                                                                            </a>
                                                                                        }
                                                                                    </div>

                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "22%" }}>
                                                                            <a className="hreflink serviceColor_Active" target="_blank"
                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item.Id}
                                                                            >{item.Title}
                                                                            </a>
                                                                            {item.Child != undefined &&
                                                                                <span className="ms-1">({item.Child.length})</span>
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
                                                                                <td className="p-0" colSpan={10}>
                                                                                    <table className="mb-0 table" style={{ width: "100%" }}>
                                                                                        <tr className="for-c02">
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                    {childitem.Child.length > 0 &&
                                                                                                        <a className='hreflink'
                                                                                                            title="Tap to expand the childs">
                                                                                                            <div className="sign">{childitem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                            </div>
                                                                                                        </a>
                                                                                                    }

                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <input type="checkbox" name="Active" checked={childitem.Id == (CheckBoxData != undefined && CheckBoxData.length > 0 && CheckBoxData[0]["Id"] ? CheckBoxData[0]["Id"] : CheckBoxData) ? true : false} onClick={() => { childitem.checked = !childitem.checked; setCheckBoxData([childitem.Title == (CheckBoxData != undefined && CheckBoxData.length > 0 ? CheckBoxData[0]["Title"] : CheckBoxData) ? [] : childitem]) }} ></input>
                                                                                            </td>
                                                                                            <td style={{ width: "4%" }}> <div>

                                                                                                <span>

                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                        <img className="icon-sites-img"
                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png" />
                                                                                                    </a>

                                                                                                </span>
                                                                                            </div>
                                                                                            </td>
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                    {childitem.Child.length > 0 &&
                                                                                                        <a className='hreflink'
                                                                                                            title="Tap to expand the childs">
                                                                                                            <div className="sign">{childitem.show ? <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png" />
                                                                                                                : <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png" />}
                                                                                                            </div>
                                                                                                        </a>
                                                                                                    }

                                                                                                </div>

                                                                                            </td>
                                                                                            <td style={{ width: "22%" }}>
                                                                                                <a className="hreflink serviceColor_Active" target="_blank"
                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                >{childitem.Title}
                                                                                                </a>
                                                                                                {childitem.Child.length > 0 &&
                                                                                                    <span className="ms-1">({childitem.Child.length})</span>
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


                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>

                                                                            {childitem.show && (
                                                                                <>
                                                                                    {childitem.Child.map(function (childinew: any) {
                                                                                        return (
                                                                                            <tr >
                                                                                                <td className="p-0" colSpan={10}>
                                                                                                    <table className="mb-0 table" style={{ width: "100%" }}>
                                                                                                        <tr className="tdrow">
                                                                                                            <td style={{ width: "2%" }}>

                                                                                                            </td>

                                                                                                            <td style={{ width: "2%" }}><input type="checkbox" name="Active" checked={childinew.Id == (CheckBoxData != undefined && CheckBoxData.length > 0 && CheckBoxData[0]["Id"] ? CheckBoxData[0]["Id"] : CheckBoxData) ? true : false} onClick={() => { childinew.checked = !childinew.checked; setCheckBoxData([childinew.Title == (CheckBoxData != undefined && CheckBoxData.length > 0 ? CheckBoxData[0]["Title"] : CheckBoxData) ? [] : childinew]) }}  ></input></td>
                                                                                                            <td style={{ width: "4%" }}> <div>
                                                                                                                <span>

                                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                        <img className="icon-sites-img"
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png" />
                                                                                                                    </a>

                                                                                                                </span>
                                                                                                            </div>
                                                                                                            </td>
                                                                                                            <td style={{ width: "2%" }}></td>
                                                                                                            <td style={{ width: "22%" }}>

                                                                                                                <a className="hreflink serviceColor_Active" target="_blank"
                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childinew.Id}
                                                                                                                >{childinew.Title}
                                                                                                                </a>
                                                                                                                {childinew.Child.length > 0 &&
                                                                                                                    <span className="ms-1">({childinew.Child.length})</span>
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

                                            })}



                                        </tbody>



                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </Panel >
    )
}; export default LinkedServices;
