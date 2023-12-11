var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as moment from 'moment';
import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import { Web } from "sp-pnp-js";
var EditContractPopup = function (props) {
    var _a;
    var _b = React.useState(false), openPopup = _b[0], setOpenPopup = _b[1];
    var _c = React.useState({}), EditData = _c[0], setEditData = _c[1];
    var _d = React.useState([]), allContactData = _d[0], setAllContactData = _d[1];
    var _e = React.useState(false), addEmp = _e[0], setaddEmp = _e[1];
    var _f = React.useState(), contactDetailsId = _f[0], setcontactDetailsId = _f[1];
    var _g = React.useState({ Title: "", contractTypeItem: "", GrossSalary: "", startDate: "", endDate: '', PersonalNumber: '', ContractSigned: '', ContractChanged: '', selectEmp: '' }), postData = _g[0], setPostData = _g[1];
    React.useEffect(function () {
        getData();
        setOpenPopup(true);
        loadContactDetails();
    }, []);
    var loadContactDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
        var web;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web = new Web(props.AllListId.EmployeeDetailListID);
                    return [4 /*yield*/, web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.select("Id,Title,ItemType,FirstName,FullName,Company,JobTitle,Item_x0020_Cover,EmployeeID/Title,StaffID,EmployeeID/Id").expand("EmployeeID").orderBy("Created", true).get()
                            .then(function (Data) {
                            console.log(Data);
                            var employecopyData = [];
                            Data.map(function (item, index) {
                                if (item.ItemType != undefined && item.ItemType != "") {
                                    if (item.ItemType == "Contact") {
                                        employecopyData.push(item);
                                    }
                                }
                            });
                            setAllContactData(employecopyData);
                        })
                            .catch(function (err) {
                            console.log(err.message);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var web, myData;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    web = new Web((_a = props.AllListId) === null || _a === void 0 ? void 0 : _a.siteUrl);
                    return [4 /*yield*/, web.lists
                            .getById((_b = props.AllListId) === null || _b === void 0 ? void 0 : _b.ContractListID)
                            .items
                            .select("Id,Title,Author/Title,Editor/Title,startDate,endDate,ContractSigned,ContractChanged,GrossSalary,PersonnelNumber,ContractId,typeOfContract,Type_OfContract/Id,Type_OfContract/Title,WorkingHours,FolderID,contractNumber,SmartInformation/Id,SmartInformation/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,HHHHStaff/Id,HHHHStaff/FullName")
                            .top(499)
                            .filter("Id eq ".concat((_c = props === null || props === void 0 ? void 0 : props.props) === null || _c === void 0 ? void 0 : _c.Id))
                            .expand("Author,Editor,EmployeeID,HHHHStaff,SmartInformation,Type_OfContract")
                            .getAll()];
                case 1:
                    myData = _d.sent();
                    console.log(myData);
                    setEditData(myData[0]);
                    return [2 /*return*/];
            }
        });
    }); };
    var onRenderCustomHeader = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "subheading" }, "Edit Contract")));
    };
    var closeOpenPopup = function () {
        setOpenPopup(false);
        props.callback();
    };
    var saveData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var staffId, web;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    staffId = '';
                    web = new Web((_a = props.AllListId) === null || _a === void 0 ? void 0 : _a.siteUrl);
                    return [4 /*yield*/, web.lists.getById((_b = props.AllListId) === null || _b === void 0 ? void 0 : _b.ContractListID).items.getById(props === null || props === void 0 ? void 0 : props.props.Id).update({
                            Title: postData.Title != '' ? postData.Title : EditData.Title,
                            startDate: postData.startDate != '' ? moment(postData.startDate).format("MM-DD-YYYY") : (EditData === null || EditData === void 0 ? void 0 : EditData.startDate) ? moment(EditData === null || EditData === void 0 ? void 0 : EditData.startDate).format("MM-DD-YYYY") : null,
                            endDate: postData.endDate != '' ? moment(postData.endDate).format("MM-DD-YYYY") : (EditData === null || EditData === void 0 ? void 0 : EditData.endDate) ? moment(EditData === null || EditData === void 0 ? void 0 : EditData.endDate).format("MM-DD-YYYY") : null,
                            ContractChanged: postData.ContractChanged != '' ? moment(postData.ContractChanged).format("MM-DD-YYYY") : (EditData === null || EditData === void 0 ? void 0 : EditData.ContractChanged) ? moment(EditData === null || EditData === void 0 ? void 0 : EditData.ContractChanged).format("MM-DD-YYYY") : null,
                            ContractSigned: postData.ContractSigned != '' ? moment(postData.ContractSigned).format("MM-DD-YYYY") : (EditData === null || EditData === void 0 ? void 0 : EditData.ContractSigned) ? moment(EditData === null || EditData === void 0 ? void 0 : EditData.ContractSigned).format("MM-DD-YYYY") : null,
                            PersonnelNumber: postData.PersonalNumber != '' ? postData.PersonalNumber : EditData.PersonnelNumber ? EditData.PersonnelNumber : '',
                            HHHHStaffId: contactDetailsId != undefined ? contactDetailsId : (_c = EditData === null || EditData === void 0 ? void 0 : EditData.HHHHStaff) === null || _c === void 0 ? void 0 : _c.Id,
                        }).then(function (res) {
                            console.log(res);
                            props.callback(res.data);
                            //let url = `https://hhhhteams.sharepoint.com/sites/HHHH/hr/SitePages/Contract-Profile.aspx`
                            //window.open(url);
                            setOpenPopup(false);
                            closeOpenPopup();
                        })];
                case 1:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var onRenderCustomFooterMain = function () {
        var _a, _b, _c, _d, _e;
        return (React.createElement("footer", null,
            React.createElement("div", { className: "align-items-center d-flex justify-content-between me-3 px-4 py-2" },
                React.createElement("div", null,
                    React.createElement("div", { className: "" },
                        "Created ",
                        React.createElement("span", { className: "font-weight-normal siteColor" },
                            "  ",
                            EditData.Created ? moment(EditData.Created).format("DD/MM/YYYY") : "",
                            "  "),
                        " By ",
                        React.createElement("span", { className: "font-weight-normal siteColor" }, ((_a = EditData.Author) === null || _a === void 0 ? void 0 : _a.Title) ? (_b = EditData.Author) === null || _b === void 0 ? void 0 : _b.Title : '')),
                    React.createElement("div", null,
                        "Last modified ",
                        React.createElement("span", { className: "font-weight-normal siteColor" },
                            " ",
                            EditData.Modified ? moment(EditData.Modified).format("DD/MM/YYYY") : ''),
                        " By ",
                        React.createElement("span", { className: "font-weight-normal siteColor" }, ((_c = EditData.Editor) === null || _c === void 0 ? void 0 : _c.Title) ? EditData.Editor.Title : '')),
                    React.createElement("div", null,
                        React.createElement("a", { className: "hreflink siteColor" },
                            React.createElement("span", { className: "alignIcon svg__iconbox hreflink mini svg__icon--trash" }),
                            React.createElement("span", null, "Delete This Item")))),
                React.createElement("div", null,
                    React.createElement("div", { className: "footer-right" },
                        React.createElement("a", { target: "_blank", className: "mx-2", "data-interception": "off", href: "".concat((_d = props.AllListId) === null || _d === void 0 ? void 0 : _d.siteUrl, "/Lists/").concat((_e = props === null || props === void 0 ? void 0 : props.props) === null || _e === void 0 ? void 0 : _e.siteType, "/EditForm.aspx?ID=").concat(EditData.ID) }, "Open Out-Of-The-Box Form"),
                        React.createElement("span", null,
                            React.createElement("button", { className: "btn btn-primary mx-1 px-3", onClick: function () { return saveData(); } }, "Save"),
                            React.createElement("button", { type: "button", className: "btn btn-default px-3" }, "Cancel")))))));
    };
    var openAddEmployeePopup = function () {
        setaddEmp(true);
    };
    var closeAddEmp = function () {
        setaddEmp(false);
        setOpenPopup(false);
    };
    var saveContractType = function (checkitem, type) {
        closeAddEmp();
        if (postData.selectEmp != undefined && postData.selectEmp != "" && type === "contact") {
            allContactData.map(function (items, index) {
                if (items.FullName === (postData === null || postData === void 0 ? void 0 : postData.selectEmp)) {
                    setcontactDetailsId(items.Id);
                }
            });
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement(Panel, { onRenderHeader: onRenderCustomHeader, type: PanelType.large, isOpen: openPopup, onDismiss: closeOpenPopup, isBlocking: false, onRenderFooter: onRenderCustomFooterMain },
                React.createElement("div", { className: 'modal-body' },
                    React.createElement("div", { className: 'row' },
                        React.createElement("div", { className: 'col-sm-3' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Contract Number"),
                                React.createElement("input", { type: "text", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", defaultValue: EditData === null || EditData === void 0 ? void 0 : EditData.contractNumber }))),
                        React.createElement("div", { className: 'col-sm-3' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Title"),
                                React.createElement("input", { type: "text", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", defaultValue: EditData === null || EditData === void 0 ? void 0 : EditData.Title, onChange: function (e) { return setPostData(__assign(__assign({}, postData), { Title: e.target.value })); } }))),
                        React.createElement("div", { className: 'col-sm-2' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Start Date"),
                                React.createElement("input", { type: "date", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", placeholder: "Enter start Date", max: "9999-12-31", min: EditData.startDate ? moment(EditData.startDate).format("YYYY-MM-DD") : "", defaultValue: EditData.startDate ? moment(EditData.startDate).format("YYYY-MM-DD") : '', onChange: function (e) { return setPostData(__assign(__assign({}, postData), { startDate: e.target.value })); } }))),
                        React.createElement("div", { className: 'col-sm-2' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "End Date"),
                                React.createElement("input", { type: "date", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", placeholder: "Enter start Date", max: "9999-12-31", min: EditData.endDate ? moment(EditData.endDate).format("YYYY-MM-DD") : "", defaultValue: EditData.endDate ? moment(EditData.endDate).format("YYYY-MM-DD") : '', onChange: function (e) { return setPostData(__assign(__assign({}, postData), { endDate: e.target.value })); } }))),
                        React.createElement("div", { className: 'col-sm-2' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Personal Number"),
                                React.createElement("input", { type: "number", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", defaultValue: EditData === null || EditData === void 0 ? void 0 : EditData.PersonnelNumber, onChange: function (e) { return setPostData(__assign(__assign({}, postData), { PersonalNumber: e.target.value })); } })))),
                    React.createElement("div", { className: 'row mt-3' },
                        React.createElement("div", { className: 'col-sm-2' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Contract Signed"),
                                React.createElement("input", { type: "date", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", placeholder: "Enter start Date", max: "9999-12-31", min: EditData.ContractSigned ? moment(EditData.ContractSigned).format("YYYY-MM-DD") : "", defaultValue: EditData.ContractSigned ? moment(EditData.ContractSigned).format("YYYY-MM-DD") : '', onChange: function (e) { return setPostData(__assign(__assign({}, postData), { ContractSigned: e.target.value })); } }))),
                        React.createElement("div", { className: 'col-sm-2' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Contract Changed"),
                                React.createElement("input", { type: "date", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", placeholder: "Enter start Date", max: "9999-12-31", min: EditData.ContractChanged ? moment(EditData.ContractChanged).format("YYYY-MM-DD") : "", defaultValue: EditData.ContractChanged ? moment(EditData.ContractChanged).format("YYYY-MM-DD") : '', onChange: function (e) { return setPostData(__assign(__assign({}, postData), { ContractChanged: e.target.value })); } }))),
                        React.createElement("div", { className: 'col-sm-2' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Gross Salary"),
                                React.createElement("input", { type: "number", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", value: EditData === null || EditData === void 0 ? void 0 : EditData.GrossSalary, onChange: function (e) { return setPostData(__assign(__assign({}, postData), { GrossSalary: e.target.value })); } }))),
                        React.createElement("div", { className: 'col-sm-3' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "HHHH Contact"),
                                React.createElement("input", { type: "text", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", value: (postData === null || postData === void 0 ? void 0 : postData.selectEmp) != '' ? postData === null || postData === void 0 ? void 0 : postData.selectEmp : (_a = EditData === null || EditData === void 0 ? void 0 : EditData.HHHHStaff) === null || _a === void 0 ? void 0 : _a.FullName }),
                                React.createElement("span", { className: "input-group-text", title: "Status Popup" },
                                    React.createElement("span", { title: "Edit Task", className: "svg__iconbox svg__icon--editBox", onClick: function () { return openAddEmployeePopup(); } })))),
                        React.createElement("div", { className: 'col-sm-3' },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("label", { className: "form-label full-width" }, "Holiday"),
                                React.createElement("input", { type: "text", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm" })))))),
            React.createElement(Panel, { onRenderHeader: onRenderCustomHeader, type: PanelType.custom, customWidth: '750px', isOpen: addEmp, onDismiss: closeAddEmp, isBlocking: false },
                React.createElement("div", { className: "modal-body" },
                    React.createElement("div", { className: "p-0 mt-2 row" },
                        allContactData.map(function (item, index) {
                            return (React.createElement("div", { key: index, className: "col-sm-4 pl-0 mb-1" },
                                React.createElement("div", { className: "SpfxCheckRadio" },
                                    React.createElement("input", { type: "radio", className: "radio", id: "html", name: "fav_language", defaultChecked: postData.contractTypeItem == item.FullName, value: item.FullName, onChange: function (e) { return setPostData(__assign(__assign({}, postData), { selectEmp: e.target.value })); } }), item === null || item === void 0 ? void 0 :
                                    item.FullName)));
                        }),
                        " "),
                    React.createElement("footer", null,
                        React.createElement("div", { className: "col-sm-12 text-end" },
                            React.createElement("button", { type: "button", className: "btn btn-primary ms-2", onClick: function () { return saveContractType(postData.contractTypeItem, "contact"); } }, "save"),
                            React.createElement("button", { type: "button", className: "btn btn-default ms-2", onClick: function () { return closeAddEmp(); } }, "Cancel"))))))));
};
export default EditContractPopup;
//# sourceMappingURL=EditContractPopup.js.map