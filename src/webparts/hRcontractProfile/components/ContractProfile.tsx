import * as moment from 'moment';
import * as React from 'react'
import { Web } from "sp-pnp-js";
import EditContractPopup from '../../hrContractsearch/components/EditContractPopup';

let ContratId:any =''
let propsData:any = []
function getQueryVariable(variable: any) {
    let query = window.location.search.substring(1);
    console.log(query); //"app=article&act=news_content&aid=160990"
    let vars = query.split("&");
  
    console.log(vars);
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }
const ContractProfile = (props:any) => {
    const [data, setData] = React.useState([])
    const [openPopup, setOpenPopup] = React.useState(false)

    React.useEffect(() => {
       
          ContratId = getQueryVariable("ContractId")
        getData()
    }, [])

    const getData = async () => {
        let web = new Web(`${props.props.siteUrl}`);
        const TaskDetailsFromCall = await web.lists
            .getById(`${props.props.ContractListID}`)
            .items
            .select("Id,Title,Author/Title,Editor/Title,startDate,endDate,ContractSigned,ContractChanged,GrossSalary,PersonnelNumber,ContractId,typeOfContract,HolidayEntitlement,Type_OfContract/Id,Type_OfContract/Title,WorkingHours,FolderID,contractNumber,SmartInformation/Id,SmartInformation/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,HHHHStaff/Id,HHHHStaff/FullName")
            .top(499)
            .filter(`Id  eq '${ContratId}'`)
            .expand("Author,Editor,EmployeeID,HHHHStaff,SmartInformation,Type_OfContract")
            .getAll()
        console.log(TaskDetailsFromCall)
        var date = new Date();
        var currentdate = moment(date).format("DD/MM/YYYY");
        TaskDetailsFromCall?.forEach((val: any) => {
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
        TaskDetailsFromCall?.map((value: any) => {
            if (value.ContractChanged == 'Invalid date') {
                value.ContractChanged = ''
            }
            if (value.ContractSigned == 'Invalid date') {
                value.ContractSigned = ''
            }
            if (value.startDate == 'Invalid date') {
                value.startDate = ''
            }
            if (value.endDate == 'Invalid date') {
                value.endDate = ''
            }
        })
        setData(TaskDetailsFromCall)
    }
    const EditComponentPopup=(data:any)=>{
        propsData = data
        setOpenPopup(true)
    }
    const callback=()=>{
        setOpenPopup(false)
        getData();
       }
    return (
        <>
            <section>
                <div className='heading'>
                    {data[0]?.Title}
                    <span onClick={(e) => EditComponentPopup(data[0])}>
                              {" "}
                              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                            </span>
                    
                </div>
                <div className="team_member row  py-2">
                    <div className="col-md-12">
                        <div className="row mb-2">
                            <div className="col-md-6 pe-0">
                                <dl>
                                    <dt className="bg-fxdark" title="Structure ID ">Contract Number</dt>
                                    <dd className="bg-light">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item.contractNumber}</span>
                                            </>
                                        ))}

                                    </dd>
                                </dl>
                                <dl>
                                    <dt className="bg-fxdark" title="Start Date">Start Date</dt>
                                    <dd className="bg-light">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item.startDate}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>

                                <dl>
                                    <dt className="bg-fxdark" title="Status">End Date</dt>
                                    <dd className="bg-light">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item.endDate}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className="bg-fxdark" title="Assigned Person">Contract Signed</dt>
                                    <dd className="bg-light d-flex">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item.ContractSigned}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className="bg-fxdark" title="Assigned Person">Contract Changed</dt>
                                    <dd className="bg-light d-flex">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item.ContractSigned}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>

                                <dl>
                                    <dt className="bg-fxdark" title="Assigned Person">Employee </dt>
                                    <dd className="bg-light d-flex">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item?.HHHHStaff?.FullName}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>
                            </div>
                            <div className="col-md-6 p-0">
                                <dl>
                                    <dt className="bg-fxdark" title="Assigned Person">Gross Salary </dt>
                                    <dd className="bg-light d-flex">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item?.GrossSalary}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>


                                <dl>
                                    <dt className="bg-fxdark" title="Assigned Person">Contract Type </dt>
                                    <dd className="bg-light d-flex">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item?.typeOfContract}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>
                                <dl>


                                    <dt className="bg-fxdark" title="Assigned Person">Holiday Entitlement </dt>
                                    <dd className="bg-light d-flex">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item?.HolidayEntitlement}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>

                                <dl>

                                    <dt className="bg-fxdark" title="Assigned Person">Personal Number </dt>
                                    <dd className="bg-light d-flex">
                                        {data.map((item, index) => (
                                            <>
                                                <span>{item?.PersonnelNumber}</span>
                                            </>
                                        ))}
                                    </dd>
                                </dl>


                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {openPopup && <EditContractPopup props={propsData} AllListId={props.props} callback={callback}></EditContractPopup>}

        </>
    ) 
}
export default ContractProfile;