import * as React from 'react';
import './styles.css';
var TabTitle = function (_a) {
    var title = _a.title, setSelectedTab = _a.setSelectedTab, index = _a.index;
    return (React.createElement("button", { type: 'button', onClick: function () { return setSelectedTab(index); } }, title));
};
export default TabTitle;
//# sourceMappingURL=TabTitle.js.map