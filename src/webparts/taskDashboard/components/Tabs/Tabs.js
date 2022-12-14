import * as React from 'react';
import TabTitle from "./TabTitle";
import './styles.css';
var Tabs = function (_a) {
    var children = _a.children;
    var _b = React.useState(0), selectedTab = _b[0], setSelectedTab = _b[1];
    return (React.createElement("div", { className: "nav nav-tabs nav nav-pills " },
        React.createElement("ul", null, children.map(function (item, index) { return (React.createElement(TabTitle, { key: index, title: item.props.title, index: index, setSelectedTab: setSelectedTab })); })),
        children[selectedTab]));
};
export default Tabs;
//# sourceMappingURL=Tabs.js.map