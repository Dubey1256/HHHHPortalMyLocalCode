import * as React from "react";
import { useState, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../../globalComponents/Tooltip";
import { myContextValue } from "../../../globalComponents/globalCommon";
import EditContactPopup from "./EditContactPopup";
import EditInstitutionPopup from "./EditInstitutionPopup";

const CreateInstitutionComponent = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
    const listData = props.data;
    const [listIsVisible, setListIsVisible] = useState(false);
    const [profileStatus, setProfileStatus] = useState(false);
    const [Institutiondata, setInstitutiondata]: any = useState();
    const [searchedNameData, setSearchedDataName] = useState(props?.data)
    const [isUserExist, setUserExits] = useState(true);
    const [NewInstitution, setNewInstitution] = useState(false);
    let webs = new Web(props?.allListId?.baseUrl);
    const [searchKey, setSearchKey] = useState({
        Title: '',
        FirstName: '',
    });
    React.useEffect(() => {
        if (props?.data != undefined) {
            setSearchedDataName(props?.data)
        }
    }, [props?.data != undefined])
    const searchedName = async (e: any) => {
        setListIsVisible(true);
        let Key: any = e.target.value;
        let subString = Key.split(" ");
        setSearchKey({ ...searchKey, Title: subString[0] + " " + subString[1] })
        setSearchKey({ ...searchKey, FirstName: subString })
        const data: any = {
            nodes: listData.filter((item: any) => {
                const fullName = item.FullName?.toLowerCase();
                if (!fullName) return false; 
                const searchTerms = Key.split(" ").filter((term: string) => term.trim() !== "");
                return searchTerms.every((term: string) => fullName.includes(term.toLowerCase()));
            }),
        };
        setSearchedDataName(data.nodes);
        if (Key.length == 0) {
            setSearchedDataName(listData);
            setListIsVisible(false);
        }
        if (data.nodes.length == 0) {
            setUserExits(false);
        }else{
            setUserExits(true);
        }
    }

    const saveDataFunction = async () => {
        try {
            let jointData = {
                Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                FirstName: searchKey.FirstName[0],
                FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                ItemType: "Institution",
            }
                await webs.lists.getById(props?.allListId?.TeamInstitutionlistIds).items.add(jointData).then(async (data: any) => {
                setInstitutiondata(data?.data)
                console.log("request success");
                setNewInstitution(true)
            })
        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    const editProfile = (item: any) => {
        setProfileStatus(true);
        setInstitutiondata(item);
    }
    const closeEditpoup = (page: any,update:any,updatedetails:any) => {
        if (page == "CreateInstitution" && update!=="Update") {
            setProfileStatus(false);
            setNewInstitution(false)
        }
        else {
            setProfileStatus(false);
            setNewInstitution(false)
            props.EditCallBackItem(updatedetails);
        }
    }
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <> 
                <div className="subheading">
                    Create Institution
                </div>
                <Tooltip ComponentId='696' />
            </>
        );
    };

    
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeadersmartinfo}
                isOpen={true}
                type={PanelType.custom}
                customWidth="450px"
                isBlocking={false}
                isFooterAtBottom={true}
                onDismiss={() => props?.callBack()}
            >
                <div className="modal-body">
                    <div className="">
                        <label className="form-label full-width"></label>
                        <input type='text' placeholder="Enter Institution Name" onChange={(e) => searchedName(e)} className="form-control" />
                        {listIsVisible ? <div>
                            <ul className="list-group">
                                {searchedNameData?.map((item: any) => {
                                    return (
                                        <li className="list-group-item" onClick={() => editProfile(item)} >{item.FullName}</li>
                                    )
                                })}
                            </ul>
                        </div>
                            : null}
                    </div>
                </div>
                <footer>
                    <div className="col text-end mt-2">
                    <button className="btn btn-primary ms-1 mx-2" onClick={saveDataFunction} disabled={isUserExist}>Save</button>
                    <button onClick={() => props.callBack()} className="btn btn-default">Cancel</button>
                    </div>
                </footer>
               
                {profileStatus && !NewInstitution && (<EditInstitutionPopup props={Institutiondata} allListId={props?.allListId} closeEditpoup={closeEditpoup} EditCallBackItem={props.EditCallBackItem} page={"CreateInstitution"} />)}
                {!profileStatus && NewInstitution && (<EditInstitutionPopup props={Institutiondata} allListId={props?.allListId} closeEditpoup={closeEditpoup} EditCallBackItem={props.EditCallBackItem} page={"CreateInstitution"} />)}
            </Panel>
        </>
    )
}
export default CreateInstitutionComponent;
