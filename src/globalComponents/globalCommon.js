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
import pnp, { Web } from "sp-pnp-js";
import "@pnp/sp/sputilities";
import * as moment from 'moment';
import { GlobalConstants } from '../globalComponents/LocalCommon';
import { spfi } from "@pnp/sp/presets/all";
export var pageContext = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pnp.sp.site.getContextInfo()];
            case 1:
                result = (_a.sent());
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, Promise.reject(error_1)];
            case 3: return [2 /*return*/, result];
        }
    });
}); };
export var docxUint8Array = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = [];
                return [4 /*yield*/, getData('https://hhhhteams.sharepoint.com/sites/HHHH/SP', 'e968902a-3021-4af2-a30a-174ea95cf8fa', "Id,ID,Title,Configurations&$filter=Title eq 'docxConfig'").then(function (data) {
                        var regularArray = JSON.parse(data[0].Configurations);
                        var uint8Array = new Uint8Array(regularArray).buffer;
                        result = uint8Array;
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
export var PopHoverBasedOnTaskId = function (item) {
    var _a, _b, _c;
    var returnObj = __assign({}, item);
    if (((_b = (_a = returnObj === null || returnObj === void 0 ? void 0 : returnObj.original) === null || _a === void 0 ? void 0 : _a.subRows) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        (_c = returnObj === null || returnObj === void 0 ? void 0 : returnObj.original) === null || _c === void 0 ? true : delete _c.subRows;
    }
    //    let structur= item?.original?.Title;
    //     let structureId=item?.original?.Shareweb_x0020_ID
    var structur = [returnObj === null || returnObj === void 0 ? void 0 : returnObj.original];
    var finalArray = [];
    try {
        // let parent = item?.parentRow;
        // while(parent){
        //     structur=parent?.original?.Title+' > '+structur;
        //     structureId=parent?.original?.structureId+'-'+ structureId;
        //     parent=parent?.parentRow;
        // }
        var parent_1 = returnObj === null || returnObj === void 0 ? void 0 : returnObj.getParentRow();
        while (parent_1) {
            structur.push(parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.original);
            parent_1 = parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.getParentRow();
        }
        structur.reverse;
        var finalStructure = structur[0];
        for (var i = structur.length - 1; i > 0; i--) {
            var currentObject = structur[i];
            var previousObject = structur[i - 1];
            currentObject.subRows = [];
            currentObject.subRows.push(previousObject);
        }
    }
    catch (error) {
    }
    // let finalResult ='';
    //     if(structur!=undefined&&structureId!=undefined){
    //         finalResult=structureId+' : '+structur
    //     }
    return finalArray = structur === null || structur === void 0 ? void 0 : structur.slice(-1);
};
export var hierarchyData = function (items, MyAllData) {
    var MasterListData = [];
    var ChildData = [];
    var AllData = [];
    var finalData = [];
    var SubChild = [];
    var Parent = [];
    var MainParent = [];
    try {
        MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (item) {
            if (items.Component != undefined) {
                items.Component.forEach(function (com) {
                    if (item.Id == com.Id) {
                        ChildData.push(item);
                        ChildData === null || ChildData === void 0 ? void 0 : ChildData.forEach(function (val) {
                            var _a;
                            if (((_a = val.Parent) === null || _a === void 0 ? void 0 : _a.Id) != undefined) {
                                SubChild.push(val.Parent);
                                SubChild === null || SubChild === void 0 ? void 0 : SubChild.forEach(function (item) {
                                    var _a;
                                    if (((_a = item.Parent) === null || _a === void 0 ? void 0 : _a.Id) != undefined) {
                                        Parent.push(item.Parent);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            if ((items === null || items === void 0 ? void 0 : items.Services) != undefined) {
                items.Services.forEach(function (com) {
                    if (item.Id == com.Id) {
                        ChildData.push(item);
                        ChildData === null || ChildData === void 0 ? void 0 : ChildData.forEach(function (val) {
                            var _a;
                            if (((_a = val.Parent) === null || _a === void 0 ? void 0 : _a.Id) != undefined) {
                                SubChild.push(val.Parent);
                                SubChild === null || SubChild === void 0 ? void 0 : SubChild.forEach(function (item) {
                                    MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                                        if (items.Id == item.Id) {
                                            Parent.push(items);
                                        }
                                    });
                                    Parent.forEach(function (val) {
                                        var _a;
                                        if (((_a = val.Parent) === null || _a === void 0 ? void 0 : _a.Id) != undefined) {
                                            MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                                                if (items.Id == val.Parent.Id) {
                                                    MainParent.push(items);
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
        if (MainParent != undefined && MainParent.length > 0) {
            if (MainParent != undefined && MainParent.length > 0) {
                MainParent === null || MainParent === void 0 ? void 0 : MainParent.forEach(function (val) {
                    val.subRows = [];
                    if (val.Item_x0020_Type == undefined) {
                        MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                            if (items.Id == val.Id) {
                                val.Item_x0020_Type = items.Item_x0020_Type;
                                val.PortfolioStructureID = items.PortfolioStructureID;
                            }
                        });
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                        val.SiteIconTitle = "C";
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                        val.SiteIconTitle = "S";
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                        val.SiteIconTitle = "F";
                    }
                    //val.subRows(val)
                    AllData.push(val);
                    Parent === null || Parent === void 0 ? void 0 : Parent.forEach(function (item) {
                        item.subRows = [];
                        if (item.Item_x0020_Type == undefined) {
                            MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                                if (items.Id == val.Id) {
                                    val.Item_x0020_Type = items.Item_x0020_Type;
                                    val.PortfolioStructureID = items.PortfolioStructureID;
                                }
                            });
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                            item.SiteIconTitle = "C";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                            item.SiteIconTitle = "S";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                            item.SiteIconTitle = "F";
                        }
                        AllData === null || AllData === void 0 ? void 0 : AllData.forEach(function (vall) {
                            vall.subRows.push(item);
                        });
                        //item.subRows.push(items)
                        // item.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                        // item.subRows[0].siteIcon = items?.siteIcon
                    });
                    ChildData === null || ChildData === void 0 ? void 0 : ChildData.forEach(function (item) {
                        item.subRows = [];
                        if (item.Item_x0020_Type == undefined) {
                            MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                                if (items.Id == item.Id) {
                                    item.Item_x0020_Type = items.Item_x0020_Type;
                                    item.PortfolioStructureID = items.PortfolioStructureID;
                                }
                            });
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                            item.SiteIconTitle = "C";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                            item.SiteIconTitle = "S";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                            item.SiteIconTitle = "F";
                        }
                        AllData === null || AllData === void 0 ? void 0 : AllData.forEach(function (vall) {
                            if (vall.subRows != undefined && vall.subRows.length > 0) {
                                vall.subRows.forEach(function (newItem) {
                                    newItem.subRows.push(item);
                                });
                            }
                        });
                        item.subRows.push(items);
                        item.subRows[0].PortfolioStructureID = items === null || items === void 0 ? void 0 : items.Shareweb_x0020_ID;
                        item.subRows[0].siteIcon = items === null || items === void 0 ? void 0 : items.siteIcon;
                    });
                    // ChildData?.forEach((item1: any) => {
                    //     item1.subRows = []
                    //     if (item1.Item_x0020_Type == undefined) {
                    //         MyAllData?.forEach((items: any) => {
                    //             if (items.Id == val.Id) {
                    //                 val.Item_x0020_Type = items.Item_x0020_Type;
                    //                 val.PortfolioStructureID = items.PortfolioStructureID
                    //             }
                    //         })
                    //     }
                    //     if (item1.Item_x0020_Type != undefined && item1.Item_x0020_Type === "Component") {
                    //         item1.SiteIconTitle = "C"
                    //     }
                    //     if (item1.Item_x0020_Type != undefined && item1.Item_x0020_Type === "SubComponent") {
                    //         item1.SiteIconTitle = "S"
                    //     }
                    //     if (item1.Item_x0020_Type != undefined && item1.Item_x0020_Type === "Feature") {
                    //         item1.SiteIconTitle = "F"
                    //     }
                    //     AllData?.forEach((vall: any) => {
                    //         if(vall.subRows != undefined && vall.subRows.length >0){
                    //             vall.subRows.forEach((newItem:any)=>{
                    //                 newItem.subRows.forEach((Itemsss:any)=>{
                    //                     Itemsss.subRows.push(item1)
                    //                 })
                    //             })
                    //         }
                    //     })
                    //     item1.subRows.push(items)
                    //     item1.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                    //     item1.subRows[0].siteIcon = items?.siteIcon
                    // })
                    console.log(AllData);
                    items.HierarchyData = AllData;
                    //setMasterData(newitems.HierarchyData)
                });
            }
            console.log(Parent);
        }
        if (Parent != undefined && Parent.length > 0 && MainParent.length == 0) {
            if (Parent != undefined && Parent.length > 0) {
                Parent === null || Parent === void 0 ? void 0 : Parent.forEach(function (val) {
                    val.subRows = [];
                    if (val.Item_x0020_Type == undefined) {
                        MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                            if (items.Id == val.Id) {
                                val.Item_x0020_Type = items.Item_x0020_Type;
                                val.PortfolioStructureID = items.PortfolioStructureID;
                            }
                        });
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                        val.SiteIconTitle = "C";
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                        val.SiteIconTitle = "S";
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                        val.SiteIconTitle = "F";
                    }
                    //val.subRows(val)
                    AllData.push(val);
                    SubChild === null || SubChild === void 0 ? void 0 : SubChild.forEach(function (item) {
                        item.subRows = [];
                        if (item.Item_x0020_Type == undefined) {
                            MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                                if (items.Id == val.Id) {
                                    val.Item_x0020_Type = items.Item_x0020_Type;
                                    val.PortfolioStructureID = items.PortfolioStructureID;
                                }
                            });
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                            item.SiteIconTitle = "C";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                            item.SiteIconTitle = "S";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                            item.SiteIconTitle = "F";
                        }
                        AllData === null || AllData === void 0 ? void 0 : AllData.forEach(function (vall) {
                            vall.subRows.push(item);
                        });
                        item.subRows.push(items);
                        item.subRows[0].PortfolioStructureID = items === null || items === void 0 ? void 0 : items.Shareweb_x0020_ID;
                        item.subRows[0].siteIcon = items === null || items === void 0 ? void 0 : items.siteIcon;
                    });
                    ChildData === null || ChildData === void 0 ? void 0 : ChildData.forEach(function (item) {
                        item.subRows = [];
                        if (item.Item_x0020_Type == undefined) {
                            MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                                if (items.Id == val.Id) {
                                    val.Item_x0020_Type = items.Item_x0020_Type;
                                    val.PortfolioStructureID = items.PortfolioStructureID;
                                }
                            });
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                            item.SiteIconTitle = "C";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                            item.SiteIconTitle = "S";
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                            item.SiteIconTitle = "F";
                        }
                        AllData === null || AllData === void 0 ? void 0 : AllData.forEach(function (vall) {
                            vall.subRows.push(item);
                        });
                        item.subRows.push(items);
                        item.subRows[0].PortfolioStructureID = items === null || items === void 0 ? void 0 : items.Shareweb_x0020_ID;
                        item.subRows[0].siteIcon = items === null || items === void 0 ? void 0 : items.siteIcon;
                    });
                    console.log(AllData);
                    items.HierarchyData = AllData;
                    //setMasterData(newitems.HierarchyData)
                });
            }
            console.log(Parent);
        }
        if (SubChild != undefined && SubChild.length > 0 && MainParent.length == 0) {
            SubChild === null || SubChild === void 0 ? void 0 : SubChild.forEach(function (val) {
                val.subRows = [];
                if (val.Item_x0020_Type == undefined) {
                    MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                        if (items.Id == val.Id) {
                            val.Item_x0020_Type = items.Item_x0020_Type;
                            val.PortfolioStructureID = items.PortfolioStructureID;
                        }
                    });
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                    val.SiteIconTitle = "C";
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                    val.SiteIconTitle = "S";
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                    val.SiteIconTitle = "F";
                }
                //val.subRows(val)
                AllData.push(val);
                ChildData === null || ChildData === void 0 ? void 0 : ChildData.forEach(function (item) {
                    item.subRows = [];
                    if (item.Item_x0020_Type == undefined) {
                        MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                            if (items.Id == val.Id) {
                                val.Item_x0020_Type = items.Item_x0020_Type;
                                val.PortfolioStructureID = items.PortfolioStructureID;
                            }
                        });
                    }
                    if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                        item.SiteIconTitle = "C";
                    }
                    if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                        item.SiteIconTitle = "S";
                    }
                    if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                        item.SiteIconTitle = "F";
                    }
                    AllData === null || AllData === void 0 ? void 0 : AllData.forEach(function (vall) {
                        vall.subRows.push(item);
                    });
                    item.subRows.push(items);
                    item.subRows[0].PortfolioStructureID = items === null || items === void 0 ? void 0 : items.Shareweb_x0020_ID;
                    item.subRows[0].siteIcon = items === null || items === void 0 ? void 0 : items.siteIcon;
                });
                items.HierarchyData = AllData;
                //setMasterData(newitems.HierarchyData)
            });
        }
        if (ChildData != undefined && ChildData.length > 0 && SubChild.length == 0) {
            ChildData === null || ChildData === void 0 ? void 0 : ChildData.forEach(function (val) {
                val.subRows = [];
                if (val.Item_x0020_Type == undefined) {
                    MyAllData === null || MyAllData === void 0 ? void 0 : MyAllData.forEach(function (items) {
                        if (items.Id == val.Id) {
                            val.Item_x0020_Type = items.Item_x0020_Type;
                            val.PortfolioStructureID = items.PortfolioStructureID;
                        }
                    });
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                    val.SiteIconTitle = "C";
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                    val.SiteIconTitle = "S";
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                    val.SiteIconTitle = "F";
                }
                AllData.push(val);
                val.subRows.push(items);
                val.subRows[0].PortfolioStructureID = items === null || items === void 0 ? void 0 : items.Shareweb_x0020_ID;
                val.subRows[0].siteIcon = items === null || items === void 0 ? void 0 : items.siteIcon;
                console.log(AllData);
                // items.HierarchyData = AllData
                // setMasterData(newitems.HierarchyData)
                // setData(AllData)
            });
            //  finalData = AllData.filter((val: any, id: any, array: any) => {
            //     return array.indexOf(val) == id;
            // })
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
    return AllData;
};
var sp = spfi();
export var getData = function (url, listId, query) { return __awaiter(void 0, void 0, void 0, function () {
    var web, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web = new Web(url);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, web.lists.getById(listId).items.select(query).getAll()];
            case 2:
                result = (_a.sent());
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, Promise.reject(error_2)];
            case 4: return [2 /*return*/, result];
        }
    });
}); };
export var addData = function (url, listId, item) { return __awaiter(void 0, void 0, void 0, function () {
    var web, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web = new Web(url);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, web.lists.getById(listId).items.add(item)];
            case 2:
                result = (_a.sent());
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, Promise.reject(error_3)];
            case 4: return [2 /*return*/, result];
        }
    });
}); };
export var updateItemById = function (url, listId, item, itemId) { return __awaiter(void 0, void 0, void 0, function () {
    var web, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web = new Web(url);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, web.lists.getById(listId).items.getById(itemId).update(item)];
            case 2:
                result = (_a.sent());
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, Promise.reject(error_4)];
            case 4: return [2 /*return*/, result];
        }
    });
}); };
export var deleteItemById = function (url, listId, item, itemId) { return __awaiter(void 0, void 0, void 0, function () {
    var web, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web = new Web(url);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, web.lists.getById(listId).items.getById(itemId).delete()];
            case 2:
                result = (_a.sent());
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, Promise.reject(error_5)];
            case 4: return [2 /*return*/, result];
        }
    });
}); };
export var getTaskId = function (item) {
    var Shareweb_x0020_ID = undefined;
    try {
        if (item != undefined && item.SharewebTaskType == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No == undefined && item.SharewebTaskLevel2No == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
            if (item.SharewebTaskType.Title == 'MileStone')
                Shareweb_x0020_ID = 'M' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Activities' || item.SharewebTaskType.Title == 'Project') && item.SharewebTaskLevel1No != undefined) {
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined) {
                if (item.Events.length > 0 && item.Services.length > 0 && item.Component.length > 0)
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.SharewebTaskType.Title == 'Project')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;
            if (item.Component.length === 0 && item.Services.length === 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Workstream' || item.SharewebTaskType.Title == 'Step') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if ((item.Component.length == 0 || item.Component == undefined) && (item.Services.length == 0 || item.Services == undefined) && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
            }
            if (item.SharewebTaskType.Title == 'Step')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                //  }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No == undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                //  if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-M' + item.Id;
            }
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
    return Shareweb_x0020_ID;
};
export var loadTaskUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var taskUser, web, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
                return [4 /*yield*/, web.lists
                        .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
                        .items
                        .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
                        .get()];
            case 1:
                taskUser = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, Promise.reject(error_6)];
            case 3: return [2 /*return*/, taskUser];
        }
    });
}); };
export var parseJSON = function (jsonItem) {
    var json = [];
    try {
        json = JSON.parse(jsonItem);
    }
    catch (err) {
        console.log(err);
    }
    return json;
};
export var GetIconImageUrl = function (listName, listUrl, Item) {
    var IconUrl = '';
    if (listName != undefined) {
        var TaskListsConfiguration = parseJSON(GlobalConstants.LIST_CONFIGURATIONS_TASKS);
        var TaskListItem = TaskListsConfiguration.filter(function (filterItem) {
            var SiteRelativeUrl = filterItem.siteUrl;
            return (filterItem.Title.toLowerCase() == listName.toLowerCase() && SiteRelativeUrl.toLowerCase() == (listUrl).toLowerCase());
        });
        if (TaskListItem.length > 0) {
            if (Item == undefined) {
                IconUrl = TaskListItem[0].ImageUrl;
            }
            else if (TaskListItem[0].ImageInformation != undefined) {
                var IconUrlItem = (TaskListItem[0].ImageInformation.filter(function (index, filterItem) { return filterItem.ItemType == Item.Item_x0020_Type && filterItem.PortfolioType == Item.Portfolio_x0020_Type; }));
                if (IconUrlItem != undefined && IconUrlItem.length > 0) {
                    IconUrl = IconUrlItem[0].ImageUrl;
                }
            }
        }
    }
    return IconUrl;
};
export var makePostDataForApprovalProcess = function (postData) { return __awaiter(void 0, void 0, void 0, function () {
    var TaskUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                TaskUsers = [];
                return [4 /*yield*/, loadTaskUsers().then(function (data) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        TaskUsers = data;
                        var UserManager = [];
                        TaskUsers.map(function (user) {
                            var _a, _b;
                            if (((_b = (_a = user === null || user === void 0 ? void 0 : user.Approver) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                                user.Approver.results.map(function (approver) {
                                    UserManager.push(approver === null || approver === void 0 ? void 0 : approver.Id);
                                });
                            }
                        });
                        var Item = { TaskUsers: '', postData: '' };
                        if ((((_a = postData === null || postData === void 0 ? void 0 : postData.Categories) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf('approval')) > -1) && UserManager != undefined && (UserManager === null || UserManager === void 0 ? void 0 : UserManager.length) > 0) {
                            //postData.PercentComplete = 0.01;
                            //postData.Status = "For Approval";
                            var isAvailable = false;
                            if (((_c = (_b = postData === null || postData === void 0 ? void 0 : postData.Responsible_x0020_TeamId) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                                postData.Responsible_x0020_TeamId.results.map(function (user) {
                                    UserManager.map(function (ID) {
                                        if (ID == user) {
                                            isAvailable = true;
                                        }
                                    });
                                });
                            }
                            if (!isAvailable) {
                                var TeamMembersID = [];
                                if (((_e = (_d = postData === null || postData === void 0 ? void 0 : postData.Team_x0020_MembersId) === null || _d === void 0 ? void 0 : _d.results) === null || _e === void 0 ? void 0 : _e.length) > 0) {
                                    postData.Team_x0020_MembersId.results(function (user) {
                                        UserManager.map(function (ID) {
                                            if (ID == user) {
                                                TeamMembersID.push(user);
                                            }
                                        });
                                    });
                                }
                                UserManager.map(function (ID) {
                                    TeamMembersID.push(ID);
                                });
                                postData.Team_x0020_MembersId = { results: TeamMembersID };
                            }
                            if (((_g = (_f = postData === null || postData === void 0 ? void 0 : postData.AssignedToId) === null || _f === void 0 ? void 0 : _f.results) === null || _g === void 0 ? void 0 : _g.length) > 0 && (UserManager === null || UserManager === void 0 ? void 0 : UserManager.length) > 0) {
                                UserManager.map(function (ID) {
                                    postData.AssignedToId.results.push(ID);
                                });
                            }
                            else {
                                postData.AssignedToId = { results: UserManager };
                            }
                        }
                        Item.TaskUsers = TaskUsers;
                        Item.postData = postData;
                        Promise.resolve(Item);
                    }, function (error) {
                        Promise.reject(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, Promise];
        }
    });
}); };
export var GetImmediateTaskNotificationEmails = function (item, isLoadNotification, rootsite) { var isLoadNotification; return __awaiter(void 0, void 0, void 0, function () {
    var pageContent, CurrentItem, Allmail, query, filter, listID;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, pageContext()];
            case 1:
                pageContent = _d.sent();
                isLoadNotification = isLoadNotification;
                CurrentItem = item;
                Allmail = [];
                query = '';
                if ((item != undefined) && (item.PercentComplete == 80 || item.PercentComplete == 93)) {
                    query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=TaskStatusNotification eq " + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "";
                }
                if (((item === null || item === void 0 ? void 0 : item.PercentComplete) == 80 && (item === null || item === void 0 ? void 0 : item.newCategories) == 'Immediate') || ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 90 && (item === null || item === void 0 ? void 0 : item.newCategories) == 'Immediate') || ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 90 && (item === null || item === void 0 ? void 0 : item.newCategories) == 'Email Notification')) {
                    query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=TaskStatusNotification eq " + (item === null || item === void 0 ? void 0 : item.PercentComplete) + " or AssingedToUser/Id eq " + ((_a = item === null || item === void 0 ? void 0 : item.Author) === null || _a === void 0 ? void 0 : _a.Id) + "";
                }
                if ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 5 && (item === null || item === void 0 ? void 0 : item.newCategories) == 'Immediate') {
                    query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter= AssingedToUser/Id eq " + ((_b = item === null || item === void 0 ? void 0 : item.Author) === null || _b === void 0 ? void 0 : _b.Id) + "";
                }
                if (item == undefined) {
                    query = "Id,Title,IsTaskNotifications,Email,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=IsTaskNotifications eq 1";
                }
                if ((item === null || item === void 0 ? void 0 : item.TeamLeadersId) != undefined) {
                    filter = '';
                    if ((item === null || item === void 0 ? void 0 : item.TeamLeadersId) != undefined) {
                        item.TeamLeadersId.map(function (UserId, indexing) {
                            if (item.TeamLeadersId.length - 1 != indexing)
                                filter = filter + 'AssingedToUser/Id eq ' + UserId + ' or ';
                            else
                                filter = filter + 'AssingedToUser/Id eq ' + UserId;
                        });
                    }
                    else {
                        item.TeamLeadersId.map(function (UserId, indexing) {
                            if (item.TeamLeadersId.length - 1 != indexing)
                                filter = filter + 'AssingedToUser/Id eq ' + UserId + ' or ';
                            else
                                filter = filter + 'AssingedToUser/Id eq ' + UserId;
                        });
                    }
                    query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,Email,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=" + filter;
                }
                else if (((_c = item === null || item === void 0 ? void 0 : item.TeamLeadersId) === null || _c === void 0 ? void 0 : _c.length) == 0 && isLoadNotification == 'ApprovalMail') {
                    query = "Id,Title,IsTaskNotifications,AssingedToUserId,Approver/Title,Approver/EMail,Email,Approver/Name,Approver/Id&$expand=Approver";
                }
                if (!(query != undefined && query != '')) return [3 /*break*/, 3];
                listID = rootsite != undefined ? rootsite.TaskUserlistId : GlobalConstants.ADMIN_TASK_USERS_LISTID;
                return [4 /*yield*/, getData(rootsite != undefined ? rootsite.SiteUrl : pageContent === null || pageContent === void 0 ? void 0 : pageContent.WebFullUrl, listID, query)
                        .then(function (data) {
                        var Allusers = data === null || data === void 0 ? void 0 : data.data;
                        if (item != undefined && item.TeamLeadersId != undefined && isLoadNotification != undefined && isLoadNotification != '' && isLoadNotification == 'ApprovalMail') {
                            Allusers.map(function (user) {
                                var _a, _b, _c;
                                if (((_a = CurrentItem === null || CurrentItem === void 0 ? void 0 : CurrentItem.Author) === null || _a === void 0 ? void 0 : _a.Id) == (user === null || user === void 0 ? void 0 : user.AssingedToUserId)) {
                                    if (((_c = (_b = user === null || user === void 0 ? void 0 : user.Approver) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c.length) > 0)
                                        user.Approver.results.map(function (approver) {
                                            Allmail.push(approver === null || approver === void 0 ? void 0 : approver.EMail);
                                        });
                                }
                            });
                        }
                        else {
                            Allusers.map(function (user) {
                                var _a;
                                if ((user === null || user === void 0 ? void 0 : user.Email) != null || (user === null || user === void 0 ? void 0 : user.Email) != undefined) {
                                    Allmail.push(user === null || user === void 0 ? void 0 : user.Email);
                                }
                                else if (user.AssingedToUser != undefined) {
                                    if (user.AssingedToUser.EMail != null || user.AssingedToUser.EMail != undefined) {
                                        Allmail.push((_a = user === null || user === void 0 ? void 0 : user.AssingedToUser) === null || _a === void 0 ? void 0 : _a.EMail);
                                    }
                                }
                            });
                        }
                        if (Allmail == undefined || Allmail.length == 0 && isLoadNotification == 'ApprovalMail')
                            alert("User has no Approver to send an email");
                        Promise.resolve(Allmail);
                    }, function (error) {
                        Promise.reject();
                    })];
            case 2:
                _d.sent();
                return [3 /*break*/, 4];
            case 3:
                Promise.resolve(Allmail);
                if (isLoadNotification == 'ApprovalMail')
                    alert("User has no Approver to send an email");
                _d.label = 4;
            case 4: return [2 /*return*/, Promise];
        }
    });
}); };
export var getMultiUserValues = function (item) {
    var _a;
    var users = '';
    var isuserexists = false;
    var userarray = [];
    if (((_a = item === null || item === void 0 ? void 0 : item.AssignedTo) === null || _a === void 0 ? void 0 : _a.results) != undefined)
        userarray = item.AssignedTo.results;
    for (var i = 0; i < userarray.length; i++) {
        users += userarray[i].Title + ', ';
    }
    if (users.length > 0)
        users = users.slice(0, -2);
    return users;
};
export var getListNameFromItemProperties = function (item) {
    var listName = [];
    var metadataType = item.__metadata.type;
    if (metadataType != undefined)
        listName = metadataType.split('.');
    listName = listName[2];
    if (listName != undefined)
        listName = listName.substr(0, listName.indexOf('ListItem'));
    return listName;
};
export var ConvertLocalTOServerDate = function (LocalDateTime, dtformat) { return __awaiter(void 0, void 0, void 0, function () {
    var serverDateTime, vLocalDateTime, mDateTime;
    return __generator(this, function (_a) {
        if (dtformat == undefined || dtformat == '')
            dtformat = "DD/MM/YYYY";
        // below logic works fine in all condition 
        if (LocalDateTime != '') {
            vLocalDateTime = new Date(LocalDateTime);
            mDateTime = moment(LocalDateTime);
            serverDateTime = mDateTime.tz('Europe/Berlin').format(dtformat); // 5am PDT
            //serverDateTime = mDateTime.tz('America/Los_Angeles').format(dtformat);  // 5am PDT
            return [2 /*return*/, serverDateTime];
        }
        return [2 /*return*/, ''];
    });
}); };
// export const loadRelevantTask = async (SitesTypes:any,query: any) => {
//     let taskUsers: any[]=[];
//     taskUsers=await loadTaskUsers();
//     try {
//         let SiteTaskTaggedToComp: any[] = []
//         let count = 0
//         SitesTypes.map(async (site: any) => {
//             await getData(site?.siteUrl?.Url, site?.listId, query).then((data: any) => {
//                 data.map((item: any) => {
//                     item.siteCover = site?.Item_x005F_x0020_Cover?.Url
//                     item.siteType = site.siteName;
//                     item.TaskName = item.Title;
//                     taskUsers.map((user: any) => {
//                         if (user?.AssingedToUser?.Id == item.Author.Id) {
//                             item.AuthorCover = user?.Item_x0020_Cover?.Url
//                         }
//                         if (user?.AssingedToUser?.Id == item.Editor.Id) {
//                             item.EditorCover = user?.Item_x0020_Cover?.Url
//                         }
//                     })
//                     item.Author = item.Author.Title;
//                     item.Editor = item.Editor.Title;
//                     item.PercentComplete = item?.PercentComplete * 100;
//                     item.Priority = item.Priority_x0020_Rank * 1;
//                     if (item.Categories == null)
//                         item.Categories = '';
//                     //type.Priority = type.Priority.split('')[1];
//                     //type.Component = type.Component.results[0].Title,
//                     item.ComponentTitle = '';
//                     if (item?.Component?.results?.length > 0) {
//                         item.Component.results.map((comResult: any) => {
//                             item.ComponentTitle = comResult.Title + ';' + item.ComponentTitle;
//                         })
//                     }
//                     else {
//                         item.ComponentTitle = '';
//                     }
//                     if (item?.Component?.results?.length > 0) {
//                         item['Portfoliotype'] = 'Component';
//                     }
//                     if (item?.Services?.results?.length > 0) {
//                         item['Portfoliotype'] = 'Service';
//                     }
//                     if (item?.Component?.results?.length > 0 && item?.Services?.results?.length > 0) {
//                         item['Portfoliotype'] = 'Component';
//                     }
//                     item.Shareweb_x0020_ID = getTaskId(item);
//                     item.TaskDueDate = moment(item?.DueDate).format('YYYY-MM-DD');
//                     if (item.TaskDueDate == "Invalid date" || item.TaskDueDate == undefined) {
//                         item.TaskDueDate = '';
//                     }
//                     item.CreateDate = moment(item?.Created).format('YYYY-MM-DD');
//                     item.CreatedSearch = item.CreateDate + '' + item.Author;
//                     item.DateModified = item.Modified;
//                     item.ModifiedDate = moment(item?.Modified).format('YYYY-MM-DD');
//                     item.ModifiedSearch = item.ModifiedDate + '' + item.Editor;
//                     if (item.siteType != 'Offshore Tasks') {
//                         try {
//                             SiteTaskTaggedToComp.push(item);
//                         } catch (error) {
//                             console.log(error.message)
//                         }
//                     }
//                 })
//             })
//             count++;
//             if (count == SitesTypes.length - 1) {
//                 console.log("inside Set Task")
//                 return SiteTaskTaggedToComp
//             }
//         })
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }
export var sendImmediateEmailNotifications = function (itemId, siteUrl, listId, item, RecipientMail, isLoadNotification, rootSite) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, GetImmediateTaskNotificationEmails(item, isLoadNotification, rootSite)
                    .then(function (ToEmails) { return __awaiter(void 0, void 0, void 0, function () {
                    var query;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (isLoadNotification == false)
                                    ToEmails = [];
                                if ((RecipientMail === null || RecipientMail === void 0 ? void 0 : RecipientMail.Email) != undefined && (ToEmails === null || ToEmails === void 0 ? void 0 : ToEmails.length) == 0) {
                                    ToEmails.push(RecipientMail.Email);
                                }
                                if (!(ToEmails.length > 0)) return [3 /*break*/, 2];
                                query = '';
                                query += "AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,Component/Id,Component/Title,Component/ItemType,component_x0020_link,Categories,FeedBack,component_x0020_link,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,Services/Id,Services/Title,Events/Id,Events/Title,SharewebTaskType/Id,SharewebTaskType/Title,Shareweb_x0020_ID,CompletedDate,SharewebTaskLevel1No,SharewebTaskLevel2No&$expand=AssignedTo,Component,AttachmentFiles,Author,Editor,SharewebCategories,SharewebTaskType,Services,Events&$filter=Id eq " + itemId;
                                return [4 /*yield*/, getData(siteUrl, listId, query)
                                        .then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                        var UpdateItem, siteType, pos, Commentdata, Description, pageContent, siteUrl, Name, OtherDetails, Subject, TaskDescriptionStart, NoOfApprovalTask, TaskDescription, ApprovalRejectionComments, TaskComments, TaskDashBoardURl, ApprovalDashboard, TaskDashBoardTitle, ApprovalDashboardTitle, CC, TaskDashBoardTitle, ApprovalDashboardTitle, body, from, to, cc, body, subject, ReplyTo;
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                                        return __generator(this, function (_x) {
                                            switch (_x.label) {
                                                case 0:
                                                    (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                                                        var _a, _b;
                                                        item.PercentageCompleted = (item === null || item === void 0 ? void 0 : item.PercentComplete) < 1 ? (item === null || item === void 0 ? void 0 : item.PercentComplete) * 100 : item === null || item === void 0 ? void 0 : item.PercentComplete;
                                                        item.PercentComplete = (item === null || item === void 0 ? void 0 : item.PercentComplete) < 1 ? (item === null || item === void 0 ? void 0 : item.PercentComplete) * 100 : item === null || item === void 0 ? void 0 : item.PercentComplete;
                                                        if (item.PercentageCompleted != undefined) {
                                                            item.PercentageCompleted = parseInt((item === null || item === void 0 ? void 0 : item.PercentageCompleted).toFixed(0));
                                                        }
                                                        if (item.PercentComplete != undefined) {
                                                            item.PercentComplete = parseInt((item === null || item === void 0 ? void 0 : item.PercentComplete).toFixed(0));
                                                        }
                                                        item.taskLeader = 'None';
                                                        if (((_b = (_a = item === null || item === void 0 ? void 0 : item.AssignedTo) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.length) > 0)
                                                            item.taskLeader = getMultiUserValues(item);
                                                    });
                                                    UpdateItem = data === null || data === void 0 ? void 0 : data.data[0];
                                                    if ((item === null || item === void 0 ? void 0 : item.PercentComplete) != undefined) {
                                                        item.PercentComplete = item.PercentComplete < 1 ? item.PercentComplete * 100 : item.PercentComplete;
                                                        item.PercentComplete = parseInt((item.PercentComplete).toFixed(0));
                                                        item.PercentageCompleted = item.PercentComplete;
                                                    }
                                                    if ((item === null || item === void 0 ? void 0 : item.siteType) != undefined) {
                                                        item.siteType = item.siteType.replace(/_x0020_/g, ' ');
                                                    }
                                                    siteType = getListNameFromItemProperties(UpdateItem);
                                                    UpdateItem.siteType = '';
                                                    if (UpdateItem.siteType == '') {
                                                        if (siteType != undefined) {
                                                            siteType = siteType.replace(/_x0020_/g, '%20');
                                                        }
                                                        UpdateItem.siteType = siteType;
                                                    }
                                                    UpdateItem.Shareweb_x0020_ID = getTaskId(UpdateItem);
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Author) != undefined) {
                                                        UpdateItem.Author1 = '';
                                                        UpdateItem.Author1 = UpdateItem.Author.Title;
                                                    }
                                                    else
                                                        UpdateItem.Editor1 = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Editor) != undefined) {
                                                        UpdateItem.Editor1 = '';
                                                        UpdateItem.Editor1 = UpdateItem.Editor.Title;
                                                    }
                                                    else
                                                        UpdateItem.Editor1 = '';
                                                    if (((_b = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.component_x0020_link) === null || _b === void 0 ? void 0 : _b.Url) != undefined)
                                                        UpdateItem.URL = UpdateItem.component_x0020_link.Url;
                                                    else
                                                        UpdateItem.URL = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.DueDate) != undefined)
                                                        UpdateItem.DueDate = ConvertLocalTOServerDate(UpdateItem.DueDate, 'DD-MMM-YYYY');
                                                    else
                                                        UpdateItem.DueDate = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.StartDate) != undefined)
                                                        UpdateItem.StartDate = ConvertLocalTOServerDate(UpdateItem.StartDate, 'DD-MMM-YYYY');
                                                    else
                                                        UpdateItem.StartDate = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.CompletedDate) != undefined)
                                                        UpdateItem.CompletedDate = ConvertLocalTOServerDate(UpdateItem.CompletedDate, 'DD-MMM-YYYY');
                                                    else
                                                        UpdateItem.CompletedDate = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Created) != undefined)
                                                        UpdateItem.Created = ConvertLocalTOServerDate(UpdateItem.Created, 'DD-MMM-YYYY');
                                                    else
                                                        UpdateItem.Created = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Modified) != undefined)
                                                        UpdateItem.Modified = ConvertLocalTOServerDate(UpdateItem.Modified, 'DD-MMM-YYYY');
                                                    else
                                                        UpdateItem.Modified = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) != undefined)
                                                        UpdateItem.PercentComplete = UpdateItem.PercentComplete;
                                                    else
                                                        UpdateItem.PercentComplete = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Priority) != undefined)
                                                        UpdateItem.Priority = UpdateItem.Priority;
                                                    else
                                                        UpdateItem.Priority = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Body) != undefined)
                                                        UpdateItem.Body = (_c = $.parseHTML(UpdateItem.Body)[0]) === null || _c === void 0 ? void 0 : _c.textContent;
                                                    else
                                                        UpdateItem.Body = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) != undefined)
                                                        UpdateItem.Title = UpdateItem.Title;
                                                    else
                                                        UpdateItem.Title = '';
                                                    UpdateItem.AssignedToTitle = '';
                                                    if (((_d = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.AssignedTo) === null || _d === void 0 ? void 0 : _d.results) != undefined) {
                                                        UpdateItem.AssignedTo.results.map(function (item) {
                                                            UpdateItem.AssignedToTitle += item.Title + ';';
                                                        });
                                                    }
                                                    UpdateItem.ComponentName = '';
                                                    if (((_e = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Component) === null || _e === void 0 ? void 0 : _e.results) != undefined) {
                                                        UpdateItem.Component.results.map(function (item) {
                                                            UpdateItem.ComponentName += item.Title + ';';
                                                        });
                                                    }
                                                    UpdateItem.Category = '';
                                                    UpdateItem.Categories = '';
                                                    if (((_f = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.SharewebCategories) === null || _f === void 0 ? void 0 : _f.results) != undefined) {
                                                        UpdateItem.SharewebCategories.results.map(function (item) {
                                                            UpdateItem.Categories += item.Title + ';';
                                                            UpdateItem.Category += item.Title + ',';
                                                        });
                                                    }
                                                    pos = (_g = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _g === void 0 ? void 0 : _g.lastIndexOf(',');
                                                    UpdateItem.Category = ((_h = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _h === void 0 ? void 0 : _h.substring(0, pos)) + ((_j = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _j === void 0 ? void 0 : _j.substring(pos + 1));
                                                    Commentdata = [];
                                                    UpdateItem.AllComments = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Comments) != undefined) {
                                                        Commentdata = JSON.parse(UpdateItem.Comments);
                                                        Commentdata.map(function (comment) {
                                                            UpdateItem.AllComments += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                                '<span>' +
                                                                '<div style="margin-bottom:5px;">' +
                                                                (comment === null || comment === void 0 ? void 0 : comment.AuthorName) +
                                                                ' - ' +
                                                                (comment === null || comment === void 0 ? void 0 : comment.Created) +
                                                                '</div>' +
                                                                (comment === null || comment === void 0 ? void 0 : comment.Title) +
                                                                '</span>' +
                                                                '</div>';
                                                        });
                                                    }
                                                    UpdateItem.Description = '';
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Body) != undefined && (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Body) != '')
                                                        UpdateItem.Description = UpdateItem.Body;
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.FeedBack) != undefined) {
                                                        try {
                                                            Description = JSON.parse(UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.FeedBack);
                                                            if ((Description === null || Description === void 0 ? void 0 : Description.length) > 0) {
                                                                UpdateItem.Description = '';
                                                                (_l = (_k = Description[0]) === null || _k === void 0 ? void 0 : _k.FeedBackDescriptions) === null || _l === void 0 ? void 0 : _l.map(function (description, index) {
                                                                    var _a, _b;
                                                                    var index1 = index + 1;
                                                                    var Comment = '';
                                                                    if (((_a = description === null || description === void 0 ? void 0 : description.Comments) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                                                        description.Comments.map(function (val) {
                                                                            Comment += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                                                '<span>' +
                                                                                '<div style="margin-bottom:5px;">' +
                                                                                (val === null || val === void 0 ? void 0 : val.AuthorName) +
                                                                                ' - ' +
                                                                                (val === null || val === void 0 ? void 0 : val.Created) +
                                                                                '</div>' +
                                                                                (val === null || val === void 0 ? void 0 : val.Title) +
                                                                                '</span>' +
                                                                                '</div>';
                                                                        });
                                                                    }
                                                                    UpdateItem.Description += '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' + index1 + '</span>' +
                                                                        '</td>' +
                                                                        '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                                                        '<span>' +
                                                                        (description === null || description === void 0 ? void 0 : description.Title) +
                                                                        '</span>' +
                                                                        Comment +
                                                                        '</td>' +
                                                                        '</tr>';
                                                                    if (((_b = description === null || description === void 0 ? void 0 : description.Subtext) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                                                                        description.Subtext.map(function (Childdescription, Childindex) {
                                                                            var _a;
                                                                            var Childindex1 = Childindex + 1;
                                                                            var ChildComment = '';
                                                                            if (((_a = Childdescription === null || Childdescription === void 0 ? void 0 : Childdescription.Comments) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                                                                description.Comments.map(function (Childval) {
                                                                                    ChildComment += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                                                        '<span>' +
                                                                                        '<div style="margin-bottom:5px;">' +
                                                                                        (Childval === null || Childval === void 0 ? void 0 : Childval.AuthorName) +
                                                                                        ' - ' +
                                                                                        (Childval === null || Childval === void 0 ? void 0 : Childval.Created) +
                                                                                        '</div>' +
                                                                                        (Childval === null || Childval === void 0 ? void 0 : Childval.Title) +
                                                                                        '</span>' +
                                                                                        '</div>';
                                                                                });
                                                                            }
                                                                            UpdateItem.Description += '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' + index1 + '.' + Childindex1 + '</span>' +
                                                                                '</td>' +
                                                                                '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                                                                '<span>' +
                                                                                (Childdescription === null || Childdescription === void 0 ? void 0 : Childdescription.Title) +
                                                                                '</span>' +
                                                                                ChildComment +
                                                                                '</td>' +
                                                                                '</tr>';
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                            //$scope.AdditionalTimeSpent.push(item.AdditionalTime[0]);
                                                        }
                                                        catch (e) {
                                                            console.log(e);
                                                        }
                                                    }
                                                    return [4 /*yield*/, pageContext()];
                                                case 1:
                                                    pageContent = _x.sent();
                                                    siteUrl = (pageContent === null || pageContent === void 0 ? void 0 : pageContent.SiteFullUrl) + '/sp';
                                                    Name = '';
                                                    OtherDetails = '';
                                                    Subject = '';
                                                    TaskDescriptionStart = '';
                                                    NoOfApprovalTask = '';
                                                    TaskDescription = '';
                                                    ApprovalRejectionComments = '';
                                                    TaskComments = '';
                                                    TaskDashBoardURl = '';
                                                    ApprovalDashboard = '';
                                                    TaskDashBoardTitle = '';
                                                    ApprovalDashboardTitle = '';
                                                    CC = [];
                                                    if (item == undefined) {
                                                        //Subject = "[" + siteType + "-Task] " + UpdateItem.Title + "(" + UpdateItem.Category + ")";
                                                        Subject = "[" + siteType + " - " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) + " (" + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) + "%)] " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) + "";
                                                    }
                                                    else {
                                                        if ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 5 && (item === null || item === void 0 ? void 0 : item.newCategories) == 'Immediate') {
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (item === null || item === void 0 ? void 0 : item.newCategories) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                        }
                                                        if (((_m = item === null || item === void 0 ? void 0 : item.TeamLeadersId) === null || _m === void 0 ? void 0 : _m.length) > 0 && (item === null || item === void 0 ? void 0 : item.CategoriesType) == undefined && (item === null || item === void 0 ? void 0 : item.isApprovalRejection) == undefined) {
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                        }
                                                        if ((item != undefined && ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 80 && item.newCategories == undefined) || (item.PercentComplete == 80 && item.newCategories != undefined && item.newCategories != 'Immediate' && item.newCategories != 'Email Notification'))) {
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                        }
                                                        if (item != undefined && (item === null || item === void 0 ? void 0 : item.PercentComplete) == 93) {
                                                            if ((item === null || item === void 0 ? void 0 : item.newCategories) == undefined || (item === null || item === void 0 ? void 0 : item.newCategories) == null)
                                                                item.newCategories = '';
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (item === null || item === void 0 ? void 0 : item.newCategories) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                        }
                                                        if ((item != undefined && ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 80 && (item === null || item === void 0 ? void 0 : item.newCategories) != undefined && (item === null || item === void 0 ? void 0 : item.newCategories) == 'Immediate'))) {
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (item === null || item === void 0 ? void 0 : item.newCategories) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                        }
                                                        if ((item != undefined && ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 90 && (item === null || item === void 0 ? void 0 : item.newCategories) != undefined && (item === null || item === void 0 ? void 0 : item.newCategories) == 'Email Notification'))) {
                                                            CC.push("deepak@hochhuth-consulting.de");
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (item === null || item === void 0 ? void 0 : item.newCategories) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                        }
                                                        if ((item != undefined && (item.PercentComplete == 90 && item.newCategories != undefined && item.newCategories == 'Immediate'))) {
                                                            CC.push("deepak@hochhuth-consulting.de");
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (item === null || item === void 0 ? void 0 : item.newCategories) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                        }
                                                        if (((_o = item === null || item === void 0 ? void 0 : item.CategoriesType) === null || _o === void 0 ? void 0 : _o.toLowerCase()).indexOf('draft') > -1 || ((_p = item === null || item === void 0 ? void 0 : item.CategoriesType) === null || _p === void 0 ? void 0 : _p.toLowerCase()).indexOf('approval') > -1 && (item === null || item === void 0 ? void 0 : item.PercentComplete) == 1) {
                                                            CC = [];
                                                            if (item.CategoriesType != undefined && item.CategoriesType != '')
                                                                item.CategoriesType = (_q = item === null || item === void 0 ? void 0 : item.CategoriesType) === null || _q === void 0 ? void 0 : _q.replaceAll(';', ',');
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - " + (item === null || item === void 0 ? void 0 : item.CategoriesType) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + "";
                                                            TaskDescriptionStart = 'Hi,';
                                                            TaskDescription = (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Author1) + ' has created a Task which requires your Approval.Please take your time and review:';
                                                            if ((item === null || item === void 0 ? void 0 : item.TotalApprovalTask) != undefined && (item === null || item === void 0 ? void 0 : item.TotalApprovalTask) != 0)
                                                                NoOfApprovalTask = 'Please note that you still have ' + (item === null || item === void 0 ? void 0 : item.TotalApprovalTask) + ' tasks left to approve.You can find all pending approval tasks on your task dashboard or the approval page.';
                                                            TaskDashBoardURl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskDashboard.aspx';
                                                            ApprovalDashboard = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskManagement.aspx?SmartfavoriteId=101&smartfavorite=All%20Approval%20Tasks';
                                                            TaskDashBoardTitle = 'Your Task Dashboard';
                                                            ApprovalDashboardTitle = 'Your Approval Page';
                                                        }
                                                        if ((item != undefined && ((item === null || item === void 0 ? void 0 : item.isApprovalRejection) != undefined && (item === null || item === void 0 ? void 0 : item.isApprovalRejection)))) {
                                                            CC = [];
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + " Approved";
                                                            TaskDescriptionStart = 'Hi,';
                                                            TaskDescription = 'Your task has been approved by ' + (item === null || item === void 0 ? void 0 : item.ApproverName) + ', team will process it further. Refer Approval Comments.';
                                                            TaskComments = item === null || item === void 0 ? void 0 : item.TaskComments;
                                                            ApprovalRejectionComments = '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Approval Comments:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                                                                TaskComments + '</span> </td>' +
                                                                '</tr>';
                                                        }
                                                        if ((item != undefined && ((item === null || item === void 0 ? void 0 : item.isApprovalRejection) != undefined && !(item === null || item === void 0 ? void 0 : item.isApprovalRejection)))) {
                                                            CC = [];
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " (" + (item === null || item === void 0 ? void 0 : item.PercentComplete) + "%)] " + (item === null || item === void 0 ? void 0 : item.Title) + " Rejected";
                                                            TaskDescriptionStart = 'Hi,';
                                                            TaskDescription = 'Your task has been rejected by ' + (item === null || item === void 0 ? void 0 : item.ApproverName) + '. Refer Reject Comments.';
                                                            TaskComments = item.TaskComments;
                                                            ApprovalRejectionComments = '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Rejection Comments:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                                                                TaskComments + '</span> </td>' +
                                                                '</tr>';
                                                        }
                                                        //------
                                                        if ((item === null || item === void 0 ? void 0 : item.PercentComplete) == 2 && (item === null || item === void 0 ? void 0 : item.Categories) != undefined && RecipientMail != undefined) {
                                                            CC = [];
                                                            Subject = "[" + (item === null || item === void 0 ? void 0 : item.siteType) + " - Immediate - Follow up(2 %)] " + (item === null || item === void 0 ? void 0 : item.Title);
                                                            TaskDescriptionStart = "Hi " + (RecipientMail === null || RecipientMail === void 0 ? void 0 : RecipientMail.Title) + ",";
                                                            TaskDescription = 'Your immediate attention required on this task please review and respond ASAP.';
                                                        }
                                                        //---------
                                                    }
                                                    if (Subject == undefined || Subject == '') {
                                                        if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) != undefined && (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) != '' && (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) != 1 && (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) != undefined && (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) != '' && (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category.toLowerCase('approval')) > -1)
                                                            item.CategoriesType = (_r = item === null || item === void 0 ? void 0 : item.Category) === null || _r === void 0 ? void 0 : _r.replace('Approval,', '');
                                                        Subject = "[" + siteType + " - " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) + " (" + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) + "%)] " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) + "";
                                                    }
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) != 1) {
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll('Approval,', '');
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll('Normal Approval,', '');
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll('Normal Approval', '');
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll('Quick Approval,', '');
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll('Quick Approval', '');
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll('Complex Approval,', '');
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll('Complex Approval', '');
                                                        Subject = Subject === null || Subject === void 0 ? void 0 : Subject.replaceAll(',,', ',');
                                                    }
                                                    if ((UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) == 1 && ((_s = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _s === void 0 ? void 0 : _s.toLowerCase().indexOf('approval')) > -1) {
                                                        //Subject = Subject.replaceAll('Approval,', '')
                                                        //if (Subject.indexOf('Normal Approval') <= -1 && Subject.indexOf('Quick Approval') <= -1 && Subject.indexOf('Complex Approval') <= -1)
                                                        //    Subject = Subject.replaceAll('Approval', '')
                                                        //Subject = Subject.replaceAll(',,', ',')
                                                        Subject = "[" + siteType + " - " + "Approval" + "] " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) + "";
                                                        if (((_t = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _t === void 0 ? void 0 : _t.toLowerCase().indexOf('email notification')) > -1 && ((_u = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _u === void 0 ? void 0 : _u.toLowerCase().indexOf('immediate')) > -1) {
                                                            Subject = "[" + siteType + " - " + "Approval,Email notification,Immediate" + "] " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) + "";
                                                        }
                                                        else if (((_v = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _v === void 0 ? void 0 : _v.toLowerCase().indexOf('email notification')) > -1) {
                                                            Subject = "[" + siteType + " - " + "Approval,Email notification" + "] " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) + "";
                                                        }
                                                        else if (((_w = UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Category) === null || _w === void 0 ? void 0 : _w.toLowerCase().indexOf('immediate')) > -1) {
                                                            Subject = "[" + siteType + " - " + "Approval,Immediate" + "] " + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) + "";
                                                        }
                                                    }
                                                    body = '<div>' +
                                                        '</div>' +
                                                        '<div style="margin-top:4px">' +
                                                        TaskDescriptionStart +
                                                        '</div>' +
                                                        '<div style="margin-top:6px">' +
                                                        TaskDescription +
                                                        '</div>'
                                                        + '<div style="margin-top:10px">' +
                                                        NoOfApprovalTask +
                                                        '</div>'
                                                        + '<div style="margin-top:10px;">' +
                                                        '<a style="padding-right: 17px;" href =' + TaskDashBoardURl + '>' + TaskDashBoardTitle + '</a>' +
                                                        '<a href =' + ApprovalDashboard + '>' + ApprovalDashboardTitle + '</a>' +
                                                        '</div>'
                                                        + '<div style="margin-top:15px">' +
                                                        '<a href =' + siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Id) + '&Site=' + siteType + '>' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Title) + '</a>' +
                                                        '</div>' +
                                                        '<table style="width:100%">' +
                                                        '<tbody>' +
                                                        '<td style="width:70%;vertical-align: top;">' +
                                                        '<table style="width:99%;">' +
                                                        '<tbody>' +
                                                        '<tr>'
                                                        + '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Task Id:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Shareweb_x0020_ID) + '</span></td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Component:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.ComponentName) + '</span> </td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Priority:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Priority) + '</span> </td>' +
                                                        '</tr>' +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Start Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.StartDate) + '</span></td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Completion Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.CompletedDate) + '</span> </td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Due Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.DueDate) + '</span> </td>' +
                                                        '</tr>' +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Team Members:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.AssignedToTitle) + '</span></td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created By:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Author1) + '</span> </td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Created) + '</span> </td>' +
                                                        '</tr>' +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Categories:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Categories) + '</span></td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Status:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Status) + '</span> </td>' +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">% Complete:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.PercentComplete) + '%</span> </td>' +
                                                        '</tr>' +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">URL:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                                                        (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.URL) + '</span> </td>' +
                                                        '</tr>' +
                                                        ApprovalRejectionComments +
                                                        '</tr> ' +
                                                        '</tr>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '</tbody>' +
                                                        '</table>' +
                                                        '<table style="width:99%;margin-top: 10px;">' +
                                                        '<tbody>' +
                                                        '<tr>' + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.Description) + '</tr>' +
                                                        '</tbody>' +
                                                        '</table>' +
                                                        '</td>' +
                                                        '<td style="width:22%">' +
                                                        '<table style="border:1px solid #ddd;border-radius:4px;margin-bottom:25%;width:100%">' +
                                                        '<tbody>' +
                                                        '<tr>' +
                                                        '<td style="color:#333; background-color:#f5f5f5;border-bottom:1px solid #ddd">Comments:' + '</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>' + (UpdateItem === null || UpdateItem === void 0 ? void 0 : UpdateItem.AllComments) + '</td>' +
                                                        '</tr>' +
                                                        '</tbody>' +
                                                        '</table>' +
                                                        '</td>' +
                                                        '</tr>' +
                                                        '</tbody>' +
                                                        '</table>' +
                                                        '</td>' +
                                                        '</tr>' +
                                                        '</tbody>' +
                                                        '</table>';
                                                    if (CC.length > 1)
                                                        CC.splice(1, 1);
                                                    //'<tr><td colspan="7" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' + UpdateItem.Description + '</td></tr>' +
                                                    if ((RecipientMail === null || RecipientMail === void 0 ? void 0 : RecipientMail.length) > 0) {
                                                        if (ToEmails == undefined) {
                                                            ToEmails = [];
                                                        }
                                                        RecipientMail.map(function (mail) {
                                                            ToEmails.push(mail.Email);
                                                        });
                                                    }
                                                    from = '', to = ToEmails, cc = CC, body = body, subject = Subject, ReplyTo = "deepak@hochhuth-consulting.de";
                                                    sendEmail(from, to, body, subject, ReplyTo, cc);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, function (error) {
                                        console.log(error);
                                    })];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); }, function (error) { })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var sendEmail = function (from, to, body, subject, ReplyTo, cc) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, sp.utility.sendEmail({
                        To: ['abhishek.tiwari@smalsus.com'],
                        Subject: subject,
                        Body: body
                    })];
            case 1:
                result = (_a.sent());
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                return [2 /*return*/, Promise.reject(error_7)];
            case 3: return [2 /*return*/, result];
        }
    });
}); };
export var getPortfolio = function (type) { return __awaiter(void 0, void 0, void 0, function () {
    var result, RootComponentsData, ComponentsData, SubComponentsData, FeatureData, web, componentDetails, Response_1, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                RootComponentsData = [];
                ComponentsData = [];
                SubComponentsData = [];
                FeatureData = [];
                if (!(type != undefined)) return [3 /*break*/, 6];
                web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
                componentDetails = [];
                if (!(type == 'All')) return [3 /*break*/, 2];
                return [4 /*yield*/, web.lists
                        .getById(GlobalConstants.MASTER_TASKS_LISTID)
                        .items
                        .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
                        .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
                        .top(4999)
                        .get()];
            case 1:
                componentDetails = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, web.lists
                    .getById(GlobalConstants.MASTER_TASKS_LISTID)
                    .items
                    .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
                    .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory").filter("Portfolio_x0020_Type eq '" + type + "'")
                    .top(4999)
                    .get()];
            case 3:
                componentDetails = _a.sent();
                _a.label = 4;
            case 4:
                Response_1 = [];
                return [4 /*yield*/, loadTaskUsers()];
            case 5:
                Response_1 = _a.sent();
                $.each(componentDetails, function (index, result) {
                    result.TitleNew = result.Title;
                    result.TeamLeaderUser = [];
                    result.DueDate = moment(result.DueDate).format('DD/MM/YYYY');
                    if (result.DueDate == 'Invalid date' || '') {
                        result.DueDate = result.DueDate.replaceAll("Invalid date", "");
                    }
                    if (result.PercentComplete != undefined)
                        result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
                    if (result.Short_x0020_Description_x0020_On != undefined) {
                        result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                    }
                    if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                        $.each(result.AssignedTo, function (index, Assig) {
                            if (Assig.Id != undefined) {
                                $.each(Response_1, function (index, users) {
                                    if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                        users.ItemCover = users.Item_x0020_Cover;
                                        result.TeamLeaderUser.push(users);
                                    }
                                });
                            }
                        });
                    }
                    if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                        $.each(result.Team_x0020_Members, function (index, Assig) {
                            if (Assig.Id != undefined) {
                                $.each(Response_1, function (index, users) {
                                    if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                        users.ItemCover = users.Item_x0020_Cover;
                                        result.TeamLeaderUser.push(users);
                                    }
                                });
                            }
                        });
                    }
                    if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                        $.each(result.Team_x0020_Members, function (index, catego) {
                            result.ClientCategory.push(catego);
                        });
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
                $.each(SubComponentsData, function (index, subcomp) {
                    if (subcomp.Title != undefined) {
                        $.each(FeatureData, function (index, featurecomp) {
                            if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                                subcomp['Child'].push(featurecomp);
                                ;
                            }
                        });
                    }
                });
                $.each(ComponentsData, function (index, subcomp) {
                    if (subcomp.Title != undefined) {
                        $.each(SubComponentsData, function (index, featurecomp) {
                            if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                                subcomp['Child'].push(featurecomp);
                                ;
                            }
                        });
                    }
                });
                result = componentDetails;
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_8 = _a.sent();
                return [2 /*return*/, Promise.reject(error_8)];
            case 8: return [2 /*return*/, result];
        }
    });
}); };
// ********************* This is for the Getting All Component And Service Portfolio Data ********************
export var GetServiceAndComponentAllData = function (Props) { return __awaiter(void 0, void 0, void 0, function () {
    var RootComponentsData, ComponentsData, SubComponentsData, FeatureData, TaskUsers, componentDetails, AllData, web, dataObject, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                RootComponentsData = [];
                ComponentsData = [];
                SubComponentsData = [];
                FeatureData = [];
                TaskUsers = [];
                componentDetails = [];
                AllData = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                web = new Web(Props.siteUrl);
                return [4 /*yield*/, web.lists
                        .getById(Props.MasterTaskListID)
                        .items
                        .select("ID", "Title", "DueDate", "Status", "Portfolio_x0020_Type", "Sitestagging", "ItemRank", "Item_x0020_Type", 'PortfolioStructureID', 'ClientTime', 'SiteCompositionSettings', "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
                        .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
                        .top(4999)
                        .get()];
            case 2:
                componentDetails = _a.sent();
                return [4 /*yield*/, AllTaskUsers(Props.siteUrl, Props.TaskUserListId)];
            case 3:
                // console.log("all Service and Coponent data form global Call=======", componentDetails);
                TaskUsers = _a.sent();
                $.each(componentDetails, function (index, result) {
                    var _a;
                    result.isSelected = false;
                    result.isSelected = (_a = Props === null || Props === void 0 ? void 0 : Props.selectedItems) === null || _a === void 0 ? void 0 : _a.find(function (obj) { return obj.Id === result.ID; });
                    result.TeamLeaderUser = [];
                    if (result.Portfolio_x0020_Type == Props.ComponentType) {
                        result.DueDate = moment(result.DueDate).format('DD/MM/YYYY');
                        if (result.DueDate == 'Invalid date' || '') {
                            result.DueDate = result.DueDate.replaceAll("Invalid date", "");
                        }
                        if (result.PercentComplete != undefined)
                            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
                        if (result.Short_x0020_Description_x0020_On != undefined) {
                            result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                        }
                        if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                            $.each(result.AssignedTo, function (index, Assig) {
                                if (Assig.Id != undefined) {
                                    $.each(Response, function (index, users) {
                                        if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                        }
                                    });
                                }
                            });
                        }
                        if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                            $.each(result.Team_x0020_Members, function (index, Assig) {
                                if (Assig.Id != undefined) {
                                    $.each(Response, function (index, users) {
                                        if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                        }
                                    });
                                }
                            });
                        }
                        if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                            $.each(result.Team_x0020_Members, function (index, categoryData) {
                                result.ClientCategory.push(categoryData);
                            });
                        }
                        if (result.Item_x0020_Type == 'Root Component') {
                            RootComponentsData.push(result);
                        }
                        if (result.Item_x0020_Type == 'Component') {
                            result['Child'] = [];
                            result['subRows'] = [];
                            result.SiteIconTitle = "C";
                            ComponentsData.push(result);
                        }
                        if (result.Item_x0020_Type == 'SubComponent') {
                            result['Child'] = [];
                            result['subRows'] = [];
                            result.SiteIconTitle = "S";
                            SubComponentsData.push(result);
                        }
                        if (result.Item_x0020_Type == 'Feature') {
                            result['Child'] = [];
                            result['subRows'] = [];
                            result.SiteIconTitle = "F";
                            FeatureData.push(result);
                        }
                    }
                });
                $.each(ComponentsData, function (index, subcomp) {
                    if (subcomp.Title != undefined) {
                        subcomp.NewLeble = subcomp.Title;
                        $.each(SubComponentsData, function (index, featurecomp) {
                            if (featurecomp.Parent != undefined &&
                                subcomp.Id == featurecomp.Parent.Id) {
                                featurecomp.NewLeble = subcomp.Title + " > " + featurecomp.Title;
                                subcomp["Child"].push(featurecomp);
                                AllData.push(featurecomp);
                                subcomp['subRows'].push(featurecomp);
                            }
                        });
                        $.each(FeatureData, function (index, ParentFeaturs) {
                            if (ParentFeaturs.Parent != undefined &&
                                subcomp.Id == ParentFeaturs.Parent.Id) {
                                ParentFeaturs.NewLeble = subcomp.Title + " > " + ParentFeaturs.Title;
                                ParentFeaturs.defaultChecked = true;
                                subcomp["Child"].push(ParentFeaturs);
                                AllData.push(ParentFeaturs);
                                subcomp['subRows'].push(ParentFeaturs);
                            }
                        });
                    }
                });
                $.each(SubComponentsData, function (index, subcomp) {
                    if (subcomp.Title != undefined) {
                        $.each(FeatureData, function (index, featurecomp) {
                            if (featurecomp.Parent != undefined &&
                                subcomp.Id == featurecomp.Parent.Id) {
                                featurecomp.NewLeble = subcomp.NewLeble + " > " + featurecomp.Title;
                                subcomp["Child"].push(featurecomp);
                                subcomp['subRows'].push(featurecomp);
                                AllData.push(featurecomp);
                            }
                        });
                    }
                });
                dataObject = {
                    GroupByData: ComponentsData,
                    AllData: ComponentsData.concat(AllData)
                };
                return [2 /*return*/, dataObject];
            case 4:
                error_9 = _a.sent();
                console.log("Error:", error_9);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var AllTaskUsers = function (siteUrl, ListId) { return __awaiter(void 0, void 0, void 0, function () {
    var taskUser, web, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                web = new Web(siteUrl);
                return [4 /*yield*/, web.lists
                        .getById(ListId)
                        .items
                        .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
                        .get()];
            case 1:
                taskUser = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                return [2 /*return*/, (error_10)];
            case 3: return [2 /*return*/, taskUser];
        }
    });
}); };
export var ArrayCopy = function (array) { return __awaiter(void 0, void 0, void 0, function () {
    var MainArray;
    return __generator(this, function (_a) {
        MainArray = [];
        if (array != undefined && array.length != undefined) {
            MainArray = parseJSON(JSON.stringify(array));
        }
        return [2 /*return*/, MainArray];
    });
}); };
export var getParameterByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var regex, results;
    return __generator(this, function (_a) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
        return [2 /*return*/, results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))];
    });
}); };
//# sourceMappingURL=globalCommon.js.map