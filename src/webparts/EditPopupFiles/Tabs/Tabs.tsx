import * as React from 'react';
import TabTitle from "./TabTitle"
<<<<<<< HEAD
//import './styles.css';
import "../../cssFolder/Style.scss";
import "../../cssFolder/site_color.scss";
=======
import '../../cssFolder/Style.scss';
>>>>>>> 741b4ffa06434f266274429b0e2503cae31b3586
type Props = {
  children: React.ReactElement[]
}

const Tabs: React.FC<Props> = ({ children }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)

  return (
<<<<<<< HEAD
    <div className='Tabmenu'>
      <ul className="nav nav-tabs" >
=======
    <div >
      <ul className="nav nav-tabs nav nav-pills active" >
>>>>>>> 741b4ffa06434f266274429b0e2503cae31b3586
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

export default Tabs