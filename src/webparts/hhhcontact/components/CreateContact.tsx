import * as React from "react";
import { useState, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../../globalComponents/Tooltip";
import { myContextValue } from "../../../globalComponents/globalCommon";
import EditContactPopup from "./EditContactPopup";
let staffIdData: any;
let staffIdString: any;
const CreateContactComponent = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
    const listData = props.data;
    const [listIsVisible, setListIsVisible] = useState(false);
    const [profileStatus, setProfileStatus] = useState(false);
    const [contactdata, setContactdata]: any = useState();
    const [searchedNameData, setSearchedDataName] = useState(props?.data)
    const [isUserExist, setUserExits] = useState(true);
    const [newContact, setNewContact] = useState(false);
    let webs = new Web(props?.allListId?.baseUrl);
    const [searchKey, setSearchKey] = useState({
        Title: '',
        FirstName: '',
    });
    React.useEffect(() => {
        getAllContact();
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
        } else {
            setUserExits(true);
        }
    }
    const getAllContact = async () => {
            let data = await webs.lists.getById(props?.allListId?.TeamContactSearchlistIds).items.select('Title,Id,staffID0').orderBy('staffID0', false).top(1).get();
            let tempStaffIdLength: number = 1;
            let tempStaffId: number = 1;
            if (data[0].staffID0 != undefined) {
                tempStaffId = data[0].staffID0 + 1;
                tempStaffIdLength = (tempStaffId.toString()).length;
                staffIdData = (data[0].staffID0 + 1);
            } else (
                staffIdData = 1
            )
            if (tempStaffIdLength == 1) {
                staffIdString = ("ILF-0000" + tempStaffId);
            }
            if (tempStaffIdLength == 2) {
                staffIdString = ("ILF-000" + tempStaffId);
            }
            if (tempStaffIdLength == 3) {
                staffIdString = ("ILF-00" + tempStaffId);
            }
            if (tempStaffIdLength == 4) {
                staffIdString = ("ILF-0" + tempStaffId);
            }
            if (tempStaffIdLength == 5) {
                staffIdString = ("ILF-" + tempStaffId);
            }            
    };


    const saveDataFunction = async () => {
        try {
            let jointData = {
                Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                FirstName: searchKey.FirstName[0],
                FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                staffID0: staffIdData,
                StaffID: staffIdString,
                ItemType: "Contact"
            }
            await webs.lists.getById(props?.allListId?.TeamContactSearchlistIds).items.add(jointData).then(async (data: any) => {
                setContactdata(data?.data)
                console.log("request success");
                setNewContact(true)
            })
        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    const editProfile = (item: any) => {
        setProfileStatus(true);
        setContactdata(item);
    }
    const closeEditpoup = (page: any, update: any, updatedetails: any) => {
        if (page == "CreateContact" && update !== "Update") {
            setProfileStatus(false);
            setNewContact(false)
        }
        else {
            setProfileStatus(false);
            setNewContact(false)
            props.EditCallBackItem(updatedetails);
        }
    }
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className="subheading">
                    Create Contact
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
                        <input type='text' placeholder="Enter Contacts Name" onChange={(e) => searchedName(e)} className="form-control" />
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

                {profileStatus && !newContact && (<EditContactPopup props={contactdata} allListId={props?.allListId} closeEditpoup={closeEditpoup} EditCallBackItem={props.EditCallBackItem} page={"CreateContact"} />)}
                {!profileStatus && newContact && (<EditContactPopup props={contactdata} allListId={props?.allListId} closeEditpoup={closeEditpoup} EditCallBackItem={props.EditCallBackItem} page={"CreateNewContact"} />)}
            </Panel>
        </>
    )
}
export default CreateContactComponent;
