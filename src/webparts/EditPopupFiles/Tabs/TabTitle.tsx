import * as React from 'react';

import '../../cssFolder/Style.scss';
import Tabs from './Tabs';
type Props = {
  title: string
  index: number
  setSelectedTab: (index: number) => void
}

const TabTitle: React.FC<Props> = ({ title, setSelectedTab, index }) => {
const  [tabselect, settabselect] = React.useState(0);
  return (
      <button  type='button' className={Tabs.length ==0 ?'nav-link':'nav-link'}  onClick={() => setSelectedTab(index)}>{title}</button>
  )
}

export default TabTitle