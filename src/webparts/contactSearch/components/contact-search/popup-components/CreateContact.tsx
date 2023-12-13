import * as React from "react";
import { useState, useCallback } from 'react';
import HHHHEditComponent from "./HHHHEditcontact";
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../../../../globalComponents/Tooltip";
import { myContextValue } from '../../../../../globalComponents/globalCommon'
import { error } from "jquery";
import EditInstitutionPopup from "./EditInstitutionPopup";
const CreateContactComponent = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
    const listData = props.data;
    const [listIsVisible, setListIsVisible] = useState(false);
    const [profileStatus, setProfileStatus] = useState(false);
    const [contactdata, setContactdata]: any = useState();
    const [institutionData, setInstitutionData]: any = useState();
    const [searchedNameData, setSearchedDataName] = useState(props?.data)
    const [isUserExist, setUserExits] = useState(true);
    const [newContact, setNewContact] = useState(false);
    const [newInstitution, setNewInstitution] = useState(false);

    const [searchKey, setSearchKey] = useState({
        Title: '',
        FirstName: '',
    });
    React.useEffect(() => {
        if (props?.data != undefined) {

            setSearchedDataName(props?.data)
        }
    }, [])
    let updateCallBack = props.userUpdateFunction;
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
            setUserExits(false);
        }
    }
    const saveDataFunction = async () => {
        if (props?.CreateInstituteStatus) {
            CreateInstitution();
        } else {
            try {
                let jointData:any
                if (myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite) {
                    jointData= {
                    //     SharewebSites: {
                    //     results: (myContextData2?.allSite?.GMBHSite?["GMBH"]:["HR"])
                    // },
                    Site: {
                        results: (myContextData2?.allSite?.GMBHSite?["GMBH"]:["HR"])
                    },

                   
                    Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                    FirstName: searchKey.FirstName[0],
                    FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                    ItemType: "Contact"
                    
                }   
                }else{
                    jointData= {
                        Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        FirstName: searchKey.FirstName[0],
                        FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        ItemType: "Contact"
                    }
                   
                }
                let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                await web.lists.getById(myContextData2?.allListId?.HHHHContactListId).items.add(jointData).then(async (data: any) => {
                    if (myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite) {
                    let postData:any;
                        if(myContextData2?.allSite?.HrSite){
                            let staffIdData: any;
                            let staffIdString: any;
                              let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
                                    let Hrdata = await web.lists.getById(myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.select('Title,Id,staffID0').orderBy('staffID0', false).top(1).get();
                                    let tempStaffIdLength: number = 1;
                                    let tempStaffId: number = 1;
                                    if (Hrdata[0].staffID0 != undefined) {
                                        tempStaffId = Hrdata[0].staffID0 + 1;
                                        tempStaffIdLength = (tempStaffId.toString()).length;
                                        staffIdData = (Hrdata[0].staffID0 + 1);
                                    } else (
                                        staffIdData = 1
                                    )
                                    if (tempStaffIdLength == 1) {
                                        staffIdString = ("HHHH-0000" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 2) {
                                        staffIdString = ("HHHH-000" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 3) {
                                        staffIdString = ("HHHH-00" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 4) {
                                        staffIdString = ("HHHH-0" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 5) {
                                        staffIdString = ("HHHH-" + tempStaffId);
                                    }
                                    postData={
                                        Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                                        FirstName: searchKey.FirstName[0],
                                        FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                                        staffID0: staffIdData,
                                        StaffID: staffIdString,
                                        SmartContactId: data?.data?.Id
                                    }
                                  
                        }
                        else{
                            postData={
                                Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                                FirstName: searchKey.FirstName[0],
                                FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                               
                                SmartContactId: data?.data?.Id
                            }

                        }
                        let web = new Web(myContextData2?.allListId?.siteUrl);
                        await web.lists.getById(myContextData2?.allSite?.GMBHSite ? myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID : myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.add(postData).then((LocalData) => {
                            setContactdata(LocalData?.data)
                            if(myContextData2?.allSite?.HrSite){
                                PostJointHrDetails(data?.data)
                            }
                        }).catch((error: any) => {
                         console.log(error)
                        })
                    } else {
                        setContactdata(data?.data)
                        console.log("request success");
                    }
                    props.userUpdateFunction();
                    setTimeout(() => {
                        setNewContact(true)
                    }, 1000)
                })
            } catch (error) {
                console.log("Error:", error.message);
            }
            //    props.callBack();
           
        }

    }
    const PostJointHrDetails=async(data:any)=>{
        const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
        await web.lists
     .getById("6DD8038B-40D2-4412-B28D-1C86528C7842")
          .items.add({
             Title:(data?.FirstName ) + " " + (data?.Title ),
             SmartContactId:data?.Id
          }).then((data:any)=>{
             console.log(data,"hr main post done")

          }).catch((error:any)=>{
             console.log(error)
          })

    }
    const CreateInstitution = async () => {
        try {
            let jointData:any
                if (myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite) {
                    jointData= {
                        SharewebSites: {
                            results: (myContextData2?.allSite?.GMBHSite?["GMBH"]:["HR"])
                        },
                        Site: {
                            results: (myContextData2?.allSite?.GMBHSite?["GMBH"]:["HR"])
                        },
                    Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                    FirstName: searchKey.FirstName[0],
                    FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                    ItemType: "Institution"
                    
                }   
                }else{
                    jointData= {
                        Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        FirstName: searchKey.FirstName[0],
                        FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        ItemType: "Institution"
                    }
                   
                }

            let web = new Web(myContextData2?.allListId?.jointSiteUrl);
            await web.lists.getById(myContextData2?.allListId?.HHHHInstitutionListId).items.add(jointData ).then(async (data) => {
                console.log("joint institution post sucessfully", data)
                if (myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite) {
                    let web = new Web(myContextData2?.allListId?.siteUrl);
                    await web.lists.getById(myContextData2?.allSite?.GMBHSite ? myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID : myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.add({
                        Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        FirstName: searchKey.FirstName[0],
                        FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        ItemType: "Institution",
                        SmartInstitutionId:data?.data?.Id
                    }).then((newData) => {
                        console.log("local institution also done")
                        setInstitutionData(newData?.data)
                    }).catch((error: any) => {
                    console.log(error)
                    })
                } else {
                    setInstitutionData(data?.data)

                    console.log("request success");
                }

            })
        } catch (error) {
            console.log("eeeorCreate Institution", error.message)
        }
        setTimeout(() => {
            setNewInstitution(true)
        }, 1000)
    }
    const editProfile = (item: any) => {
        setProfileStatus(true);
        setContactdata(item);
    }

    const ClosePopup = useCallback(() => {
        setProfileStatus(false);
        props.callBack();
        setContactdata(8);
    }, []);
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    {props?.CreateInstituteStatus?"Create Institution":"Create Contact"}
                 
                </div>
                <Tooltip ComponentId='3299' />
            </>
        );
    };
    return (

        <Panel
            onRenderHeader={onRenderCustomHeadersmartinfo}
            isOpen={true}
            type={PanelType.custom}
            customWidth="450px"
            isBlocking={false}
            onDismiss={() => props?.callBack()}
        >

            <div className="modal-body">
                <div className="">
                    <label className="form-label full-width"></label>

                    <input type='text' placeholder="Enter Contacts Name" onChange={(e) => searchedName(e)} className="form-control" />
                    {listIsVisible ? <div>
                        <ul className="list-group">
                            {searchedNameData.map((item: any) => {
                                return (
                                    <li className="list-group-item" onClick={() => editProfile(item)} >{item.FullName}</li>
                                )
                            })}
                        </ul>
                    </div>
                        : null}
                </div></div>
            <footer className="mt-2 pull-right">
                <button className="btn btn-primary mx-1" onClick={saveDataFunction} disabled={isUserExist}>Save</button>
                <button onClick={() => props.callBack()} className="btn btn-default">Cancel</button>
            </footer>

            {profileStatus ? <HHHHEditComponent props={contactdata} callBack={ClosePopup} /> : null}
            {newContact ? <HHHHEditComponent props={contactdata} userUpdateFunction={updateCallBack} callBack={ClosePopup} /> : null}
            {newInstitution ? <EditInstitutionPopup props={institutionData} callBack={ClosePopup} /> : null}
        </Panel>
    )
}
export default CreateContactComponent;