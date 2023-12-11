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
import * as React from "react";
import { Web } from "sp-pnp-js";
import { Panel, PanelType } from "office-ui-fabric-react";
import EditContractPopup from "./EditContractPopup";
var ResData = {};
var CreateContract = function (props) {
    var _a, _b;
    var ContractListId = (_a = props.AllListId) === null || _a === void 0 ? void 0 : _a.ContractListID;
    var siteUrl = (_b = props.AllListId) === null || _b === void 0 ? void 0 : _b.siteUrl;
    var _c = React.useState(false), createPopup = _c[0], setCreatePopup = _c[1];
    var _d = React.useState(false), openEditPopup = _d[0], setOpenEditPopup = _d[1];
    var _e = React.useState(false), contractType = _e[0], setContractType = _e[1];
    var _f = React.useState(false), addEmp = _f[0], setaddEmp = _f[1];
    var _g = React.useState([]), allContactData = _g[0], setAllContactData = _g[1];
    var _h = React.useState([]), smarttaxonomy = _h[0], setSmarttaxonomy = _h[1];
    var _j = React.useState(), contactDetailsId = _j[0], setcontactDetailsId = _j[1];
    var _k = React.useState({
        Title: "",
        contractTypeItem: "",
        checkContractitem: "",
        selectEmp: ""
    }), postData = _k[0], setPostData = _k[1];
    var _l = React.useState(""), contractTypeSuffix = _l[0], setcontractTypeSuffix = _l[1];
    React.useEffect(function () {
        loadContactDetails();
        LoadSmartTaxonomy();
        AddTaskTimepopup();
    }, []);
    var AddTaskTimepopup = function () {
        setCreatePopup(true);
    };
    var loadContactDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
        var web;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web = new Web(siteUrl);
                    return [4 /*yield*/, web.lists.getById(props.AllListId.EmployeeDetailListID).items.select("Id,Title,ItemType,FirstName,FullName,Company,JobTitle,Item_x0020_Cover,EmployeeID/Title,StaffID,EmployeeID/Id").expand("EmployeeID").orderBy("Created", true).get()
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
    var LoadSmartTaxonomy = function () { return __awaiter(void 0, void 0, void 0, function () {
        var web;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web = new Web(siteUrl);
                    return [4 /*yield*/, web.lists.getById(props.AllListId.SmartMetaDataListID).items.select("Id,Title,TaxType,Suffix").get()
                            .then(function (Data) {
                            console.log("smart metadata", Data);
                            var smarttaxonomyArray = [];
                            Data.map(function (item, index) {
                                if (item.TaxType != undefined && item.TaxType != null) {
                                    if (item.TaxType == 'Contract') {
                                        smarttaxonomyArray.push(item);
                                    }
                                }
                            });
                            setSmarttaxonomy(smarttaxonomyArray);
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
    var closeAddTaskTimepopup = function () {
        setCreatePopup(false);
        props.closeContracts();
    };
    var onRenderCustomHeader = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "subheading" }, "Create Contract")));
    };
    var openAddEmployeePopup = function () {
        setaddEmp(true);
    };
    var closeAddEmp = function () {
        setaddEmp(false);
    };
    var openContractTypePopup = function () {
        setContractType(true);
    };
    var closeContractTypePopup = function () {
        setContractType(false);
    };
    var createEmp = function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractNumber, contractId, web_1, web;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((postData === null || postData === void 0 ? void 0 : postData.contractTypeItem) != undefined && (postData === null || postData === void 0 ? void 0 : postData.contractTypeItem) != "")) return [3 /*break*/, 2];
                    web_1 = new Web(siteUrl);
                    return [4 /*yield*/, web_1.lists.getById(ContractListId).items.select("Id,contractNumber,Title,ContractId,typeOfContract").filter("typeOfContract eq'" + (postData === null || postData === void 0 ? void 0 : postData.contractTypeItem) + "'").orderBy("Created", false).top(1).get()
                            .then(function (Data) {
                            var contractNumberlength;
                            console.log("contract list data ", Data);
                            if (Data != undefined && Data.length > 0) {
                                contractNumber = Data[0].contractNumber + 1;
                                console.log(contractTypeSuffix + "-" + contractNumber);
                                var Contractlength = contractNumber.toString();
                                contractNumberlength = Contractlength.length;
                                console.log("length of contract number ", contractNumberlength);
                                // setContractNumber(contractNumber) ;
                            }
                            if (Data == undefined || Data.length == 0) {
                                contractNumber = 1;
                                var Contractlength = contractNumber.toString();
                                contractNumberlength = Contractlength.length;
                                // setContractNumber(contractNumber);
                            }
                            if (contractNumberlength == 0 && contractNumberlength == "") {
                                contractId = contractTypeSuffix + "-" + "0000" + contractNumber;
                                // setcontractId(contractId);
                            }
                            else if (contractNumberlength == 1 && contractNumberlength > 0 && contractNumberlength != "" && contractNumberlength != undefined) {
                                contractId = contractTypeSuffix + "-" + "0000" + contractNumber;
                                // setcontractId(contractId);
                            }
                            else if (contractNumberlength == 2 && contractNumberlength > 0 && contractNumberlength != "" && contractNumberlength != undefined) {
                                contractId = contractTypeSuffix + "-" + "000" + contractNumber;
                                // setcontractId(contractId);
                            }
                            else if (contractNumberlength == 3 && contractNumberlength > 0 && contractNumberlength != "" && contractNumberlength != undefined) {
                                contractId = contractTypeSuffix + "-" + "00" + contractNumber;
                                // setcontractId(contractId);
                            }
                            else if (contractNumberlength == 4 && contractNumberlength > 0 && contractNumberlength != "" && contractNumberlength != undefined) {
                                contractId = contractTypeSuffix + "-" + "0" + contractNumber;
                                // setcontractId(contractId);
                            }
                        })
                            .catch(function (err) {
                            console.log(err.message);
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    console.log(contractNumber);
                    console.log(contractId);
                    console.log(contactDetailsId);
                    web = new Web(siteUrl);
                    return [4 /*yield*/, web.lists.getById(ContractListId).items.add({
                            Title: postData === null || postData === void 0 ? void 0 : postData.Title,
                            typeOfContract: postData === null || postData === void 0 ? void 0 : postData.contractTypeItem,
                            HHHHStaffId: contactDetailsId,
                            contractNumber: contractNumber,
                            ContractId: contractId
                        })
                            .then(function (res) {
                            console.log(res);
                            closeAddEmp();
                            ResData = res.data;
                            setOpenEditPopup(true);
                            //props.closeContracts(res.data)
                        })
                            .catch(function (err) {
                            console.log(err.message);
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var saveContractType = function (checkitem, type) {
        closeContractTypePopup();
        closeAddEmp();
        if (postData.checkContractitem != undefined && postData.checkContractitem != "" && type === "contract") {
            smarttaxonomy.map(function (items, index) {
                if (items.Title === checkitem) {
                    setPostData(__assign(__assign({}, postData), { checkContractitem: items.Id }));
                    setcontractTypeSuffix(items.Suffix);
                }
            });
            setPostData(__assign(__assign({}, postData), { checkContractitem: checkitem }));
            closeContractTypePopup();
        }
        else if (postData.selectEmp != undefined && postData.selectEmp != "" && type === "contact") {
            allContactData.map(function (items, index) {
                var _a;
                if (items.FullName === (postData === null || postData === void 0 ? void 0 : postData.selectEmp)) {
                    setcontactDetailsId((_a = items.EmployeeID) === null || _a === void 0 ? void 0 : _a.Id);
                }
            });
        }
    };
    var callback = function () {
        setOpenEditPopup(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Panel, { onRenderHeader: onRenderCustomHeader, type: PanelType.custom, customWidth: '750px', isOpen: createPopup, onDismiss: closeAddTaskTimepopup, isBlocking: false },
            React.createElement("div", null,
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-sm-4" },
                        React.createElement("div", { className: "input-group" },
                            React.createElement("label", { className: "form-label full-width" }, "Title"),
                            React.createElement("input", { type: "text", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", onChange: function (e) { return setPostData(__assign(__assign({}, postData), { Title: e.target.value })); } }))),
                    React.createElement("div", { className: "col-sm-4" },
                        React.createElement("div", { className: "input-group" },
                            React.createElement("label", { className: "form-label full-width" }, "Employee Name"),
                            React.createElement("input", { type: "text", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", value: postData === null || postData === void 0 ? void 0 : postData.selectEmp }),
                            React.createElement("span", { className: "input-group-text", title: "Status Popup" },
                                React.createElement("span", { title: "Edit Task", className: "svg__iconbox svg__icon--editBox", onClick: function () { return openAddEmployeePopup(); } })))),
                    React.createElement("div", { className: "col-sm-4" },
                        React.createElement("div", { className: "input-group" },
                            React.createElement("label", { className: "form-label full-width" }, "Contract Type"),
                            React.createElement("input", { type: "text", className: "form-control", "aria-label": "Small", "aria-describedby": "inputGroup-sizing-sm", value: postData === null || postData === void 0 ? void 0 : postData.contractTypeItem }),
                            React.createElement("span", { className: "input-group-text", title: "Status Popup" },
                                React.createElement("span", { title: "Edit Task", className: "svg__iconbox svg__icon--editBox", onClick: function () { return openContractTypePopup(); } })))),
                    React.createElement("footer", null,
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col-sm-12 text-end mt-2" },
                                React.createElement("button", { type: "button", className: "btn btn-primary ms-2" }, "Add New Employee"),
                                React.createElement("button", { type: "button", className: "btn btn-primary ms-2", onClick: function () { return createEmp(); } }, "Create"),
                                React.createElement("button", { type: "button", className: "btn btn-default ms-2", onClick: function () { return closeAddTaskTimepopup(); } }, "Cancel"))))))),
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
                        React.createElement("button", { type: "button", className: "btn btn-default ms-2", onClick: function () { return closeAddEmp(); } }, "Cancel"))))),
        React.createElement(Panel, { onRenderHeader: onRenderCustomHeader, type: PanelType.custom, customWidth: '500px', isOpen: contractType, onDismiss: closeContractTypePopup, isBlocking: false },
            React.createElement("div", { className: "modal-body" },
                React.createElement("div", { className: "mt-2" }, smarttaxonomy.map(function (item, index) {
                    return (React.createElement("div", { className: "SpfxCheckRadio", key: index },
                        React.createElement("input", { type: "radio", className: "radio", id: "html", name: "fav_language", defaultChecked: postData.contractTypeItem == item.Title, value: item === null || item === void 0 ? void 0 : item.Title, onChange: function (e) {
                                return setPostData(__assign(__assign({}, postData), { contractTypeItem: e.target.value }));
                            } }),
                        item.Title));
                }))),
            React.createElement("footer", null,
                React.createElement("div", { className: "col-sm-12 text-end" },
                    React.createElement("button", { type: "button", className: "btn btn-primary ms-2", onClick: function () { return saveContractType(postData.contractTypeItem, "contract"); } }, "save"),
                    React.createElement("button", { type: "button", className: "btn btn-default ms-2", onClick: function () { return closeContractTypePopup(); } }, "Cancel")))),
        openEditPopup && React.createElement(EditContractPopup, { props: ResData, AllListId: props.AllListId, callback: callback })));
};
export default CreateContract;
//# sourceMappingURL=CreateContract.js.map