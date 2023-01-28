import * as React from 'react';

import './styles.scss'
type Props = {
  title: string
}

const Tab = ({ children }:any) => {
  return <div className="tab-content border border-top-0 clearfix" >{children}</div>
}

export default Tab