import * as React from 'react';
import TabTitle from "./TabTitle"
import "../../cssFolder/Style.scss";
import "../../cssFolder/site_color.scss";
import '../../cssFolder/Style.scss';

type Props = {
  children: React.ReactElement[]
}

const Tabs: React.FC<Props> = ({ children }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)

  return (

    <div className='Tabmenu'>
      <ul className="nav nav-tabs">
    <div>
      <ul className="nav nav-tabs nav nav-pills active" >

        {children.map((item, index) => (
          <TabTitle
            key={index}
            title={item.props.title}
            index={index}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </ul>
      {children[selectedTab]}
    </div>
    </ul>
   </div>
  )
}
 

export default Tabs;