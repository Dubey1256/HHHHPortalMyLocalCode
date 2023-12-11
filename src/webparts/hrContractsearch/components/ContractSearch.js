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
import { Web } from "sp-pnp-js";
import GlobalCommanTable from './GlobalCommanTable';
import CreateContract from './CreateContract';
import EditContractPopup from './EditContractPopup';
var editData = {};
var ContractSearch = function (props) {
    var _a = React.useState([]), data = _a[0], setData = _a[1];
    var _b = React.useState(false), create = _b[0], setCreate = _b[1];
    var _c = React.useState(false), openEdit = _c[0], setOpenEdit = _c[1];
    var callBackArray = [];
    React.useEffect(function () {
        getData();
    }, []);
    var getData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var web, myData, date, currentdate;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    web = new Web((_a = props.props) === null || _a === void 0 ? void 0 : _a.siteUrl);
                    return [4 /*yield*/, web.lists
                            .getById((_b = props === null || props === void 0 ? void 0 : props.props) === null || _b === void 0 ? void 0 : _b.ContractListID)
                            .items
                            .select("Id,Title,Author/Title,Editor/Title,startDate,endDate,ContractSigned,ContractChanged,GrossSalary,PersonnelNumber,ContractId,typeOfContract,Type_OfContract/Id,Type_OfContract/Title,WorkingHours,FolderID,contractNumber,SmartInformation/Id,SmartInformation/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,HHHHStaff/Id,HHHHStaff/FullName")
                            .top(499)
                            .expand("Author,Editor,EmployeeID,HHHHStaff,SmartInformation,Type_OfContract")
                            .getAll()];
                case 1:
                    myData = _c.sent();
                    console.log(myData);
                    date = new Date();
                    currentdate = moment(date).format("DD/MM/YYYY");
                    myData === null || myData === void 0 ? void 0 : myData.forEach(function (val) {
                        val.ContractChanged = moment(val === null || val === void 0 ? void 0 : val.ContractChanged).format('DD/MM/YYYY');
                        val.ContractSigned = moment(val === null || val === void 0 ? void 0 : val.ContractSigned).format('DD/MM/YYYY');
                        val.startDate = moment(val === null || val === void 0 ? void 0 : val.startDate).format('DD/MM/YYYY');
                        val.endDate = moment(val === null || val === void 0 ? void 0 : val.endDate).format('DD/MM/YYYY');
                        if (val.startDate != undefined && val.startDate != null || val.endDate != undefined && val.endDate != null || val.endDate == undefined && val.endDate == null) {
                            if (val.startDate < val.endDate && val.endDate > currentdate) {
                                val.contractStatus = "Active";
                            }
                            else if (val.endDate == undefined && val.endDate == null) {
                                val.contractStatus = "";
                            }
                            else {
                                val.contractStatus = " non active";
                            }
                        }
                        ;
                    });
                    myData === null || myData === void 0 ? void 0 : myData.map(function (value) {
                        if (value.ContractChanged == 'Invalid date') {
                            value.ContractChanged = '';
                        }
                        if (value.ContractSigned == 'Invalid date') {
                            value.ContractSigned = '';
                        }
                        if (value.startDate == 'Invalid date') {
                            value.startDate = '';
                        }
                        if (value.endDate == 'Invalid date') {
                            value.endDate = '';
                        }
                    });
                    setData(myData);
                    return [2 /*return*/];
            }
        });
    }); };
    var column = React.useMemo(function () { return [
        {
            accessorFn: function (row) { return row === null || row === void 0 ? void 0 : row.ContractId; },
            id: 'Contract ID',
            header: '',
            placeholder: "Contract ID",
            size: 150,
        },
        {
            id: 'Title',
            header: '',
            accessorFn: function (row) { return row === null || row === void 0 ? void 0 : row.Title; },
            placeholder: "Title",
            size: 300,
        },
        {
            id: 'Employee',
            header: '',
            accessorFn: function (row) { var _a; return (_a = row === null || row === void 0 ? void 0 : row.HHHHStaff) === null || _a === void 0 ? void 0 : _a.FullName; },
            placeholder: "Employee",
            size: 300,
        },
        {
            id: 'typeOfContract',
            header: '',
            accessorFn: function (row) { return row === null || row === void 0 ? void 0 : row.typeOfContract; },
            placeholder: "Contract Type",
            size: 300,
        },
        {
            header: '',
            accessorKey: 'startDate',
            placeholder: "Start Date",
            size: 90,
        },
        {
            header: '',
            accessorKey: 'endDate',
            placeholder: "End Date",
            size: 90,
        },
        {
            header: '',
            accessorKey: 'ContractChanged',
            placeholder: "Contract Changed",
            size: 90,
        },
        {
            header: '',
            accessorKey: 'ContractSigned',
            placeholder: "Contract Signed",
            size: 90,
        },
        {
            id: "ff",
            accessorKey: "",
            size: 25,
            canSort: false,
            placeholder: "",
            cell: function (_a) {
                var row = _a.row;
                return (React.createElement("div", { className: "alignCenter pull-right" },
                    React.createElement("span", { className: "svg__iconbox svg__icon--edit hreflink", onClick: function () { return openEditPopup(row.original); } })));
            }
        }
    ]; }, [data]);
    var callBackData = React.useCallback(function (elem, ShowingData) {
        setCreate(false);
    }, []);
    var openEditPopup = function (data) {
        editData = data;
        setOpenEdit(true);
    };
    var createContracts = function () {
        setCreate(true);
    };
    var closeContracts = function (res) {
        data.push(res);
        setCreate(false);
    };
    var callBack = function (res) {
        setOpenEdit(false);
        getData();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: 'btnCol btn btn-primary', type: 'submit', onClick: function () { return createContracts(); } }, "Create Contract"),
        React.createElement("div", { className: 'Alltable' },
            React.createElement(GlobalCommanTable, { columns: column, data: data, callBackData: callBackData, showHeader: true })),
        create && React.createElement(CreateContract, { closeContracts: closeContracts, callback: callBackData, AllListId: props === null || props === void 0 ? void 0 : props.props }),
        openEdit && React.createElement(EditContractPopup, { props: editData, AllListId: props === null || props === void 0 ? void 0 : props.props, callback: callBack })));
};
export default ContractSearch;
//# sourceMappingURL=ContractSearch.js.map