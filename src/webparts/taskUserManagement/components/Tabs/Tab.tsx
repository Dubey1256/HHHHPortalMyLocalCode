import * as React from 'react';
import './styles.css';
type Props = {
  title: string
}

const Tab: React.FC<Props> = ({ children }) => {
  return <div className="nav nav-tabs nav nav-pills " >{children}</div>
}

export default Tab