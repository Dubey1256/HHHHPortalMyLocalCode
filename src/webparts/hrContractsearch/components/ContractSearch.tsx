import * as moment from 'moment';
import * as React from 'react'
import { Web } from "sp-pnp-js";
import {
    ColumnDef,
} from "@tanstack/react-table";

import CreateContract from './CreateContract';
import EditContractPopup from './EditContractPopup';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { myContextValue } from '../../../globalComponents/globalCommon';
import HighlightableCell from '../../../globalComponents/highlight';

let editData:any={}
const ContractSearch=(props:any)=>{
const [data,setData] =  React.useState([])
const [create,setCreate] =  React.useState(false)
const [openEdit,setOpenEdit] =  React.useState(false)
let callBackArray:any=[]
let allListId: any = {};
let allSite: any = {
    GMBHSite: false,
    HrSite: false,
    MainSite: true,
}
    React.useEffect(()=>{
        if (props?.Context.pageContext.web.absoluteUrl.toLowerCase().includes("hr")) {
            allSite = {
                HrSite: true,
                MainSite: false
            }
        }
        allListId = {
            Context: props?.Context,
            HHHHContactListId: props?.HHHHContactListId,
            HHHHInstitutionListId: props?.HHHHInstitutionListId,
            HR_SMARTMETADATA_LISTID: props?.HR_SMARTMETADATA_LISTID,
            MAIN_HR_LISTID: props?.MAIN_HR_LISTID,
            GMBH_CONTACT_SEARCH_LISTID: props?.GMBH_CONTACT_SEARCH_LISTID,
            HR_EMPLOYEE_DETAILS_LIST_ID: props?.HR_EMPLOYEE_DETAILS_LIST_ID,
            siteUrl: props?.Context.pageContext.web.absoluteUrl,
            jointSiteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH"
        }
    getData()
    },[])
    
    const getData=async ()=>{
        let web = new Web(props?.siteUrl);
       const myData = await web.lists
        .getById(props?.ContractListID)
        .items
        .select("Id,Title,Author/Title,Editor/Title,activeStatus,startDate,endDate,ContractSigned,ContractChanged,GrossSalary,PersonnelNumber,ContractId,typeOfContract,Type_OfContract/Id,Type_OfContract/Title,WorkingHours,FolderID,contractNumber,SmartInformation/Id,SmartInformation/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,HHHHStaff/Id,HHHHStaff/FullName")
        .top(499)
        .expand("Author,Editor,EmployeeID,HHHHStaff,SmartInformation,Type_OfContract")
        .getAll()
        console.log(myData);
        var date = new Date();
        var currentdate = moment(date).format("DD/MM/YYYY");
        var NewCurrentDate = currentdate.split("/")

            var cuurent = NewCurrentDate[2] + NewCurrentDate[1] + NewCurrentDate[0]
        myData?.forEach((val:any)=>{
            val.ContractChanged = moment(val?.ContractChanged).format('DD/MM/YYYY') 
            val.ContractSigned = moment(val?.ContractSigned).format('DD/MM/YYYY') 
            val.startDate = moment(val?.startDate).format('DD/MM/YYYY') 
            val.endDate = moment(val?.endDate).format('DD/MM/YYYY') 


            var NewEndDate = val.endDate.split("/")
            var NewEventDate = val.startDate.split("/")

            var End = NewEndDate[2] + NewEndDate[1] + NewEndDate[0]
            var start = NewEventDate[2] + NewEventDate[1] + NewEventDate[0]
            // if(val.activeStatus == true){
            //     val.activeStatus = 'Active'
            // }
            // if(val.activeStatus == false){
            //     val.activeStatus = 'InActive'
            // }
            if (val.startDate != undefined && val.startDate != null || val.endDate != undefined && val.endDate != null || val.endDate == undefined && val.endDate == null) {

                if (start < End && End > cuurent) {
                  val.contractStatus = "Active";
                }
                else if (End == undefined && End == null) {
                  val.contractStatus = "";
                }
                else {
                  val.contractStatus = " non active";
                }
              };
        })
        myData?.map((value:any)=>{
            if(value.ContractChanged =='Invalid date'){
                value.ContractChanged=''
            }
            if(value.ContractSigned =='Invalid date'){
                value.ContractSigned=''
            }
            if(value.startDate =='Invalid date'){
                value.startDate=''
            }
            if(value.endDate =='Invalid date'){
                value.endDate=''
            }
        })
        setData(myData)
    }
    const column:any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            
            {
                accessorFn: (row) => row?.ContractId,
                id: 'Contract ID',
                header: '',
                placeholder: "Contract ID",
                size: 110,
               
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <div className="alignCenter">
                        <span className="columnFixedTitle">
                            
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank"
                                    href={props.siteUrl + "/SitePages/Contract-Profile.aspx?ContractId=" + row?.original?.ID}>
                 {getValue()}
                                </a>
                            
                           
                        </span>
                      
                    </div>
                ),
                id: 'Title',
                header: '',
                placeholder: "Title",
                
            },
            {
                id: 'Employee',
                header: '',
                accessorFn: (row) => row?.HHHHStaff?.FullName,
                cell: ({ row, column, getValue }) => (
                    <div className="alignCenter">
                        <span className="columnFixedTitle">
                            
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank"
                                    href={props.siteUrl + "/SitePages/EmployeeInfo.aspx?employeeId=" + row?.original?.HHHHStaff?.Id}>
                 {getValue()}
                                </a>
                            
                           
                        </span>
                      
                    </div>
                ),
                placeholder: "Employee",
                size: 200,


            },
            {
                id: 'typeOfContract',
                header: '',
                accessorFn: (row) => row?.typeOfContract,
                placeholder: "Contract Type",
                size: 160,


            },
            {
                id: 'activeStatus',
                header: '',
                accessorFn: (row) => row?.activeStatus,
                placeholder: "Contract Type",
                size: 50,


            },
           
            {
                header: '',
                accessorKey: 'startDate',
                placeholder: "Start Date",
                size: 90,

            },
            {
                header: '',
                accessorKey: 'endDate',
                placeholder: "End Date",
                size: 90,

            },
            {
                header: '',
                accessorKey: 'ContractChanged',
                placeholder: "Contract Changed",
                size: 90,

            },
            {
                header: '',
                accessorKey: 'ContractSigned',
                placeholder: "Contract Signed",
                size: 90,

            },

            {
                id: "ff",
                accessorKey: "",
                size: 1,
                canSort: false,
                placeholder: "",
                cell: ({ row }) => (
                  <div className="alignCenter pull-right">
                          <span className="svg__iconbox svg__icon--edit hreflink" onClick={() => openEditPopup(row.original)}></span>
                      
                      
                    </div>
                )
              }
            

        ],
        [data]
    );
    const callBackData = React.useCallback((elem: any, ShowingData: any) => {
    setCreate(false)

    }, []);
    const openEditPopup=(data:any)=>{
        editData = data
        setOpenEdit(true)
    }
    const createContracts=()=>{
        setCreate(true)
    }
    const closeContracts=(res:any)=>{
        data.push(res)
        setCreate(false)
    }
    const callBack=(res:any)=>{
        
        setOpenEdit(false)
        getData();
    }
    return(
        <>
        <div className="row">
        <div className="col-sm-3 text-primary">
          <h3 className="heading">Contract Search</h3>
        </div>
        <div className="col-sm-9 text-primary">
        </div>
      </div>
        <myContextValue.Provider value={{ ...myContextValue, allSite:allSite,allListId:allListId ,loggedInUserName:props.props?.userDisplayName}}>
        <button className='btnCol btn btn-primary pull-right' type='submit' onClick={()=>createContracts()}>Create Contract</button>
        <div className='Alltable'>
        <GlobalCommanTable columns={column} data={data} callBackData={callBackData} showHeader={true}/>
        </div>
        {create && <CreateContract closeContracts={closeContracts} callback={callBackData} AllListId={props}/>}
        {openEdit && <EditContractPopup props={editData} AllListId={props} callback={callBack}></EditContractPopup>}
        </myContextValue.Provider>
        </>
    )

}
export default ContractSearch;