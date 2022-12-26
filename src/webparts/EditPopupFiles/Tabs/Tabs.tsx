import * as React from 'react';
import TabTitle from "./TabTitle"
import '../../cssFolder/Style.scss';
type Props = {
  children: React.ReactElement[]
}

const Tabs: React.FC<Props> = ({ children }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)

  return (
    <div >
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
  
  )
}
 

export default Tabs;