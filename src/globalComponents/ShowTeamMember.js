// // Commits on Jun 1, 2023  take if required the neha changes in the page , it shows error on the all the profile 
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from "react";
import { Button, Modal } from "react-bootstrap";
var backupTaskUsers = [];
function ShowTeamMembers(item) {
    var newTaskUsers = __spreadArray([], item === null || item === void 0 ? void 0 : item.TaskUsers, true);
    var newTaskUsers11 = __spreadArray([], item === null || item === void 0 ? void 0 : item.TaskUsers, true);
    var _a = React.useState(""), email = _a[0], setEmail = _a[1];
    var dragItem = React.useRef();
    var dragOverItem = React.useRef();
    var _b = React.useState([]), teamMembers = _b[0], setTeamMembers = _b[1];
    var _c = React.useState(true), show = _c[0], setShow = _c[1];
    var _d = React.useState([]), allEmployeeData = _d[0], setAllEmployeeData = _d[1];
    // const rerender = React.useReducer(() => ({}), {})[1];
    // const [employees, setEmployees]: any = React.useState();
    var BackupArray = [];
    React.useEffect(function () {
        getTeamMembers();
    }, [item]);
    function getTeamMembers() {
        var _a;
        var UsersData = [];
        var Groups = [];
        // const backupGroup: any = [];
        newTaskUsers === null || newTaskUsers === void 0 ? void 0 : newTaskUsers.map(function (EmpData) {
            if ((EmpData === null || EmpData === void 0 ? void 0 : EmpData.ItemType) === "Group") {
                EmpData.Child = [];
                Groups.push(EmpData);
            }
            if ((EmpData === null || EmpData === void 0 ? void 0 : EmpData.ItemType) == "User" && (EmpData === null || EmpData === void 0 ? void 0 : EmpData.Id) != 43) {
                UsersData.push(EmpData);
            }
        });
        if ((UsersData === null || UsersData === void 0 ? void 0 : UsersData.length) > 0 && (Groups === null || Groups === void 0 ? void 0 : Groups.length) > 0) {
            Groups === null || Groups === void 0 ? void 0 : Groups.map(function (groupData, index) {
                UsersData === null || UsersData === void 0 ? void 0 : UsersData.map(function (userData) {
                    var _a;
                    if ((groupData === null || groupData === void 0 ? void 0 : groupData.Id) == (((_a = userData === null || userData === void 0 ? void 0 : userData.UserGroup) === null || _a === void 0 ? void 0 : _a.Id) || (userData === null || userData === void 0 ? void 0 : userData.UserGroupId))) {
                        userData.NewLabel = (groupData === null || groupData === void 0 ? void 0 : groupData.Title) + " > " + (userData === null || userData === void 0 ? void 0 : userData.Title);
                        groupData.Child.push(userData);
                    }
                });
            });
        }
        // let data = [...Groups]
        // if(data != undefined && data.length > 0){
        //   data.map((dataItem:any)=>{
        //     backupGroup.push(dataItem);
        //   })
        // }
        var array = [];
        (_a = item === null || item === void 0 ? void 0 : item.props) === null || _a === void 0 ? void 0 : _a.map(function (items) {
            newTaskUsers === null || newTaskUsers === void 0 ? void 0 : newTaskUsers.map(function (taskuser) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                if (((_b = (_a = items === null || items === void 0 ? void 0 : items.original) === null || _a === void 0 ? void 0 : _a.Team_x0020_Members) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    (_d = (_c = items === null || items === void 0 ? void 0 : items.original) === null || _c === void 0 ? void 0 : _c.Team_x0020_Members) === null || _d === void 0 ? void 0 : _d.map(function (item) {
                        var _a;
                        if ((item === null || item === void 0 ? void 0 : item.Id) == ((_a = taskuser === null || taskuser === void 0 ? void 0 : taskuser.AssingedToUser) === null || _a === void 0 ? void 0 : _a.Id)) {
                            array.push(taskuser);
                        }
                    });
                }
                if (((_e = items === null || items === void 0 ? void 0 : items.original.Responsible_x0020_Team) === null || _e === void 0 ? void 0 : _e.length) > 0) {
                    (_f = items === null || items === void 0 ? void 0 : items.original.Responsible_x0020_Team) === null || _f === void 0 ? void 0 : _f.map(function (item) {
                        var _a;
                        if ((item === null || item === void 0 ? void 0 : item.Id) == ((_a = taskuser === null || taskuser === void 0 ? void 0 : taskuser.AssingedToUser) === null || _a === void 0 ? void 0 : _a.Id)) {
                            array.push(taskuser);
                        }
                    });
                }
                if (((_h = (_g = items === null || items === void 0 ? void 0 : items.original) === null || _g === void 0 ? void 0 : _g.AssignedTo) === null || _h === void 0 ? void 0 : _h.length) > 0) {
                    (_k = (_j = items === null || items === void 0 ? void 0 : items.original) === null || _j === void 0 ? void 0 : _j.AssignedTo) === null || _k === void 0 ? void 0 : _k.map(function (item) {
                        var _a;
                        if ((item === null || item === void 0 ? void 0 : item.Id) == ((_a = taskuser === null || taskuser === void 0 ? void 0 : taskuser.AssingedToUser) === null || _a === void 0 ? void 0 : _a.Id)) {
                            array.push(taskuser);
                        }
                    });
                }
            });
        });
        var uniqueAuthors = array.filter(function (value, index, self) {
            return index ===
                self.findIndex(function (t) { var _a, _b; return ((_a = t === null || t === void 0 ? void 0 : t.AssingedToUser) === null || _a === void 0 ? void 0 : _a.Id) === ((_b = value === null || value === void 0 ? void 0 : value.AssingedToUser) === null || _b === void 0 ? void 0 : _b.Id); });
        });
        uniqueAuthors === null || uniqueAuthors === void 0 ? void 0 : uniqueAuthors.map(function (item2) {
            Groups === null || Groups === void 0 ? void 0 : Groups.map(function (items, index) {
                var _a;
                (_a = items.Child) === null || _a === void 0 ? void 0 : _a.map(function (item, indexes) {
                    var _a, _b, _c, _d;
                    if (((_a = item === null || item === void 0 ? void 0 : item.AssingedToUser) === null || _a === void 0 ? void 0 : _a.Id) == ((_b = item2 === null || item2 === void 0 ? void 0 : item2.AssingedToUser) === null || _b === void 0 ? void 0 : _b.Id) ||
                        (item === null || item === void 0 ? void 0 : item.AssingedToUser) == undefined) {
                        (_d = (_c = Groups[index]) === null || _c === void 0 ? void 0 : _c.Child) === null || _d === void 0 ? void 0 : _d.splice(indexes, 1);
                    }
                });
            });
        });
        var copyListItems = __spreadArray([], uniqueAuthors, true);
        var ab = copyListItems === null || copyListItems === void 0 ? void 0 : copyListItems.map(function (val) { return val.Email; }).join(",");
        setEmail(ab);
        setAllEmployeeData(Groups);
        setTeamMembers(uniqueAuthors);
        // rerender()
    }
    ;
    var dragStart = function (e, position, index) {
        dragItem.current = position;
        dragItem.current1 = index;
        console.log(e.target.innerHTML);
    };
    // const dragEnter = (e: any, position: any, index: any) => {
    //   dragOverItem.current = position;
    //   dragOverItem.current1 = index;
    //   console.log(e.target.innerHTML);
    // };
    var drop = function (e) {
        e.preventDefault();
        console.log("drophbdj");
        var copyListItems = __spreadArray([], teamMembers, true);
        var copyListItems1 = __spreadArray([], allEmployeeData, true);
        var dragItemContent = copyListItems[dragItem.current];
        copyListItems === null || copyListItems === void 0 ? void 0 : copyListItems.splice(dragItem.current, 1);
        copyListItems1 === null || copyListItems1 === void 0 ? void 0 : copyListItems1.map(function (items, index) {
            var _a;
            if (items.Id == ((_a = dragItemContent === null || dragItemContent === void 0 ? void 0 : dragItemContent.UserGroup) === null || _a === void 0 ? void 0 : _a.Id)) {
                copyListItems1[index].Child.push(dragItemContent);
            }
        });
        dragItem.current = null;
        dragOverItem.current = null;
        setTeamMembers(copyListItems);
        setAllEmployeeData(copyListItems1);
        var ab = copyListItems === null || copyListItems === void 0 ? void 0 : copyListItems.map(function (val) { return val.Email; }).join(",");
        setEmail(ab);
    };
    var drop1 = function (e) {
        e.preventDefault();
        var copyListItems = __spreadArray([], teamMembers, true);
        var copyListItems1 = __spreadArray([], allEmployeeData, true);
        var dragItemContent = copyListItems1[dragItem.current1].Child[dragItem.current];
        // delete copyListItems1[dragItem.current1].Child[dragItem.current];
        copyListItems1[dragItem.current1].Child.splice(dragItem.current, 1);
        // copyListItems1.splice(copyListItems1[dragItem.current1].Child[dragItem.current], 1);
        copyListItems === null || copyListItems === void 0 ? void 0 : copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setTeamMembers(copyListItems);
        setAllEmployeeData(copyListItems1);
        var ab = copyListItems === null || copyListItems === void 0 ? void 0 : copyListItems.map(function (val) { return val.Email; }).join(",");
        setEmail(ab);
    };
    return (React.createElement(React.Fragment, null,
        console.log("BackupArrayBackupArrayBackupArrayBackupArray", BackupArray),
        React.createElement(Modal, { show: show, size: "lg", 
            // onHide={() => {setShow(false);item?.callBack()}}
            backdrop: "static", keyboard: false },
            React.createElement(Modal.Header, null,
                React.createElement(Modal.Title, null, "Team Members"),
                React.createElement("span", { onClick: function () { setShow(false); item === null || item === void 0 ? void 0 : item.callBack(); } },
                    React.createElement("i", { className: "svg__iconbox svg__icon--cross crossBtn" }))),
            React.createElement(Modal.Body, null,
                React.createElement("div", { className: "col m-2" },
                    React.createElement("div", { className: "col bg-ee p-1" },
                        React.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                            React.createElement("span", { className: "ps-1" }, "All Team Members"))),
                    React.createElement("div", { className: "border col p-2" },
                        React.createElement("div", { className: "taskTeamBox" }, allEmployeeData === null || allEmployeeData === void 0 ? void 0 : allEmployeeData.map(function (items, indexes) {
                            var _a;
                            return (React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "top-assign me-2" },
                                    React.createElement("div", { className: "team" },
                                        React.createElement("label", { className: "BdrBtm" }, items === null || items === void 0 ? void 0 : items.Title),
                                        React.createElement("div", { className: "d-flex" }, (_a = items === null || items === void 0 ? void 0 : items.Child) === null || _a === void 0 ? void 0 : _a.map(function (childItem, index) {
                                            var _a, _b, _c, _d, _e, _f, _g, _h;
                                            return (React.createElement("div", null,
                                                (items === null || items === void 0 ? void 0 : items.Title) == "HHHH Team" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_a = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _a === void 0 ? void 0 : _a.Url }))) : (""),
                                                items.Title == "External Staff" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_b = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _b === void 0 ? void 0 : _b.Url }))) : (""),
                                                items.Title == "Senior Developer Team" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_c = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _c === void 0 ? void 0 : _c.Url }))) : (""),
                                                items.Title == "Design Team" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_d = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _d === void 0 ? void 0 : _d.Url }))) : (""),
                                                items.Title == "Junior Developer Team" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_e = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _e === void 0 ? void 0 : _e.Url }))) : (""),
                                                (items === null || items === void 0 ? void 0 : items.Title) == "QA Team" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_f = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _f === void 0 ? void 0 : _f.Url }))) : (""),
                                                items.Title == "Smalsus Lead Team" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_g = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _g === void 0 ? void 0 : _g.Url }))) : (""),
                                                (items === null || items === void 0 ? void 0 : items.Title) == "Ex Staff" ? (React.createElement("span", null,
                                                    React.createElement("img", { onDragStart: function (e) {
                                                            return dragStart(e, index, indexes);
                                                        }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true, className: "ProirityAssignedUserPhoto", title: childItem === null || childItem === void 0 ? void 0 : childItem.Title, src: (_h = childItem === null || childItem === void 0 ? void 0 : childItem.Item_x0020_Cover) === null || _h === void 0 ? void 0 : _h.Url }))) : ("")));
                                        }))))));
                        })),
                        React.createElement("div", { className: "row m-0 mt-3" },
                            React.createElement("div", { className: "col-9 p-0" },
                                React.createElement("h6", null, "Selected Team Members"),
                                React.createElement("div", { className: "d-flex p-1  UserTimeTabGray", onDrop: function (e) { return drop1(e); }, onDragOver: function (e) { return e.preventDefault(); } }, teamMembers === null || teamMembers === void 0 ? void 0 : teamMembers.map(function (items, index) {
                                    var _a;
                                    return (React.createElement(React.Fragment, null,
                                        React.createElement("span", { onDragStart: function (e) { return dragStart(e, index, index); }, onDragOver: function (e) { return e.preventDefault(); }, key: index, draggable: true },
                                            React.createElement("img", { className: "me-1", title: items === null || items === void 0 ? void 0 : items.Title, style: { borderRadius: "20px" }, height: "35px", width: "35px", src: (_a = items === null || items === void 0 ? void 0 : items.Item_x0020_Cover) === null || _a === void 0 ? void 0 : _a.Url }))));
                                }))),
                            React.createElement("div", { className: "col-3 mt-4" },
                                React.createElement("img", { onDrop: function (e) { return drop(e); }, onDragOver: function (e) { return e.preventDefault(); }, title: "Drag user here to  remove user from team for this Network Activity.", height: "50px", width: "50px", style: { borderRadius: "25px" }, src: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Dustbin.png" })))))),
            React.createElement(Modal.Footer, { className: "border-0 pb-1 pt-0" },
                React.createElement(Button, { className: "btn btn-default", onClick: function () { setShow(false); item === null || item === void 0 ? void 0 : item.callBack(); } }, "Cancel"),
                React.createElement("a", { className: "btn btn-primary", href: "https://teams.microsoft.com/l/chat/0/0?users=".concat(email), target: "_blank", onClick: function () { setShow(false); item === null || item === void 0 ? void 0 : item.callBack(); } }, "Create")))));
}
export default ShowTeamMembers;
//# sourceMappingURL=ShowTeamMember.js.map