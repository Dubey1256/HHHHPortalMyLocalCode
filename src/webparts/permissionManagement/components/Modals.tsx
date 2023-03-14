import * as React from 'react'
import {Panel } from "office-ui-fabric-react";
import { Button } from 'react-bootstrap';



const Modals = () => {
    const[readPanel,setreadPanel]:any=React.useState(false);

    const openreadPanel=()=>{
        setreadPanel(true);
     }

     const closereadPanel=()=>{
        setreadPanel(false);
     }
  return (
    <div>
        

<Panel 
            headerText="Manage Permissions" 
            
            isOpen={readPanel} 
            onDismiss={closereadPanel}
            isFooterAtBottom={true}
            // isBlocking={}
            >

</Panel>


    <Button onClick={openreadPanel}>
        Click
    </Button>

    </div>
  )
}

export default Modals