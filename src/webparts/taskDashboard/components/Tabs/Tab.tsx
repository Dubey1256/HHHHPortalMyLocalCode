import * as React from 'react';
import './styles.css';
import "bootstrap/dist/css/bootstrap.min.css";
type Props = {
  title: string
}

const Tab = ({ children }:any) => {
  return <div className="tab-content border border-top-0 clearfix " >{children}</div>
}

export default Tab