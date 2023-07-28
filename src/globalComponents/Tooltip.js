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
import * as React from 'react';
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentAlt, FaQuestion } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import CreateMeetingPopup from './CreateMeetingPopup';
var completeUrl = '';
var PageUrl = '';
var Test = '';
var Href = '';
var FeedBackURl = '';
var ComponentData = {
    Id: null,
    Title: null,
    Portfolio_x0020_Type: null
};
function Tooltip(props) {
    var _this = this;
    var _a = React.useState(null), projectId = _a[0], setprojectId = _a[1];
    var _b = React.useState(false), IsComponent = _b[0], setIsComponent = _b[1];
    var _c = React.useState(''), SharewebComponent = _c[0], setSharewebComponent = _c[1];
    var _d = React.useState(false), IsTask = _d[0], setIsTask = _d[1];
    // React.useEffect(() => {
    //   getQueryVariable((e: any) => e)},
    //       []);
    var feedbackInitial = function (itemType) { return __awaiter(_this, void 0, void 0, function () {
        var res, web, res, web, res, web, res, web, res, web, web, res, componentID, componentTitle, PortfolioType, Component;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getQueryVariable(function (e) { return e; });
                    if (!(itemType === 'HHHH Feedback SP')) return [3 /*break*/, 5];
                    if (!(PageUrl != undefined && PageUrl != null)) return [3 /*break*/, 5];
                    if (PageUrl == '/sitepages/team-portfolio.aspx') {
                        PageUrl = '/sitepages/component-portfolio.aspx';
                    }
                    res = [];
                    web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                    if (!((props === null || props === void 0 ? void 0 : props.ComponentId) != undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                            .select("Id,Title")
                            .filter("Id eq " + (props === null || props === void 0 ? void 0 : props.ComponentId))
                            .get()];
                case 1:
                    res = _a.sent();
                    ComponentData = res[0];
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                        .select("Id,Title")
                        .filter("FoundationPageUrl eq '" + PageUrl + "'")
                        .get()];
                case 3:
                    res = _a.sent();
                    ComponentData = res[0];
                    _a.label = 4;
                case 4:
                    if ((ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) != undefined) {
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=" + (ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) + "&Siteurl=" + Href);
                    }
                    _a.label = 5;
                case 5:
                    if (!(itemType === 'HHHH Bug')) return [3 /*break*/, 10];
                    if (!(PageUrl != undefined && PageUrl != null)) return [3 /*break*/, 10];
                    if (PageUrl == '/sitepages/team-portfolio.aspx') {
                        PageUrl = '/sitepages/component-portfolio.aspx';
                    }
                    res = [];
                    web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                    if (!((props === null || props === void 0 ? void 0 : props.ComponentId) != undefined)) return [3 /*break*/, 7];
                    return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                            .select("Id,Title")
                            .filter("Id eq " + (props === null || props === void 0 ? void 0 : props.ComponentId))
                            .get()];
                case 6:
                    res = _a.sent();
                    ComponentData = res[0];
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                        .select("Id,Title")
                        .filter("FoundationPageUrl eq '" + PageUrl + "'")
                        .get()];
                case 8:
                    res = _a.sent();
                    ComponentData = res[0];
                    _a.label = 9;
                case 9:
                    if ((ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) != undefined) {
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Bug.aspx?ComponentID=".concat(ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) + "&ComponentTitle=" + (ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Title) + "&Siteurl=" + Href);
                    }
                    else {
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Bug.aspx?ComponentTitle=".concat(ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Title));
                    }
                    _a.label = 10;
                case 10:
                    if (!(itemType === 'HHHH Design')) return [3 /*break*/, 15];
                    if (!(PageUrl != undefined && PageUrl != null)) return [3 /*break*/, 15];
                    if (PageUrl == '/sitepages/team-portfolio.aspx') {
                        PageUrl = '/sitepages/component-portfolio.aspx';
                    }
                    res = [];
                    web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                    if (!((props === null || props === void 0 ? void 0 : props.ComponentId) != undefined)) return [3 /*break*/, 12];
                    return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                            .select("Id,Title")
                            .filter("Id eq " + (props === null || props === void 0 ? void 0 : props.ComponentId))
                            .get()];
                case 11:
                    res = _a.sent();
                    ComponentData = res[0];
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                        .select("Id,Title")
                        .filter("FoundationPageUrl eq '" + PageUrl + "'")
                        .get()];
                case 13:
                    res = _a.sent();
                    ComponentData = res[0];
                    _a.label = 14;
                case 14:
                    if ((ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) != undefined) {
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Design.aspx?ComponentID=".concat(ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) + "&ComponentTitle=" + (ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Title) + "&Siteurl=" + Href);
                    }
                    else {
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Design.aspx?ComponentTitle=".concat(ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Title));
                    }
                    _a.label = 15;
                case 15:
                    if (!(itemType === 'HHHH Quick')) return [3 /*break*/, 20];
                    if (!(PageUrl != undefined && PageUrl != null)) return [3 /*break*/, 20];
                    if (PageUrl == '/sitepages/team-portfolio.aspx') {
                        PageUrl = '/sitepages/component-portfolio.aspx';
                    }
                    res = [];
                    web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                    if (!((props === null || props === void 0 ? void 0 : props.ComponentId) != undefined)) return [3 /*break*/, 17];
                    return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                            .select("Id,Title")
                            .filter("Id eq " + (props === null || props === void 0 ? void 0 : props.ComponentId))
                            .get()];
                case 16:
                    res = _a.sent();
                    ComponentData = res[0];
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                        .select("Id,Title")
                        .filter("FoundationPageUrl eq '" + PageUrl + "'")
                        .get()];
                case 18:
                    res = _a.sent();
                    ComponentData = res[0];
                    _a.label = 19;
                case 19:
                    if ((ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) != undefined) {
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateQuickTask.aspx?ComponentID=" + (ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) + "&ComponentTitle=" + (ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Title) + "&Siteurl=" + Href);
                    }
                    else {
                        alert('Component not exist for this relevant page');
                    }
                    _a.label = 20;
                case 20:
                    if (!(itemType === 'HHHH Component Page')) return [3 /*break*/, 25];
                    if (!(PageUrl != undefined && PageUrl != null)) return [3 /*break*/, 25];
                    if (PageUrl == '/sitepages/team-portfolio.aspx') {
                        PageUrl = '/sitepages/component-portfolio.aspx';
                    }
                    res = [];
                    web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                    if (!((props === null || props === void 0 ? void 0 : props.ComponentId) != undefined)) return [3 /*break*/, 22];
                    return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                            .select("Id,Title")
                            .filter("Id eq " + (props === null || props === void 0 ? void 0 : props.ComponentId))
                            .get()];
                case 21:
                    res = _a.sent();
                    ComponentData = res[0];
                    return [3 /*break*/, 24];
                case 22: return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                        .select("Id,Title")
                        .filter("FoundationPageUrl eq '" + PageUrl + "'")
                        .get()];
                case 23:
                    res = _a.sent();
                    ComponentData = res[0];
                    _a.label = 24;
                case 24:
                    if ((ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) != undefined) {
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=".concat(ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id));
                    }
                    _a.label = 25;
                case 25:
                    if (!(itemType === 'Call Notes')) return [3 /*break*/, 28];
                    if (!(PageUrl != undefined && PageUrl != null)) return [3 /*break*/, 27];
                    if (PageUrl == '/sitepages/team-portfolio.aspx') {
                        PageUrl = '/sitepages/component-portfolio.aspx';
                    }
                    web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                    return [4 /*yield*/, web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
                            .select("Id,Title,Portfolio_x0020_Type")
                            .filter("FoundationPageUrl eq '" + PageUrl + "'")
                            .get()];
                case 26:
                    res = _a.sent();
                    ComponentData = res[0];
                    console.log(res);
                    if ((ComponentData === null || ComponentData === void 0 ? void 0 : ComponentData.Id) != undefined) {
                        componentID = ComponentData.Id;
                        componentTitle = ComponentData.Title;
                        PortfolioType = ComponentData.Portfolio_x0020_Type;
                    }
                    Component = {};
                    Component['componentID'] = componentID;
                    Component['componentTitle'] = componentTitle;
                    Component['PortfolioType'] = PortfolioType;
                    _a.label = 27;
                case 27:
                    setSharewebComponent(Component);
                    setIsComponent(true);
                    _a.label = 28;
                case 28: return [2 /*return*/];
            }
        });
    }); };
    var currentUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        console.log(query);
        //Test = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx'
        var vars = query.split("&");
        Href = window.location.href;
        // Href = Href.toLowerCase().split('?')[0]
        Href = Href.split('#')[0];
        var parts = window.location.href.toLowerCase().split("/");
        var sitePagesIndex = parts.indexOf("sites");
        completeUrl = parts.slice(sitePagesIndex).join("/");
        var foundationUrl = completeUrl.toLowerCase().split("/");
        var foundationPageIndex = foundationUrl.indexOf("sitepages");
        foundationUrl = foundationUrl.slice(foundationPageIndex).join("/");
        PageUrl = foundationUrl.toLowerCase().split('?')[0];
        PageUrl = '/' + PageUrl;
        PageUrl = PageUrl.split('#')[0];
        console.log(vars);
        return (false);
    }
    var Call = React.useCallback(function () {
        setIsComponent(false);
        setIsTask(false);
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement(Popup, { trigger: React.createElement("button", { type: 'button', className: 'burgerMenu' },
                React.createElement("span", { className: "svg__iconbox svg__icon--burgerMenu" })), position: "left top", on: "hover", closeOnDocumentClick: true, mouseLeaveDelay: 300, mouseEnterDelay: 0, 
            // contentStyle={{ padding: '0px', border: '1px' }}
            arrow: false, className: 'feedbackpanel' },
            React.createElement("div", { className: 'dropdown-menu show dropdown-menu-end toolmenu' },
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function () { return feedbackInitial('HHHH Feedback SP'); } },
                    React.createElement(FaCommentAlt, null),
                    " HHHH Feedback SP"),
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function () { return feedbackInitial('HHHH Bug'); } },
                    React.createElement(FaCommentAlt, null),
                    " HHHH Bug"),
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function () { return feedbackInitial('HHHH Design'); } },
                    React.createElement(FaCommentAlt, null),
                    " HHHH Design"),
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function () { return feedbackInitial('HHHH Quick'); } },
                    React.createElement(FaCommentAlt, null),
                    " HHHH Quick"),
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function () { return feedbackInitial('HHHH Component Page'); } },
                    React.createElement(FaCommentAlt, null),
                    " HHHH Component Page"),
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function (e) { return feedbackInitial('Call Notes'); } },
                    React.createElement(FaCommentAlt, null),
                    " Call Notes"),
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function () { return feedbackInitial('Admin Help'); } },
                    React.createElement(FaQuestion, null),
                    " Admin Help"),
                React.createElement("a", { className: 'dropdown-item hreflink', onClick: function () { return feedbackInitial('Help'); } },
                    React.createElement(FaQuestion, null),
                    " Help"))),
        IsComponent && React.createElement(CreateMeetingPopup, { Item: SharewebComponent, Call: Call })));
}
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map