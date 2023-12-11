import * as moment from 'moment';
import * as React from 'react'
import { Web } from "sp-pnp-js";
import {
    ColumnDef,
} from "@tanstack/react-table";
import GlobalCommanTable from './GlobalCommanTable';
import CreateContract from './CreateContract';
import EditContractPopup from './EditContractPopup';

let editData:any={}
const ContractSearch=(props:any)=>{
const [data,setData] =  React.useState([])
const [create,setCreate] =  React.useState(false)
const [openEdit,setOpenEdit] =  React.useState(false)
let callBackArray:any=[]
    React.useEffect(()=>{
    getData()
    },[])
    
    const getData=async ()=>{
        let web = new Web(props.props?.siteUrl);
       const myData = await web.lists
        .getById(props?.props?.ContractListID)
        .items
        .select("Id,Title,Author/Title,Editor/Title,startDate,endDate,ContractSigned,ContractChanged,GrossSalary,PersonnelNumber,ContractId,typeOfContract,Type_OfContract/Id,Type_OfContract/Title,WorkingHours,FolderID,contractNumber,SmartInformation/Id,SmartInformation/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,HHHHStaff/Id,HHHHStaff/FullName")
        .top(499)
        .expand("Author,Editor,EmployeeID,HHHHStaff,SmartInformation,Type_OfContract")
        .getAll()
        console.log(myData);
        var date = new Date();
        var currentdate = moment(date).format("DD/MM/YYYY");
        myData?.forEach((val:any)=>{
            val.ContractChanged = moment(val?.ContractChanged).format('DD/MM/YYYY') 
            val.ContractSigned = moment(val?.ContractSigned).format('DD/MM/YYYY') 
            val.startDate = moment(val?.startDate).format('DD/MM/YYYY') 
            val.endDate = moment(val?.endDate).format('DD/MM/YYYY') 
            if (val.startDate != undefined && val.startDate != null || val.endDate != undefined && val.endDate != null || val.endDate == undefined && val.endDate == null) {

                if (val.startDate < val.endDate && val.endDate > currentdate) {
                  val.contractStatus = "Active";
                }
                else if (val.endDate == undefined && val.endDate == null) {
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
                size: 150,
               
            },
            {
    
                id: 'Title',
                header: '',
                accessorFn: (row) => row?.Title,
                placeholder: "Title",
                size: 300,

            },
            {
                id: 'Employee',
                header: '',
                accessorFn: (row) => row?.HHHHStaff?.FullName,
                placeholder: "Employee",
                size: 300,


            },
            {
                id: 'typeOfContract',
                header: '',
                accessorFn: (row) => row?.typeOfContract,
                placeholder: "Contract Type",
                size: 300,


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
                size: 25,
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
        <button className='btnCol btn btn-primary' type='submit' onClick={()=>createContracts()}>Create Contract</button>
        <div className='Alltable'>
        <GlobalCommanTable columns={column} data={data} callBackData={callBackData} showHeader={true}/>
        </div>
        {create && <CreateContract closeContracts={closeContracts} callback={callBackData} AllListId={props?.props}/>}
        {openEdit && <EditContractPopup props={editData} AllListId={props?.props} callback={callBack}></EditContractPopup>}
        </>
    )

}
export default ContractSearch;