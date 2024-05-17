
import * as moment from 'moment';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import TimeEntryPopup from '../../globalComponents/EditTaskPopup/TimeEntryComponent';
import Tooltip from '../Tooltip';

function DisplayTimeEntry(item: any) {
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([])
    const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
    // const [AllMetadata, setMetadata] = React.useState([]);
    const [EditTaskItemitle, setEditItem] = React.useState('');
    const [collapseItem, setcollapseItem] = React.useState(true);
    const [TaskEntrypopup, setTaskEntrypopup] = React.useState(true);


    React.useEffect(() => {
        setEditItem(item.props.Title);
        setModalIsTimeOpenToTrue();;
    },
        []);
    // AddTime popup
    const OpenTimeEntryPopup = function () {
        setTaskEntrypopup(true)
    }
    const closeTaskStatusUpdatePoup = function () {
        setTaskEntrypopup(false)
    }

    function TimeCallBack(callBack: any) {

        item.CallBackTimeEntry();


    }
    const setModalIsTimeOpenToTrue = () => {
        setTimeModalIsOpen(true)
    }
    const setModalTimmeIsOpenToFalse = () => {
        TimeCallBack(false);
        setTimeModalIsOpen(false)
    }
    const onRenderCustomHeaderTimeEntry = () => {
        return (
          <>
    
            <div className='subheading'>
            {`All Time Entry -${EditTaskItemitle}`}
            </div>
            <Tooltip ComponentId='1753' />
          </>
        );
      };
      const ComponentCallBack = (dt: any) => {
        console.log(dt)
    }
    return (
        <div>

            <Panel
               onRenderHeader={onRenderCustomHeaderTimeEntry}
                isOpen={modalTimeIsOpen}
                onDismiss={setModalTimmeIsOpenToFalse}
                isBlocking={false} 
                type={PanelType.large}
                >
                <div className=''>
                    <div className=''>
                        <div className='modal-body clearfix'>
                            <TimeEntryPopup props={item.props} Context={item.Context}  parentCallback={ComponentCallBack}></TimeEntryPopup>
                        </div>
                        <div className='modal-footer'>
                        <button type="button" className="btn btn-default" onClick={setModalTimmeIsOpenToFalse}>Cancel</button>
                        <button type="button" className="btn btn-primary ms-1" onClick={setModalTimmeIsOpenToFalse}>OK</button>
                           
                        </div>
                    </div>
                </div>
            </Panel>

        </div>
    )
} export default DisplayTimeEntry;