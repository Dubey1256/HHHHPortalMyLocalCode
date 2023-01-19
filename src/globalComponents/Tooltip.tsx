import * as React from 'react';
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentAlt, FaQuestion, FaBars } from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi';
function Tooltip() {
  // const [isShown, setIsShown] = React.useState(false);
  return (
    <Popup
      trigger={
      <BiMenu />
      }
      position="left top"
      on="hover"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: '1px' }}
      arrow={false}
    >
      {/* {isShown && ( */}
      <div className='dropdown-menu show dropdown-menu-end toolmenu'>
        <a href="#" className='dropdown-item'><FaCommentAlt /> HHHH Feedback SP</a>
        <a href="#" className='dropdown-item'><FaCommentAlt /> HHHH Bug</a>
        <a href="#" className='dropdown-item'><FaCommentAlt /> HHHH Design</a>
        <a href="#" className='dropdown-item'><FaCommentAlt /> HHHH Quick</a>
        <a href="#" className='dropdown-item'><FaCommentAlt /> HHHH Component Page</a>
        <a href="#" className='dropdown-item'><FaCommentAlt /> Call Notes</a>
        <a href="#" className='dropdown-item'><FaQuestion /> Admin Help</a>
        <a href="#" className='dropdown-item'><FaQuestion /> Help</a>
      </div>
    </Popup>
  )
}
export default Tooltip;