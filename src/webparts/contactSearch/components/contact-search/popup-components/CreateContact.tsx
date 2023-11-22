import * as React from "react";
import { useState, useCallback } from 'react';
import HHHHEditComponent from "./HHHHEditcontact";
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../../../../globalComponents/Tooltip";
import { myContextValue } from '../../../../../globalComponents/globalCommon'
import { error } from "jquery";
const CreateContactComponent = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
    const listData = props.data;
    const [listIsVisible, setListIsVisible] = useState(false);
    const [profileStatus, setProfileStatus] = useState(false);
    const [contactdata, setContactdata]:any = useState();
    const [searchedNameData, setSearchedDataName] = useState(props?.data)
    const [isUserExist, setUserExits] = useState(true);
    const [newContact, setNewContact] = useState(false);
    const [searchKey, setSearchKey] = useState({
        Title: '',
        FirstName: '',
    });
    React.useEffect(()=>{
   if(props?.data!=undefined){
  
    setSearchedDataName(props?.data)
   }
    },[])
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
        if(props?.CreateInstituteStatus){
            CreateInstitution() ;
        }else{
            try {
           
                let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                await web.lists.getById(myContextData2?.allListId?.HHHHContactListId).items.add({
                    Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                    FirstName: searchKey.FirstName[0],
                    FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " ")
                }).then(async(data) => {
                    if(myContextData2?.GMBHSite|| myContextData2?.HrSite){
                        let web = new Web(myContextData2?.allListId?.siteUrl);
                        await web.lists.getById(myContextData2?.allSite?.GMBHSite ? myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID : myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.add({
                            Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                            FirstName: searchKey.FirstName[0],
                            FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " ")
                        }).then((LocalData) => {
                            setContactdata(LocalData?.data)
                        }).catch((error:any)=>{
    
                        })
                    }else{
                        setContactdata(data?.data)
                        console.log("request success");
                    }
                   
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
        
    }
    const CreateInstitution=async()=>{
        try{

            let web = new Web(myContextData2?.allListId?.jointSiteUrl);
             await web.lists.getById(myContextData2?.allListId?.HHHHInstitutionListId).items.add({
                Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                FirstName: searchKey.FirstName[0],
                FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                ItemType: "Institution"
            }).then(async(data) => {
                console.log( "joint institution post sucessfully",data)
                if(myContextData2?.GMBHSite|| myContextData2?.HrSite){
                    let web = new Web(myContextData2?.allListId?.siteUrl);
                    await web.lists.getById(myContextData2?.allSite?.GMBHSite ? myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID : myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.add({
                        Title: (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        FirstName: searchKey.FirstName[0],
                        FullName: searchKey.FirstName[0] + " " + (searchKey.FirstName[1] ? searchKey.FirstName[1] : " "),
                        ItemType: "Institution"
                    }).then((LocalData) => {
                       console.log("local institution also done")
                    }).catch((error:any)=>{

                    })
                }else{
                    setNewContact(true)
                    console.log("request success");
                }
               
            })
        }catch(error){
            console.log("eeeorCreate Institution",error.message)
        }
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
                Create Contact
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
        onDismiss={()=>props?.callBack()}
    >

            <div className="modal-body">
                <div className="input-group">
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
          
            {profileStatus ? <HHHHEditComponent  props={contactdata} callBack={ClosePopup} /> : null}
            {newContact ? <HHHHEditComponent props={contactdata} userUpdateFunction={updateCallBack} callBack={ClosePopup} /> : null}
       
        </Panel>
    )
}
export default CreateContactComponent;