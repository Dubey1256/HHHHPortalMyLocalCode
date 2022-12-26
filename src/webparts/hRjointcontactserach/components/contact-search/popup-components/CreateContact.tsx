import * as React from "react";
import { useState, useCallback } from 'react';
import HHHHEditComponent from "./HHHHEditcontact";
import { Web } from 'sp-pnp-js';

const CreateContactComponent = (props: any) => {
    const listData = props.data;
    const [listIsvisible, setListIsVisible] = useState(false);
    const [profileStatus, setProfileStatus] = useState(false);
    const [contactId, setContactId] = useState(Number);
    const [searchedNameData, setSearchedDataName] = useState(props.data)
    const [isUserExist, setuserExits] = useState(true);
    const [newContact, setNewContact] = useState(false);
    const [searchKey, setSearchKey] = useState({
        Title: '',
        FirstName: '',
    });
    let updateCallBack =  props.userUpdateFunction;
    const searchedName = async (e: any) => {
        setListIsVisible(true);
        let Key: any = e.target.value.toLowerCase();
        let subString = Key.split(" ");
        setSearchKey({ ...searchKey, Title: subString[0] + " " + subString[1] })
        setSearchKey({ ...searchKey, FirstName: subString })
        const data: any = {
            nodes: listData.filter((items: any) =>
                items.FullName?.toLowerCase().includes(Key)
            ),
        };
        setSearchedDataName(data.nodes);
        if (Key.length == 0) {
            setSearchedDataName(listData);
            setListIsVisible(false);
        }
        if (data.nodes.length == 0) {
            setuserExits(false);
        }
    }
    const saveDataFunction = async () => {
        try {
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH');
            await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.add({
                Title: (searchKey.FirstName[1]?searchKey.FirstName[1]:" "),
                FirstName: searchKey.FirstName[0],
                FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1]?searchKey.FirstName[1]:" ")
            }).then((data)=>{
                  setContactId(data.data.Id)
                  console.log("request success");
            })
        } catch (error) {
            console.log("Error:", error.message);
        }
        //    props.callBack();
        props.userUpdateFunction();
        setTimeout(() => {
            setNewContact(true)
        }, 1000)
    }
    const editProfile = (item: any) => {
        setProfileStatus(true);
        setContactId(item.Id);
    }

    const ClosePopup = useCallback(() => {
        setProfileStatus(false);
        props.callBack();
        setContactId(8);
    }, []);
    return (
        <div>
            <div className="popup-section">
                <div className="popup-container">
                    <div className="popup-content">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <div><h3>Create Contact</h3></div>
                                <button className="btn-close" onClick={() => props.callBack()}></button>
                            </div>
                            <div className="card-body my-5">
                                <input type='text' placeholder="Enter Contact Name" onChange={(e) => searchedName(e)} className="form-control" />
                                {listIsvisible ? <div>
                                    <ul className="list-group">
                                        {searchedNameData.map((item: any) => {
                                            return (
                                                <li className="list-group-item" onClick={() => editProfile(item)} >{item.FullName}</li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                    : null}
                            </div>
                            <div className="card-footer justify-content-end">
                                <button className="btn btn-primary mx-1" onClick={saveDataFunction} disabled={isUserExist}>Save</button>
                                <button onClick={() => props.callBack()} className="btn btn-danger mx-1">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {profileStatus ? <HHHHEditComponent props={contactId} callBack={ClosePopup} /> : null}
            {newContact ? <HHHHEditComponent props={contactId} userUpdateFunction={updateCallBack} callBack={ClosePopup} /> : null}
        </div>
    )
}
export default CreateContactComponent;