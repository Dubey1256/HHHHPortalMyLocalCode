import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
const AddProject = () => {
    const [title, settitle] = React.useState('')
    const [lgShow, setLgShow] = useState(false);
    const OpenCreateTaskPopup = () => {
        setLgShow(true)
    }
    const addFunction = async () => {
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items.add({
            Title: `${title}`,
            Item_x0020_Type: "Project",
        }).then((res: any) => {
            setLgShow(false)
            console.log(res);
        })
    }
    const onRenderCustomFooterMain = () => {
        return (
                    
                     
                        <footer className='text-end'>
                            <Button type="button" className="me-2" variant="secondary" onClick={()=>setLgShow(false)}>Cancel</Button>
                            <Button type="button" variant="primary" onClick={() => addFunction()}>Create</Button>
                        </footer>
                   
              
                )
    }
    return (
        <>

            <Button type="button" variant="primary" className='pull-right' onClick={() => OpenCreateTaskPopup()}>Create Project</Button>

            <Panel
                headerText={`Create Project`}
                type={PanelType.medium}
                isOpen={lgShow}
                onDismiss={() => setLgShow(false)}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}>
                    
                <div className='card-body'>
                    <span >
                        <div>
                            <span>
                                <input type='text' className='form-control' placeholder='Enter Task Name' value={title} onChange={(e) => { settitle(e.target.value) }} />
                                {/* <input type='text' className='form-control' placeholder='Enter Task Name' defaultValue={title} onChange={(e) => { (e: any) => settitle(e.target.value) }} /> */}
                            </span>
                        </div>
                    </span>
                </div>
            </Panel>

        </>
    )
}

export default AddProject