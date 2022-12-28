import * as React from "react";
import { useState, useEffect } from "react";
import {Web} from 'sp-pnp-js';
import { VscClearAll } from 'react-icons/Vsc';

const orgContactEditPopup = (props: any) => {
    const [institutionData, setInstitutionData] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [searchKeys, setsearchKeys] = useState({
        FullName: '', City: '', Country: ''
    })
    console.log("institutionData==", institutionData)
    const [selectedOrg, setSelectedOrg] =useState();
    const [Index, setIndex] =useState();
    console.log("data name ====", props.institutionName)
    useEffect(()=>{
        InstitutionDetails();
    },[])

    const InstitutionDetails = async () => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('9f13fd36-456a-42bc-a5e0-cd954d97fc5f')
                .items
                .select("Id,FirstName,FullName,WorkCity,WorkCountry")
                .orderBy("Created", true)
                .get();
            setInstitutionData(data);
            setSearchedData(data);
        } catch (error) {
            console.log("Error user reasponse:", error.message);
        }

       
    }
    const searchFunction=(e: any, item: any)=>{
        let Key: any = e.target.value.toLowerCase();  
        if (item == 'FullName') {
            setsearchKeys({ ...searchKeys, FullName: Key });
            const data: any = {
                nodes: institutionData?.filter((items:any) =>
                    items.FullName?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if(Key.length == 0){
                setSearchedData(institutionData);
            }
        }
        if (item == 'City') {
            setsearchKeys({ ...searchKeys, City: Key });
            const data: any = {
                nodes: institutionData?.filter((items:any) =>
                    items.WorkCity?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if(Key.length == 0){
                setSearchedData(institutionData);
            }
        }
        if (item == 'Country') {
            setsearchKeys({ ...searchKeys, Country: Key });
            const data: any = {
                nodes: institutionData?.filter((items:any) =>
                    items.WorkCountry?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if(Key.length == 0){
                setSearchedData(institutionData);
            }
        }
    }
    const seletctOrgStatus =(item:any, index:any)=>{
        props.selectedStatus(item);
        setSelectedOrg(item);
        setIndex(index);
    }
    const ClearFilter =()=>{
        setSearchedData(institutionData);
        setsearchKeys({
            FullName: '', City: '', Country: ''
        })
    }
    const saveChange = ()=>{
        props.orgChange(selectedOrg);
        props.callBack();
    }
    return (
        <div>
            <div className="popup-section">
                <div className="popup-container-org">
                    <div className="popup-content">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <div><h3>Select Organisation</h3></div>
                                <button className="btn-close" onClick={() => props.callBack()}></button>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{ width: "400px" }}><input type='text' onChange={(e) => searchFunction(e, 'FullName')} placeholder="Title" value={searchKeys.FullName} /><button>=</button></th>
                                            <th><input type='text' onChange={(e) => searchFunction(e, 'City')} placeholder="City" value={searchKeys.City}/><button>=</button></th>
                                            <th><input type='text' onChange={(e) => searchFunction(e, 'Country')} placeholder="Country" value={searchKeys.Country}/><button>=</button></th>
                                            <th><button onClick={ClearFilter}><VscClearAll /></button></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedData.map((items: any, index: any) => {
                                            return (
                                                <tr key={index}>
                                                    <td><input type="radio" onClick={()=>seletctOrgStatus(items, index)} checked={index == Index || props.institutionName == items.FullName} /></td>
                                                    <td>{items.FullName ? items.FullName : "NA"}</td>
                                                    <td>{items.WorkCity ? items.WorkCity : "NA"}</td>
                                                    <td>{items.WorkCountry ? items.WorkCountry : "NA"}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer text-muted justify-content-end">
                                <button className="btn btn-primary mx-2" onClick={saveChange}>Save</button><button onClick={() => props.callBack()} className="btn btn-danger mx-2">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default orgContactEditPopup;