import * as React from "react";
import { arraysEqual, Modal } from 'office-ui-fabric-react';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
import { Version } from '@microsoft/sp-core-library';
import * as moment from "moment";
import { sortBy } from "@microsoft/sp-lodash-subset";
const ComponentPortPolioPopup = (item: any) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [data, setComponentsData] = React.useState([]);
    const [CheckBoxdata, setcheckbox] = React.useState([]);
    const [selectedComponent, selctedCompo] = React.useState('');
    React.useEffect(() => {
        if (item.smartComponent != undefined && item.smartComponent.length > 0)
            selctedCompo(item.smartComponent[0]);

        GetComponents();
    },
        []);
    function Example(callBack: any) {

        item.Call();

    }
    const setModalIsOpenToFalse = () => {
        Example(item);
        setModalIsOpen(false)
    }
    const setModalIsOpenToOK = () => {

        if (item.props.smartComponent !=undefined && item.props.smartComponent.length == 0)
            item.props.smartComponent = CheckBoxdata;
        else {
            item.props.smartComponent = [];
            item.props.smartComponent = CheckBoxdata;
        }
        Example(item);
        setModalIsOpen(false);
    }

    const handleOpen = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setComponentsData(data => ([...data]));

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
        //console.log(this.taskUsers);

    }
    const GetComponents = async () => {
        var RootComponentsData: any[] = []; var ComponentsData: any[] = [];
        var SubComponentsData: any[] = [];
        var FeatureData: any[] = [];

        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            .getByTitle('Master Tasks')
            .items
            //.getById(this.state.itemID)
            .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
            .top(4999)
            .get()

        console.log(componentDetails);
        await GetTaskUsers();

        $.each(componentDetails, function (index: any, result: any) {
            result.TeamLeaderUser = []
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
        // setmaidataBackup(ComponentsData)
        setComponentsData(ComponentsData);
        setModalIsOpen(true)

    }




    return (
        <Modal
            isOpen={modalIsOpen}
            onDismiss={setModalIsOpenToFalse}
            isBlocking={false}>
            <div className="modal-dailog modal-lg">
                <div className="modal-content">
                    <div className='modal-header'>
                        <h3 className='modal-title'>Select Components</h3>
                        <button type="button" className='close pull-right' onClick={setModalIsOpenToFalse}>x</button>
                    </div>
                    <div className="modal-body bg-f5f5 clearfix">
                        <div className="Alltable mt-10">
                            <div className="col-sm-12 pad0 smart">
                                <div className="section-event">
                                    <div className="wrapper">
                                        <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "2%" }}>
                                                        <div style={{ width: "2%" }}>
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
                                                            <input type="search" placeholder="Title" className="full_width searchbox_height" />

                                                            {/* <span className="sorticon">
                                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                        </span> */}


                                                        </div>
                                                    </th>
                                                    <th style={{ width: "18%" }}>
                                                        <div style={{ width: "17%" }} className="smart-relative">
                                                            <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                                title="Client Category" className="full_width searchbox_height"
                                                            />
                                                            {/* <span className="sorticon">
                                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                        </span> */}
                                                        </div>
                                                    </th>
                                                    <th style={{ width: "20%" }}>
                                                        <div style={{ width: "19%" }} className="smart-relative">
                                                            <input id="searchClientCategory" type="search" placeholder="Team"
                                                                title="Client Category" className="full_width searchbox_height"
                                                            />
                                                            {/* <span className="sorticon">
                                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                        </span> */}

                                                        </div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>
                                                        <div style={{ width: "9%" }} className="smart-relative">
                                                            <input id="searchClientCategory" type="search" placeholder="Status"
                                                                title="Client Category" className="full_width searchbox_height"
                                                            />
                                                            {/* <span className="sorticon">
                                                                        <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                        <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                    </span> */}

                                                        </div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>
                                                        <div style={{ width: "9%" }} className="smart-relative">
                                                            <input id="searchClientCategory" type="search" placeholder="Item Rank"
                                                                title="Client Category" className="full_width searchbox_height"
                                                            />
                                                            {/* <span className="sorticon">
                                                                        <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                        <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                    </span> */}
                                                        </div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>
                                                        <div style={{ width: "9%" }} className="smart-relative">
                                                            <input id="searchClientCategory" type="search" placeholder="Due"
                                                                title="Client Category" className="full_width searchbox_height"
                                                            />
                                                            {/* <span className="sorticon">
                                                                        <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                        <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                    </span> */}

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
                                                                <td className="pad0" colSpan={10}>
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
                                                                            <td style={{ width: "2%" }}>
                                                                                <input type="checkbox" name="Active" checked={item.Id == (CheckBoxdata.length > 0 && CheckBoxdata[0]["Id"] ? CheckBoxdata[0]["Id"] : CheckBoxdata) ? true : false} onClick={() => { item.checked = !item.checked; setcheckbox([item.Title == (CheckBoxdata.length > 0 ? CheckBoxdata[0]["Title"] : CheckBoxdata) ? [] : item]) }} ></input>

                                                                            </td>

                                                                            <td style={{ width: "4%" }}>
                                                                                <div className="">
                                                                                    <span>
                                                                                        <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                            <img className="icon-sites-img"
                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />
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
                                                                                    <td className="pad0" colSpan={10}>
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
                                                                                                <td style={{ width: "2%" }}>
                                                                                                    <input type="checkbox" name="Active" checked={childitem.Id == (CheckBoxdata.length > 0 && CheckBoxdata[0]["Id"] ? CheckBoxdata[0]["Id"] : CheckBoxdata) ? true : false} onClick={() => { childitem.checked = !childitem.checked; setcheckbox([childitem.Title == (CheckBoxdata.length > 0 ? CheckBoxdata[0]["Title"] : CheckBoxdata) ? [] : childitem]) }} ></input>
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

                                                                                                                </td>

                                                                                                                <td style={{ width: "2%" }}><input type="checkbox" name="Active" checked={childinew.Id == (CheckBoxdata.length > 0 && CheckBoxdata[0]["Id"] ? CheckBoxdata[0]["Id"] : CheckBoxdata) ? true : false} onClick={() => { childinew.checked = !childinew.checked; setcheckbox([childinew.Title == (CheckBoxdata.length > 0 ? CheckBoxdata[0]["Title"] : CheckBoxdata) ? [] : childinew]) }}  ></input></td>
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
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={setModalIsOpenToOK}>OK</button>
                        <button type="button" className="btn btn-grey" onClick={setModalIsOpenToFalse}>Cancel</button>
                    </div>
                </div>

            </div >
        </Modal >
    )

}; export default ComponentPortPolioPopup;

