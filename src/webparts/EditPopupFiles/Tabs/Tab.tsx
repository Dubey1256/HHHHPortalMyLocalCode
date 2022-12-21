import * as React from 'react';
<<<<<<< HEAD
//import './styles.css';
import "../../cssFolder/Style.scss";
import "../../cssFolder/site_color.scss";
=======

import '../../cssFolder/Style.scss';
>>>>>>> 741b4ffa06434f266274429b0e2503cae31b3586
type Props = {
  title: string
}

const Tab = ({ children }:any) => {
  return <div className="tab-content border border-top-0 clearfix" >{children}</div>
}

export default Tab