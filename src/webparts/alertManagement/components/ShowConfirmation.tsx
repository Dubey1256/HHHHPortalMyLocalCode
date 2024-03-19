import React from 'react';
import { Web } from "sp-pnp-js";
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import {GlobalConstants} from "../../../globalComponents/LocalCommon";
import { ModalBody, ModalFooter } from 'react-bootstrap';
import * as globalCommon from '../../../globalComponents/globalCommon'
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import moment from "moment";
import { error } from 'jquery';
const ShowConfirmation = (props:any)=>{
    let confirmation = props.confirmation; 
    let Item = props.Item;   
    let web = new Web(props.Context.ContextValue._pageContext._web.absoluteUrl.split('/SP')[0]);
    let parenturl = props.Context.ContextValue._pageContext._web.absoluteUrl.split('/SP')[0];
    let [confirmationItem,setconfirmationItem] = React.useState<any>([]);
    let [isdelete,setisdelete] = React.useState(false);   
    React.useEffect(() => {       
        LoadcolumnsItem();
        setisdelete(true);        
    }, [confirmation]); 

    const LoadcolumnsItem = ()=>{
        web.lists.getById(GlobalConstants.COLUMNS_LISTID).items.getAll()       
        .then((responses:any)=>{
            console.log(responses); 
            const item = responses?.filter((x:any)=>x.InternalName === confirmation);
            setconfirmationItem(item[0]);
        })
        .catch((err:any)=>{
            console.log(err)
        });
    }
    const sendmsg = (value:any) =>{
        if(value === true){
            globalCommon.deleteItemById(parenturl,GlobalConstants.COLUMNS_LISTID,Item,Item.Id)
            .then((response:any)=>{
                props.callBack(response);
                setisdelete(false);                 
            })
            .catch((error:any)=>{
                console.log(error);
            })
        }
        else{
            props.callBack();
            setisdelete(false);  
        }                     
    }
    const cancelpopup = () =>{
      setisdelete(false);
    }  

    return (
        <>
            <Modal show={true} hide={false}>
                <Modal.Header closeButton>
                  <Modal.Title>{confirmationItem?.Title}</Modal.Title>
                </Modal.Header>
                <Modal.Body><h6 className='p-2 text-center'>{confirmationItem?.Description}</h6> </Modal.Body>
                <div className="modal-footer">
                    {props.ItemTypeItem !== undefined ? <span>{confirmationItem?.ButtonTitle !== null ? <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>sendmsg(true)}>{confirmationItem?.ButtonTitle}</button> : <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>sendmsg(true)}>OK</button>}
                    <button type="button" className="btn btn-default ms-1" onClick={()=>sendmsg(false)}>Cancel</button></span>: <button type="button" className="btn btn-primary me-2" onClick={cancelpopup}>OK</button>}
                </div>
            </Modal>            

           
           {/* <Panel type={PanelType.medium} isOpen={isdelete} onRenderHeader={onRenderCustomHeaderMain} isBlocking={false}>
                <div>
                <ModalBody>
                        <div>
                            <h5>{confirmationItem?.Description}</h5>
                        </div>
                </ModalBody>
                <footer className='bg-f4' style={{position: 'absolute', bottom: '0px', width:'100%', zIndex:'9'}}>
                        <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">                                                      
                            <div className="footer-right">                                                                   
                                {props.ItemTypeItem !== undefined ?<span>
                                    <button type="button" className="btn btn-primary me-2" onClick={()=>sendmsg(true)}>{confirmationItem?.ButtonTitle}</button>
                                    <button type="button" className="btn btn-default btn-default mx-1 me-4" onClick={()=>sendmsg(false)}>Cancel</button>
                                </span> : <span>
                                    <button type="button" className="btn btn-primary me-2" onClick={cancelpopup}>OK</button> </span>}
                            </div>                            
                        </div>
                    </footer>
                </div>
            </Panel>  */}
        </>
    )
}
export default ShowConfirmation