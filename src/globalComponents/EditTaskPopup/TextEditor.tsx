import * as React from 'react';
import Popup from 'reactjs-popup';
///import 'reactjs-popup/dist/index.css';
  
import { Editor } from "react-draft-wysiwyg";
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBars , FaTimes,FaRegEdit} from "react-icons/fa";

export default function FloraEditor(props:any){
  return(
  
    <div>
       {/* <div>
       
        <FaBars style={{ position: 'absolute',
    top: '14%',
    left: '95%'}}
   /><FaTimes style={{ position: 'absolute',
   top: '14%',
   left: '98%'}}/>
       </div> */}
                <Editor
         toolbarClassName="toolbarClassName"
         wrapperClassName="wrapperClassName"
         editorClassName="editorClassName"
         wrapperStyle={{ width: '100%', border: "2px solid black", height:'60%' }}
      />
              
    </div>
  
  )
};