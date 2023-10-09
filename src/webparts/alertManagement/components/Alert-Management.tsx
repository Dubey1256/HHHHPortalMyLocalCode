import React from "react";
import { Web } from "sp-pnp-js";
import GlobalCommonTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {GlobalConstants} from "../../../globalComponents/LocalCommon";
import * as globalcommon from '../../../globalComponents/globalCommon';
import ShowConfirmation from  './ShowConfirmation';
import { ColumnDef } from '@tanstack/react-table';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import { Col, ModalBody, ModalFooter } from 'react-bootstrap';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import Row from 'react-bootstrap/Row';
import moment from "moment";
// import Col from 'react-bootstrap/Col';
var alertcolumn1: any = [];
var editalertmessage:any = [];
var DropdownArray:any = [];
var DropdownArrayitemtype:any = [];
var deleteItemType:any = '';
var deleteitem:any = [];
const AlertManagementTable = (props:any)=>{
    const propitm:any = props.SelectedProp;
    const web = new Web(propitm.ContextValue._pageContext._web.absoluteUrl.split('/SP')[0]);
    const parenturl = propitm.ContextValue._pageContext._web.absoluteUrl.split('/SP')[0];
    const [alertcolumns,setalertcolumns] = React.useState<any[]>([]);
    const [editalertopen,seteditalertopen] = React.useState(false);
    const [isdeletepopup,setisdeletepopup] = React.useState(false);
    const [isaddpopup,setisaddpopup] = React.useState(false);
    const [EditData, setEditData] = React.useState<any>({});
    const [AddData, setAddData] = React.useState<any>({});
    const [AlertInternalName,setAlertInternalName] = React.useState<any>('');
    var itemtype = 'Alert';   
    var ItemTypeurl = window.location.href.split('?ItemType=')[1];   
    if (ItemTypeurl !== "" && (ItemTypeurl === 'confirmation' || ItemTypeurl === 'Confirmation')) {
         itemtype = 'Confirmation';            
    }
    if (ItemTypeurl !== "" && (ItemTypeurl === 'alert' || ItemTypeurl === 'Alert')) {           
         itemtype = 'Alert';
    }         
    const Loadcolumns = ()=>{
        web.lists.getById(GlobalConstants.COLUMNS_LISTID).items.getAll()       
        .then((responses:any)=>{            
            alertcolumn1 = responses?.filter((x:any)=>x.ItemType === itemtype);
            alertcolumn1.map((item:any)=>{
                item.Created = new Date()
            })
            console.log(alertcolumn1);
            setalertcolumns(alertcolumn1);
        })
        .catch((err:any)=>{
            console.log(err)
        });
    }

    React.useEffect(() => {
        Loadcolumns();
    }, [itemtype]);
    
    const EditContents = (itm:any) =>{
        
    }
    const EditTask = (itm:any) =>{
        editalertmessage = itm;         
        seteditalertopen(true);       
    }
    const removeItem = (itm:any) =>{
        setAlertInternalName('DeleteItem');  
        deleteItemType = 'confirmation'; 
        deleteitem = itm; 
        setisdeletepopup(true);
    } 
    //Start Add message

    const AddColumn = () =>{
        setisaddpopup(true);        
    }
    const savecolumn = ()=>{
        let createitem:boolean = true;
        alertcolumn1.map((createitems:any)=>{
            if(createitems.InternalName === AddData.InternalName){
                alert('SameName, Please Change The Internal Name!')
                createitem = false
            }
        })
        if(createitem){
            let postData = {               
                Title: AddData.Title,
                SortOrder: AddData.SortOrder,
                Description: AddData.Description,
                InternalName: AddData.InternalName,
                ItemType: AddData.ItemType,
                ButtonTitle: AddData.ButtonTitle
            }
            web.lists.getById(GlobalConstants.COLUMNS_LISTID).items.add(postData)
            .then(() => {                    
                Loadcolumns();
                setisaddpopup(false);
                console.log("Item added successfully");
            })
            .catch((err:any) => {
                console.log(err);
            })
        }
        
    }
    const cancelform = ()=>{
        setisaddpopup(false);
    }

    // End

    // start Edit Popup

        React.useEffect(() => {
            loaddropdown();
            LoadcolumnsNew();
        }, [editalertopen === true]); 
        
        const loaddropdown = ()=>{
            let EntityPropertyNamearray:any = [];
            web.lists.getById(GlobalConstants.COLUMNS_LISTID).fields.get()
            .then((Listfields:any)=>{
                console.log(Listfields);
                EntityPropertyNamearray = Listfields.filter((x:any)=>x.EntityPropertyName === 'ItemType' || x.EntityPropertyName === 'Position');
                EntityPropertyNamearray.map((x:any)=> {if(x.EntityPropertyName === 'Position'){DropdownArray = x.Choices}else{DropdownArrayitemtype = x.Choices}});
            })
            .catch((err:any)=>{
                console.log(err);
            })
        }
        const LoadcolumnsNew = ()=>{
            web.lists.getById(GlobalConstants.COLUMNS_LISTID).items.select('Id,Title,ItemType,ButtonTitle,InternalName,Description,Position,SortOrder,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title').expand('Author,Editor').filter("Id eq " + editalertmessage.Id).getAll()       
            .then((responses:any)=>{
                console.log(responses);            
                setEditData(responses[0])
            })
            .catch((err:any)=>{
                console.log(err)
            });
        }

        const cancelItemUpdate = ()=>{
            seteditalertopen(false); 
        }
        const updateTaskRecords = () =>{
           let postData = {               
              Title: EditData.Title,
              SortOrder: EditData.SortOrder,
              Description: EditData.Description,
              InternalName: EditData.InternalName,
              ItemType: EditData.ItemType,
              ButtonTitle: EditData.ButtonTitle
            }
            globalcommon.updateItemById(parenturl,GlobalConstants.COLUMNS_LISTID,postData,editalertmessage.Id)
            // web.lists.getById(GlobalConstants.COLUMNS_LISTID).items.add(postData)
            .then(() => {    
                Loadcolumns();
                seteditalertopen(false);
                console.log("Item updated successfully");                
            })
            .catch((err:any) => {
                console.log(err);
            })
        }       
    //End 

    // Table Data
        const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [        
            {accessorFn: (row) => row?.Title,
                placeholder: "Title",
                id: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 70,
            },
            {accessorFn: (row) => row?.InternalName,
                placeholder: "InternalName",
                id: "InternalName",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 70,
            },
            {accessorFn: (row) => row?.Description,
                placeholder: "Description",
                id: "Description",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 150,
            },
            {accessorFn: (row) => row?.SortOrder,
                placeholder: "SortOrder",
                id: "SortOrder",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 70,
            },  
            {accessorFn: (row) => row?.ItemType,
                placeholder: "ItemType",
                id: "ItemType",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 70,
            },             
            // { cell: ({ row }) => (
            //     <>
            //         <a onClick={() => EditContents(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a>
            //     </>
            // ),accessorKey: '',canSort: false,placeholder: '',header: '',id: 'row.original',size: 10,}, 
            { cell: ({ row }) => (
                <>
                    <a onClick={() => EditTask(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a>
                </>
            ),accessorKey: '',canSort: false,placeholder: '',header: '',id: 'row.original',size: 10, },  
            { cell: ({ row }) => (
                <>
                    <a onClick={() => removeItem(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333"></path></svg></a>
                </>
            ),accessorKey: '',canSort: false,placeholder: '',header: '',id: 'row.original',size: 10, }             
        ],[alertcolumns]
        );
        const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {

        }, []);
        const onRenderCustomHeaderMain = () => {
            return (
                <div className="d-flex full-width pb-1">
                   {editalertopen? <div className='subheading'>
                    <span className="siteColor">  Edit - {editalertmessage.Title}</span>
                    </div>:''} 
                    {isaddpopup? <div className='subheading'>
                    <span className="siteColor">  Add Messages</span>
                    </div>:''}                   
                </div>
            );
        };  
        
        const callBack = (elem:any) =>{
            setisdeletepopup(false);
            Loadcolumns();
        }

    //End 


    return(
        <>
            <div className="mb-1 text-end">
              {itemtype === 'Confirmation' ? <button type="button" className="btn btn-primary me-2" onClick={AddColumn}>Add Confirmation Message</button> : <button type="button" className="btn btn-primary me-2" onClick={AddColumn}>Add Alert Message</button>}
            </div>
            <div>
                <GlobalCommonTable columns={columns} data={alertcolumns} showHeader={true} callBackData={callBackData}></GlobalCommonTable>
            </div>
            <Panel type={PanelType.medium} isOpen={isaddpopup} onRenderHeader={onRenderCustomHeaderMain} isBlocking={false}>
                <div>
                <ModalBody>
                        <Row className="mb-1">
                            <Col md={12} className="mb-1">
                            <div className="input-group">
                                <label className="form-label full-width" htmlFor="">Alert Title</label>                          
                                <input className="form-control" type="text" defaultValue={AddData.Title} onChange={(e) => setAddData({ ...AddData, Title: e.target.value })} />
                            </div>
                            </Col>
                            <Col>
                            <div className="input-group">
                                <label className="form-label full-width" htmlFor="">Sort Order</label>
                                <input className="form-control" type="text" defaultValue={AddData.SortOrder} onChange={(e) => setAddData({ ...AddData, SortOrder: e.target.value })}/>
                            </div>
                            </Col>
                            <Col>
                            <div className="input-group">
                                <label className="form-label full-width" htmlFor="">InternalName</label>
                                <input className="form-control" type="text" defaultValue={AddData.InternalName} onChange={(e) => setAddData({ ...AddData, InternalName: e.target.value })}/>
                            </div>
                            </Col>
                            </Row>
                           
                           <Row className="mb-1">
                            <Col>
                            <div className="input-group">
                                <label className="form-label full-width" htmlFor="">ItemType</label>                           
                                <select className="form-select" defaultValue={AddData.ItemType} onChange={(e) => setAddData({ ...AddData, ItemType: e.target.value })}>
                                    {DropdownArrayitemtype.map(function (h: any, i: any) {
                                        return (
                                            <option key={i} value={h} >{h}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            </Col>
                            <Col>
                            <div className="input-group">
                                <label className="form-label full-width" htmlFor="">ButtonTitle</label>                          
                                <input  className="form-control" type="text" defaultValue={AddData.ButtonTitle} onChange={(e) => setAddData({ ...AddData, ButtonTitle: e.target.value })} />
                            </div>
                            </Col>
                        </Row>                                        
                        <Row>
                            <div className="input-group">
                            <label className="form-label full-width" htmlFor="">Description Help</label>
                            <textarea className="form-control" rows={4} cols={50} value={AddData.Description} defaultValue={AddData.Description} onChange={(e) => setAddData({ ...AddData, Description: e.target.value })} ></textarea>
                            </div>
                        </Row>
                </ModalBody>
              
                </div>
                <footer className="text-end  mt-2">
                    <button  onClick={savecolumn} type="button" className="btn btn-primary ms-2 px-4">Save</button>
                    <button onClick={cancelform} type="button" className="btn btn-default btn-default ms-1">Cancel</button>
                    </footer>
                {/* <footer className='bg-f4' style={{position: 'absolute', bottom: '0px', width:'100%', zIndex:'9'}}>
                        <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">                                                       
                            <div className="footer-right">                                                                  
                                <button type="button" className="btn btn-primary me-2" onClick={savecolumn}>Save</button>
                                <button type="button" className="btn btn-default btn-default mx-1 me-4" onClick={cancelform}>Cancel</button>
                            </div>                            
                        </div>
                    </footer> */}
            </Panel> 
            <Panel type={PanelType.medium} isOpen={editalertopen} onRenderHeader={onRenderCustomHeaderMain} isBlocking={false}>
                <div>
                <ModalBody>
                        <Row className="mb-1">
                            {/* <Col md={6}></Col> */}
                            <Col>
                            <div className="input-group ">
                                <label className="form-label full-width" htmlFor="">Alert Title</label>                          
                                <input className="form-control" type="text" defaultValue={EditData.Title} onChange={(e) => setEditData({ ...EditData, Title: e.target.value })} />
                            </div>
                            </Col>
                            <Col>
                            <div className="input-group ">
                                <label className="form-label full-width" htmlFor="">Sort Order</label>
                                <input className="form-control" type="text" defaultValue={EditData.SortOrder} onChange={(e) => setEditData({ ...EditData, SortOrder: e.target.value })}/>
                            </div>
                            </Col>
                            {/* <Col>
                            <div className="input-group ">
                                <label className="form-label full-width" htmlFor="">InternalName</label>
                                <input className="form-control" type="text" defaultValue={EditData.InternalName} onChange={(e) => setEditData({ ...EditData, InternalName: e.target.value })}/>
                            </div>
                            </Col> */}
                            </Row>
                            <Row className="mb-1">                      
                            <Col>
                            <div className="input-group ">
                                <label className="form-label full-width" htmlFor="">Item Type</label>                           
                                <select className="form-select" defaultValue={EditData.ItemType} onChange={(e) => setEditData({ ...EditData, ItemType: e.target.value })} disabled>
                                    {DropdownArrayitemtype.map(function (h: any, i: any) {
                                        return (
                                            <option key={i} selected={EditData.ItemType == h} value={h} >{h}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            </Col>
                            <Col>
                            <div className="input-group ">
                                <label className="form-label full-width" htmlFor="">Button Title</label>                          
                                <input className="form-control" type="text" defaultValue={EditData.ButtonTitle} onChange={(e) => setEditData({ ...EditData, ButtonTitle: e.target.value })} />
                            </div>
                            </Col>  
                            </Row>
                                                               
                        <Row>
                        <div className="input-group ">
                            <label className="form-label full-width" htmlFor="">Description Help</label>
                            <textarea  className="form-control" rows={4} cols={50} value={EditData.Description} defaultValue={editalertmessage.Description} onChange={(e) => setEditData({ ...EditData, Description: e.target.value })} ></textarea>
                            </div>
                        </Row>
                </ModalBody>
             
                </div>
                <footer className='bg-f4' style={{position: 'absolute', bottom: '0px', width:'100%', zIndex:'9'}}>
                        <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">
                            <div>
                                <div>
                                    Created <span className="font-weight-normal siteColor"> {EditData.Created ? moment(EditData.Created).format("DD/MM/YYYY") : ""} </span> by
                                    <span className="font-weight-normal siteColor"> {EditData.Author?.Title ? EditData.Author?.Title : ''} </span>
                                </div>
                                <div>
                                    Last modified <span className="font-weight-normal siteColor"> {EditData.Modified ? moment(EditData.Modified).format("DD/MM/YYYY") : ""} </span> by <span className="font-weight-normal siteColor"> {EditData.Editor?.Title ? EditData.Editor?.Title : ''} </span>
                                </div>                           
                            </div>
                            <div>
                                <div className="footer-right">                               
                                    <a data-interception="off" className="p-1" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/Master%20Tasks/EditForm.aspx?ID=3636" target="_blank">Open out-of-the-box form
                                    </a>
                                    <button type="button" className="btn btn-primary me-2" onClick={updateTaskRecords}>Save</button>
                                    <button type="button" className="btn btn-default btn-default mx-1 me-4" onClick={cancelItemUpdate}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </footer>
            </Panel>            
            {AlertInternalName === 'DeleteItem' && isdeletepopup?<div>
              <ShowConfirmation confirmation={AlertInternalName} Item = {deleteitem} ItemTypeItem={deleteItemType} Context={propitm}  callBack = {callBack}/>
            </div> : ''}
        </>
    );
}
export default AlertManagementTable;
