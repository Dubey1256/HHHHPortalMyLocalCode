import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web, sp } from 'sp-pnp-js';
import "bootstrap/dist/css/bootstrap.min.css";  
import Tooltip from '../Tooltip';
import * as moment from 'moment';


var keys: any = []

export default function VersionHistory(props: any) {
    const [propdata, setpropData] = React.useState(props);
    const [show, setShow] = React.useState(false);
    const [data, setData]: any = React.useState([])
    var tableCode
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //------------------------jquery call--------------------------------
    const GetItemsVersionHistory = async () => {
        var versionData: any = []
        var siteTypeUrl = props.siteUrls;
        let listId = props.listId
        var itemId = props.taskId;
        let web = new Web(siteTypeUrl);
        web.lists.getById(props?.listId).items.getById(props.taskId).versions.get().then(versions => {
            console.log('Version History:', versions);
            versionData = versions;

            const result = findDifferentColumnValues(versionData)

            const employeesWithoutLastName = result.map(employee => {
                employee.childs = []
                const  { VersionId, VersionLabel, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata, ...rest } = employee;
                return rest;
            });
            console.log(employeesWithoutLastName)
            employeesWithoutLastName?.forEach((val: any) => {
                val.No = val.owshiddenversion;
                val.ModifiedDate = moment(val?.Modified).format("DD/MM/YYYY h:mmA");
                val.ModifiedBy = val?.Editor.LookupValue;
                val.childs.push(val)
            })

            employeesWithoutLastName?.forEach((val:any)=>{
                val.childs?.forEach((ele:any)=>{
                    const  { VersionId, VersionLabel, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata,Editor, ...rest } = ele;
                    return rest;
                })
            })

            setData(employeesWithoutLastName);

        }).catch(error => {
            console.error('Error fetching version history:', error);
        });

    }



    const findDifferentColumnValues = (data: any) => {


        const differingValues = [];

        for (let i = 0; i < data.length - 1; i++) {
            const currentObj = data[i];
            const nextObj = data[i + 1];
            const differingPairs: any = {};

            for (const key in currentObj) {
                if (
                    currentObj.hasOwnProperty(key)
                    &&
                    (!nextObj.hasOwnProperty(key)
                        || !isEqual(currentObj[key], nextObj[key]))
                ) {
                    differingPairs[key] = currentObj[key];
                    differingPairs['Editor'] = currentObj.Editor;
                }
            }

            // Check for properties in n+1 but not in n
            for (const key in nextObj) {
                if (nextObj.hasOwnProperty(key)
                    && !currentObj.hasOwnProperty(key)) {
                    differingPairs[key] = currentObj[key];
                    differingPairs['Editor'] = currentObj.Editor;
                }
            }

            if (Object.keys(differingPairs).length > 0) {
                differingValues.push(differingPairs);
            }
        }

        return differingValues;
    }

    // Function to compare arrays and objects recursively based on their IDs
    function isEqual(obj1: any, obj2: any) {
        if (obj1 === obj2) return true;

        if (obj1 instanceof Date && obj2 instanceof Date) {
            return obj1.getTime() === obj2.getTime();
        }

        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) return false;

            for (let i = 0; i < obj1.length; i++) {
                if (!isEqual(obj1[i], obj2[i])) {
                    return false;
                }
            }
            return true;
        }

        if (
            typeof obj1 !== typeof obj2 ||
            typeof obj1 !== 'object' ||
            !obj1 ||
            !obj2
        ) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (!obj2.hasOwnProperty(key)
                || !isEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }
    //---------------------------------------------------------------------

    React.useEffect(() => {
        GetItemsVersionHistory()
    }, [show]);

    const onRenderCustomHeader = () => {
      return (
        <>
          <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '15px' }}>
            Version History
          </div>
          <Tooltip componentId={1950}/>
        </>
      );
    };
    const renderArray = (arr: any[]) => {
        return arr.map((item, index) => (
          <div key={index}>{typeof item === 'object' ? item?.LookupValue : item}</div>
        ));
      };
      
      // Helper function to render objects
    //   const renderObject = (obj: object) => {
    //     return Object.entries(obj).map(([key, value]:any, index:any) => (
    //       <div key={index}>
    //         <strong>{key}:</strong>{' '}
    //         {typeof value === 'object' ? renderObject(value) : value}
    //       </div>
    //     ));
    //   };

    const renderObject = (obj: any, visited: Set<object> = new Set()) => {
        if(obj != null && obj != undefined){
            //const entries = Object?.entries(obj);

            return  <div>{obj.LookupValue}</div>
            // entries.map(([key, value]: [string, any], index: number) => {
            //     const isCircular = visited.has(value);
            
            //     visited.add(value?.LookupValue);
            
            //     return (
            //       <div key={index}>
            //         <strong>{key}:</strong>{' '}
            //         {isCircular ? '(Circular Reference)' : typeof value === 'object' ? renderObject(value, visited) : value}
            //       </div>
            //     );
            //   });
        }
    
      
      };
    return (
        <>
            <span className='siteColor mx-1' onClick={handleShow}>
                Version History
            </span>
            <Panel
                onRenderHeader={onRenderCustomHeader}
                isOpen={show}
                onDismiss={handleClose}
                isBlocking={false}
                type={PanelType.large}>
                
                <table className="table VersionHistoryTable">
                        <thead>
                            <tr>
                                <th style={{width:"80px"}} scope="col">No</th>
                                <th style={{width:"170px"}} scope="col">Modified</th>
                                <th  scope="col">Info</th>
                                <th style={{width:"256px"}} scope="col">Modified by</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((itm: any) => {
                                return (
                                    <>
                                        <tr>
                                            <td>
                                                {itm?.No}
                                            </td>
                                            <td>
                                            <span className="siteColor">{itm?.ModifiedDate}</span>
                                            </td>
                                            <td>
                               {/* inner table */}
                                                {/* { <table className="table">
                                                    {itm?.childs.map((item: any, index: any) => {
                                                        { keys = Object.keys(itm?.childs[0]) }
                                                        return (
                                                            <tr>
                                                                {keys.map((key: any, index: any) => {
                                                                    return (
                                                                        <>
                                                                        {(key != 'odata.editLink' && key != 'odata.id' && key != 'owshiddenversion' && key != 'Editor' && key != 'childs' && 
                                                                        key != 'Modified' && key != 'ModifiedDate' && key != 'No'  && key != 'Created'  && key != 'ModifiedBy') &&
                                                                        <tr>
                                                                            <td key={index}> 
                                                                            <b>{key}</b>   
                                                                            <span style={{margin:'20%'}}> {Array.isArray(item[key])
                                                                                ? renderArray(item[key])
                                                                                : typeof item[key] === 'object'
                                                                                    ? renderObject(item[key])
                                                                                    : item[key]}
                                                                            </span> 
                                                                                    </td>
                                                                        </tr>}
                                                                        </> )
                                                                })}
                                                            </tr>
                                                        )
                                                    })}
                                                </table> } */}
                                           
                                                <div className='Info-VH-Col'>
                                                    {itm?.childs.map((item: any, index: any) => {
                                                        { keys = Object.keys(itm?.childs[0]) }
                                                        return (

                                                            <ul>
                                                                {keys.map((key: any, index: any) => {
                                                                    return (
                                                                        <>
                                                                        {(key != 'odata.editLink' && key != 'odata.id' && key != 'owshiddenversion' && key != 'Editor' && key != 'childs' && 
                                                                        key != 'Modified' && key != 'ModifiedDate' && key != 'No'  && key != 'Created'  && key != 'ModifiedBy') &&
                                                                                <li key={index}>
                                                                                    <span className='vh-textLabel'>{key}</span>
                                                                                    <span className='vh-textData' style={{wordBreak:'break-all'}}>{Array.isArray(item[key])
                                                                                        ? renderArray(item[key])
                                                                                        : typeof item[key] === 'object'
                                                                                            ? renderObject(item[key])
                                                                                            : item[key]}
                                                                                    </span>

                                                                                </li>}
                                                                     </> )
                                                                    })}
                                                            </ul>
                                                        )
                                                    })}
                                                </div>

                                            </td>
                                            <td>
                                            <span className="siteColor">{itm?.ModifiedBy}</span>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })}

                        </tbody>
                    </table >

            </Panel>

        </>
    );
}
