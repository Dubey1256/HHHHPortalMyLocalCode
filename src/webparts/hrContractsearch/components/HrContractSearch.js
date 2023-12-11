var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import ContractSearch from './ContractSearch';
var HrContractSearch = /** @class */ (function (_super) {
    __extends(HrContractSearch, _super);
    function HrContractSearch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HrContractSearch.prototype.render = function () {
        var _a = this.props, description = _a.description, isDarkTheme = _a.isDarkTheme, environmentMessage = _a.environmentMessage, hasTeamsContext = _a.hasTeamsContext, userDisplayName = _a.userDisplayName, ContractListID = _a.ContractListID, siteUrl = _a.siteUrl;
        return (React.createElement(React.Fragment, null,
            React.createElement(ContractSearch, { props: this.props })));
    };
    return HrContractSearch;
}(React.Component));
export default HrContractSearch;
//# sourceMappingURL=HrContractSearch.js.map