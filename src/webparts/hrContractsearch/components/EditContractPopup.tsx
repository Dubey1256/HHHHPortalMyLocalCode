import * as moment from 'moment';
import * as React from 'react'
import { arraysEqual, Modal, Panel, PanelType } from "office-ui-fabric-react";
import { Web } from "sp-pnp-js";
import Tooltip from '../../../globalComponents/Tooltip';

const EditContractPopup = (props: any) => {
    const [EditData, setEditData] = React.useState<any>({})
    const [allContactData, setAllContactData] = React.useState([])
    const [addEmp, setaddEmp] = React.useState(false)
    const [contactDetailsId, setcontactDetailsId] = React.useState();
    const [postData, setPostData] = React.useState({ Title: "", contractTypeItem: "", GrossSalary: "", startDate: "", endDate: '', PersonalNumber: '', ContractSigned: '', ContractChanged: '', selectEmp: '' });
    React.useEffect(() => {
        getData()
        loadContactDetails();
    }, [])
    const loadContactDetails = async () => {
        const web = new Web(props.AllListId.siteUrl);
        await web.lists.getById(props.AllListId.HR_EMPLOYEE_DETAILS_LIST_ID).items.select("Id,Title,ItemType,FirstName,FullName,Company,JobTitle,Item_x0020_Cover,EmployeeID/Title,StaffID,EmployeeID/Id").expand("EmployeeID").orderBy("Created", true).get()
            .then((Data: any[]) => {
                console.log(Data);
                var employecopyData: any = [];
                Data.map((item, index) => {
                    if (item.ItemType != undefined && item.ItemType != "") {
                        if (item.ItemType == "Contact") {
                            employecopyData.push(item);
                        }
                    }
                })
                setAllContactData(employecopyData);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    const getData = async () => {
        let web = new Web(props.AllListId?.siteUrl);
        const myData = await web.lists
            .getById(props.AllListId?.ContractListID)
            .items
            .select("Id,Title,Author/Title,Editor/Title,startDate,endDate,ContractSigned,ContractChanged,GrossSalary,PersonnelNumber,ContractId,typeOfContract,Type_OfContract/Id,Type_OfContract/Title,WorkingHours,FolderID,contractNumber,SmartInformation/Id,SmartInformation/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,HHHHStaff/Id,HHHHStaff/FullName")
            .top(499)
            .filter(`Id eq ${props?.props?.Id}`)
            .expand("Author,Editor,EmployeeID,HHHHStaff,SmartInformation,Type_OfContract")
            .getAll()
        console.log(myData);
        setEditData(myData[0])
    }
    const onRenderCustomHeader = () => {
        return (
            <>
                <div
                    className="subheading">
                    Edit Contract- {EditData?.Title}
                </div>
                <Tooltip ComponentId="3434" />

            </>
        );
    };
    
    const closeEditContractPopup = () => {
            props?.closePopup();
            props?.callback();
    }

    const deleteContract = async (childinew: any) => {
        var UpdatedData: any = [];
        var deleteConfirmation = confirm("Are you sure, you want to delete this?");
        if (deleteConfirmation) {
            let web = new Web(props.AllListId?.siteUrl);

            await web.lists
                .getById(props.AllListId?.ContractListID)
                .items.getById(childinew)
                .delete()
                .then((i) => {
                    console.log(i);
                    closeEditContractPopup();
                });
        }
    };
    const saveData = async () => {
        let staffId = ''
        let web = new Web(props.AllListId?.siteUrl);
        await web.lists.getById(props.AllListId?.ContractListID).items.getById(props?.props.Id).update({
            Title: postData.Title != '' ? postData.Title : EditData.Title,
            startDate: postData.startDate != '' ? moment(postData.startDate).format("MM-DD-YYYY") : EditData.startDate != null ? moment(EditData?.startDate).format("MM-DD-YYYY") : null,
            endDate: postData.endDate != '' ? moment(postData.endDate).format("MM-DD-YYYY") : EditData?.endDate != null ? moment(EditData?.endDate).format("MM-DD-YYYY") : null,
            ContractChanged: postData.ContractChanged != '' ? moment(postData.ContractChanged).format("MM-DD-YYYY") : EditData?.ContractChanged != null ? moment(EditData?.ContractChanged).format("MM-DD-YYYY") : null,
            ContractSigned: postData.ContractSigned != '' ? moment(postData.ContractSigned).format("MM-DD-YYYY") : EditData.ContractSigned != null ? moment(EditData?.ContractSigned).format("MM-DD-YYYY") : null,
            PersonnelNumber: postData.PersonalNumber != '' ? postData.PersonalNumber : EditData.PersonnelNumber != null ? EditData.PersonnelNumber : null,
            HHHHStaffId: contactDetailsId != undefined ? contactDetailsId : EditData?.HHHHStaff?.Id,
        }).then((res: any) => {
            console.log(res)
            if (props?.pageName == 'Recruiting-Tool') {
                closeEditContractPopup(); 
                // let url = `https://hhhhteams.sharepoint.com/sites/HHHH/HR/SitePages/EmployeeInfo.aspx?employeeId=${contactDetailsId != undefined ? contactDetailsId : EditData?.HHHHStaff?.Id}`
                // window.open(url);
            }
            else{
                props.callback(res.data)
                props?.closePopup();
            }

        })

    }
    const onRenderCustomFooterMain = () => {
        return (
            <footer>
                <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">
                    <div>
                        <div className="">
                            Created <span className="font-weight-normal siteColor">  {EditData.Created ? moment(EditData.Created).format("DD/MM/YYYY") : ""}  </span> By <span className="font-weight-normal siteColor">
                                {EditData.Author?.Title ? EditData.Author?.Title : ''}
                            </span>
                        </div>
                        <div>
                            Last modified <span className="font-weight-normal siteColor"> {EditData.Modified ? moment(EditData.Modified).format("DD/MM/YYYY") : ''}
                            </span> By <span className="font-weight-normal siteColor">
                                {EditData.Editor?.Title ? EditData.Editor.Title : ''}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink siteColor">
                                <span className="alignIcon svg__iconbox hreflink mini svg__icon--trash" onClick={() => deleteContract(EditData?.Id)}></span>
                                <span >Delete This Item</span>
                            </a>

                        </div>
                    </div>
                    <div>
                        <div className="footer-right">

                            <a target="_blank" className="mx-2" data-interception="off"
                                href={`${props.AllListId?.siteUrl}/Lists/${props?.props?.siteType}/EditForm.aspx?ID=${EditData.ID}`}>
                                Open Out-Of-The-Box Form
                            </a>
                            <span >
                                <button className="btn btn-primary mx-1 px-3"
                                    onClick={() => saveData()}>
                                    Save
                                </button>
                                <button type="button" className="btn btn-default px-3" onClick={() => closeEditContractPopup()}>
                                    Cancel
                                </button>

                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
    const openAddEmployeePopup = () => {
        setaddEmp(true)
    }
    const closeAddEmp = () => {
        setaddEmp(false)
    }
    const saveContractType = (checkitem: any, type: any) => {

        closeAddEmp()

        if (postData.selectEmp != undefined && postData.selectEmp != "" && type === "contact") {
            allContactData.map((items, index) => {
                if (items.FullName === postData?.selectEmp) {
                    setcontactDetailsId(items.Id);

                }
            })


        }

    }
    const onRenderSelectEmp =()=>{
        return (
           <>
              <div
                 className="subheading">
                Select Employee
              </div>
              <Tooltip ComponentId="1683" />
           </>
        );
     }
    return (
        <>
            <div>
                <Panel
                    onRenderHeader={onRenderCustomHeader}
                    type={PanelType.medium}
                    isOpen={props?.openPopup}
                    onDismiss={() => closeEditContractPopup()}
                    isBlocking={false}
                    onRenderFooter={onRenderCustomFooterMain}
                >
                    <div className='modal-body'>
                        <div className='row mt-2'>
                            <div className='col-sm-6'>
                                <div className="input-group">
                                    <label className="form-label full-width">Contract Number</label>
                                    <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue={EditData?.ContractId} />

                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className="input-group">
                                    <label className="form-label full-width">Title</label>
                                    <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue={EditData?.Title} onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />

                                </div>
                            </div>
                        </div>

                        <div className='row mt-2'>
                            <div className='col-sm-4'>
                                <div className="input-group">
                                    <label className="form-label full-width">Start Date</label>
                                    <input type="date" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Enter start Date" max="9999-12-31" min={EditData.startDate ? moment(EditData.startDate).format("YYYY-MM-DD") : ""}
                                        defaultValue={EditData.startDate ? moment(EditData.startDate).format("YYYY-MM-DD") : ''} onChange={(e) => setPostData({ ...postData, startDate: e.target.value })} />

                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div className="input-group">
                                    <label className="form-label full-width">End Date</label>
                                    <input type="date" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Enter start Date" max="9999-12-31" min={EditData.endDate ? moment(EditData.endDate).format("YYYY-MM-DD") : ""}
                                        defaultValue={EditData.endDate ? moment(EditData.endDate).format("YYYY-MM-DD") : ''} onChange={(e) => setPostData({ ...postData, endDate: e.target.value })} />

                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div className="input-group">
                                    <label className="form-label full-width">Personal Number</label>
                                    <input type="number" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue={EditData?.PersonnelNumber} onChange={(e) => setPostData({ ...postData, PersonalNumber: e.target.value })} />

                                </div>
                            </div>
                       </div>


                            <div className='row mt-3'>
                                <div className='col-sm-4'>
                                    <div className="input-group">
                                        <label className="form-label full-width">Contract Signed</label>
                                        <input type="date" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Enter start Date" max="9999-12-31" min={EditData.ContractSigned ? moment(EditData.ContractSigned).format("YYYY-MM-DD") : ""}
                                            defaultValue={EditData.ContractSigned ? moment(EditData.ContractSigned).format("YYYY-MM-DD") : ''} onChange={(e) => setPostData({ ...postData, ContractSigned: e.target.value })} />

                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className="input-group">
                                        <label className="form-label full-width">Contract Changed</label>
                                        <input type="date" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Enter start Date" max="9999-12-31" min={EditData.ContractChanged ? moment(EditData.ContractChanged).format("YYYY-MM-DD") : ""}
                                            defaultValue={EditData.ContractChanged ? moment(EditData.ContractChanged).format("YYYY-MM-DD") : ''} onChange={(e) => setPostData({ ...postData, ContractChanged: e.target.value })} />

                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className="input-group">
                                        <label className="form-label full-width">Gross Salary</label>
                                        <input type="number" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={EditData?.GrossSalary} onChange={(e) => setPostData({ ...postData, GrossSalary: e.target.value })} />

                                    </div>
                                </div>
                            </div>

                            <div className='row mt-2'>
                                <div className='col-sm-6'>
                                    <div className="input-group">
                                        <label className="form-label full-width">HHHH Contact</label>
                                        <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={postData?.selectEmp != '' ? postData?.selectEmp : EditData?.HHHHStaff?.FullName} />
                                        <span className="input-group-text" title="Status Popup"><span title="Edit Task" className="svg__iconbox svg__icon--editBox" onClick={() => openAddEmployeePopup()}></span></span>

                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className="input-group">
                                        <label className="form-label full-width">Holiday</label>
                                        <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />

                                    </div>
                                </div>
                            </div>
                        
                        
                    </div>

                </Panel>
                <Panel
                    onRenderHeader={onRenderSelectEmp}
                    type={PanelType.custom}
                    customWidth={'750px'}
                    isOpen={addEmp}
                    onDismiss={closeAddEmp}
                    isBlocking={false}
                >
                    <div className="modal-body">
                        <div className="p-0 mt-2 row">
                            {allContactData.map((item, index) => {
                                return (

                                    <div key={index} className="col-sm-4 pl-0 mb-1">
                                        <div className="SpfxCheckRadio">
                                            <input type="radio" className="radio" id="html" name="fav_language" defaultChecked={postData.contractTypeItem == item.FullName} value={item.FullName} onChange={(e) => setPostData({ ...postData, selectEmp: e.target.value })}></input>
                                            {item?.FullName}</div></div>


                                )
                            })
                            } </div>
                        <footer>
                            <div className="col-sm-12 text-end">
                                <button type="button" className="btn btn-primary ms-2" onClick={() => saveContractType(postData.contractTypeItem, "contact")}>Save</button>
                                <button type="button" className="btn btn-default ms-2" onClick={() => closeAddEmp()}>Cancel</button>
                            </div>
                        </footer>
                    </div>



                </Panel>
            </div>
        </>
    )
}
export default EditContractPopup;