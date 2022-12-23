import * as React from 'react';
//import './styles.css';
import "../../cssFolder/Style.scss";
import "../../cssFolder/site_color.scss";
import Tabs from './Tabs';

import '../../cssFolder/Style.scss';
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