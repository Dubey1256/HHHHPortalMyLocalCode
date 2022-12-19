import * as React from 'react';

import '../../cssFolder/Style.scss';
type Props = {
  title: string
}

const Tab = ({ children }:any) => {
  return <div className="nav nav-tabs nav nav-pills " >{children}</div>
}

export default Tab