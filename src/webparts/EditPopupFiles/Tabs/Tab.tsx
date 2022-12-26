import * as React from 'react';
//import './styles.css';
import "../../cssFolder/Style.scss";
import "../../cssFolder/site_color.scss";

import '../../cssFolder/Style.scss';
type Props = {
  title: string
}

const Tab = ({ children }:any) => {
  return <div className="tab-content border border-top-0 clearfix" >{children}</div>
}

export default Tab