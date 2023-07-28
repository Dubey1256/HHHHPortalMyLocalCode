import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Panel, PanelType } from 'office-ui-fabric-react';
var CreateMeetingPopup = function (Item) {
    var _a = React.useState(true), modalopen = _a[0], setmodalopen = _a[1];
    var ModalIsOpenToFalse = function () {
        // setmodalopen(false)
        var callBack = Item.Call;
        callBack();
        setmodalopen(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Panel, { headerText: 'CreateTask ', type: PanelType.medium, isOpen: modalopen, onDismiss: ModalIsOpenToFalse, isBlocking: false },
            React.createElement("div", { className: 'modal-body' },
                React.createElement("div", { className: "row panel-padding tab-content mb-10 bdrbox" },
                    React.createElement("div", { className: "row mt-10 padL-0 PadR0" },
                        React.createElement("div", { className: "col-sm-7 padL-0" },
                            React.createElement("div", { className: "col-sm-12 padL-0 mb-10" },
                                React.createElement("label", { className: "full_width" }, "Task Name"),
                                React.createElement("input", { className: "form-control", type: "text", "ng-required": "true", placeholder: "Enter Task Name" }))),
                        React.createElement("div", { className: "col-sm-3" },
                            React.createElement("label", { className: "full_width" }, "Component"),
                            React.createElement("div", { "ng-show": "data.SelectedComponent.length==0", className: "col-sm-11 mb-10 padL-0" },
                                React.createElement("input", { type: "text", className: "form-control ui-autocomplete-input", id: "txtSharewebComponentcrt", autoComplete: "off" }),
                                React.createElement("span", { role: "status", "aria-live": "polite", className: "ui-helper-hidden-accessible" })),
                            React.createElement("div", { className: "col-sm-1 no-padding" },
                                React.createElement("img", { src: "https://www.shareweb.ch/_layouts/15/images/EMMCopyTerm.png", "ng-click": "openSmartTaxonomyPopup('Components', Item.SharewebComponent, data);" }))),
                        React.createElement("div", { className: "col-sm-2 PadR0" },
                            React.createElement("label", { htmlFor: "Site", className: "full_width" }, "Site"),
                            React.createElement("select", { id: "Site", className: "form-control", "ng-required": "true", "ng-model": "data.Site" },
                                React.createElement("option", { value: "DE" }, "DE"),
                                React.createElement("option", { value: "Education" }, "Education"),
                                React.createElement("option", { value: "EI" }, "EI"),
                                React.createElement("option", { value: "EPS" }, "EPS"),
                                React.createElement("option", { value: "Gruene" }, "Gruene"),
                                React.createElement("option", { value: "Health" }, "Health"),
                                React.createElement("option", { value: "HHHH" }, "HHHH"),
                                React.createElement("option", { value: "ALAKDigital" }, "DA"),
                                React.createElement("option", { value: "KathaBeck" }, "KathaBeck"),
                                React.createElement("option", { value: "Shareweb" }, "Shareweb"),
                                React.createElement("option", { value: "SmallProjects" }, "Small Projects"),
                                React.createElement("option", { value: "OffshoreTasks" }, "Offshore Tasks"))),
                        React.createElement("div", { className: "row padL-0 mb-10 PadR0" },
                            React.createElement("label", { className: "full_width" }, "Url"),
                            React.createElement("input", { className: "form-control", type: "text", "ng-required": "true", placeholder: "Url", "ng-model": "data.URL" })),
                        React.createElement("div", { className: "row commentForAdmin padL-0 PadR0", style: { width: "100%" }, "ng-cloak": true },
                            React.createElement("label", null, "Description"),
                            React.createElement("div", { className: "col-sm-12" }),
                            React.createElement("div", { className: "col-sm-12 padding-0 Createmeetingdes" },
                                React.createElement("textarea", { rows: 4 })),
                            React.createElement("div", { className: "clearfix" }))))),
            React.createElement("footer", null,
                React.createElement("button", { type: "button", className: 'btn btn-primary' }, "Submit")))));
};
export default CreateMeetingPopup;
//# sourceMappingURL=CreateMeetingPopup.js.map