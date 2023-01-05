import * as React from "react";
import { useState, useEffect } from 'react';
import { Web } from "sp-pnp-js";

const addToLocalDBComponent = (props: any) => {
    const [selectedSite, setSelectedSite] = useState('');
    const [userData, setUserData] = useState('');
    useEffect(() => {
        userDetails();
    }, [])
    const taggedSiteFunction = async (item: any) => {
        let siteArray = props.data[0].Site ? props.data[0].Site : [];
        if (selectedSite == 'HR') {
            let str = siteArray.toString();
            if (str.search("HR") >= 0) {
                alert("This Contact already exists on HR site")
            } else {
                siteArray.push('HR')
                let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
                await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.getById(props.data[0].Id).update(
                    {
                        Site: {
                            results: siteArray
                        }
                    }).then(async (e: any) => {
                        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
                        await web.lists.getById('6DD8038B-40D2-4412-B28D-1C86528C7842').items.add(
                            {
                                SmartContactId: props.data[0].Id
                            }
                        ).then(() => {
                            let dataArray = props.data;
                            dataArray?.map((items: any, index: any) => {
                                let staffIdData: any;
                                let staffIdString: any;
                                if (items.isSelect == true) {
                                    const taggedSite = async (Item: any, taggedSite: any) => {
                                        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
                                        let data = await web.lists.getById('A7B80424-E5E1-47C6-80A1-0EE44A70F92C').items.select('Title,Id,staffID0').orderBy('staffID0', false).top(1).get();
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
                                        if (taggedSite == 'HR') {
                                            try {
                                                let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
                                                await web.lists.getById('A7B80424-E5E1-47C6-80A1-0EE44A70F92C').items.add({
                                                    Title: (Item.Title ? Item.Title : ''),
                                                    FirstName: (Item.FirstName ? Item.FirstName : ''),
                                                    FullName: (Item.FullName ? Item.FullName : ''),
                                                    Suffix: (Item.Suffix ? Item.Suffix : ''),
                                                    JobTitle: (Item.JobTitle ? Item.JobTitle : ''),
                                                    Email: (Item.Email ? Item.Email : ''),
                                                    WorkPhone: (Item.WorkPhone ? Item.WorkPhone : ''),
                                                    CellPhone: (Item.CellPhone ? Item.CellPhone : ''),
                                                    HomePhone: (Item.HomePhone ? Item.HomePhone : ''),
                                                    WorkCity: (Item.WorkCity ? Item.WorkCity : ''),
                                                    WorkAddress: (Item.WorkAddress ? Item.WorkAddress : ''),
                                                    WorkZip: (Item.WorkZip ? Item.WorkZip : ''),
                                                    IM: (Item.IM ? Item.IM : ''),
                                                    staffID0: staffIdData,
                                                    StaffID: staffIdString,
                                                    SmartContactId: Item.Id
                                                }).then((e) => {
                                                    console.log("request success", e);

                                                })
                                            } catch (error) {
                                                console.log("Error:", error.message);
                                            }
                                        }
                                    }
                                    taggedSite(items, "HR");
                                }
                            })
                        })
                    })
            }
            props.callBack()
        }
        if (selectedSite == 'GMBH') {
            let str = siteArray.toString();
            if (str.search("GMBH") >= 0) {
                alert("This Contact already exists on GMBH site")
            } else {
                siteArray.push('GMBH')
                let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/");
                await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.getById(props.data[0].Id).update(
                    {
                        Site: {
                            results: siteArray
                        }
                    }).then(() => {
                        let dataArray = props.data;
                        dataArray?.map((items: any) => {
                            if (items.isSelect == true) {
                                const taggedSite = async (Item: any, taggedSite: any) => {
                                    if (taggedSite == 'GMBH') {
                                        try {
                                            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/GmBH');
                                            await web.lists.getById('6CE99A82-F577-4467-9CDA-613FADA2296F').items.add({
                                                Title: (Item.Title ? Item.Title : ''),
                                                FirstName: (Item.FirstName ? Item.FirstName : ''),
                                                FullName: (Item.FullName ? Item.FullName : ''),
                                                Suffix: (Item.Suffix ? Item.Suffix : ''),
                                                JobTitle: (Item.JobTitle ? Item.JobTitle : ''),
                                                Email: (Item.Email ? Item.Email : ''),
                                                WorkPhone: (Item.WorkPhone ? Item.WorkPhone : ''),
                                                CellPhone: (Item.CellPhone ? Item.CellPhone : ''),
                                                HomePhone: (Item.HomePhone ? Item.HomePhone : ''),
                                                WorkCity: (Item.WorkCity ? Item.WorkCity : ''),
                                                WorkAddress: (Item.WorkAddress ? Item.WorkAddress : ''),
                                                WorkZip: (Item.WorkZip ? Item.WorkZip : ''),
                                                IM: (Item.IM ? Item.IM : ''),
                                            }).then((e) => {
                                                console.log("request success", e);
                                            })
                                        } catch (error) {
                                            console.log("Error:", error.message);
                                        }
                                    }

                                }
                                taggedSite(items, "GMBH");
                            }
                        })
                    })
            }
            props.callBack()
        }
        if (selectedSite == 'SMALSUS') {
            // let str = siteArray.toString();
            // if (str.search("SMALSUS") >= 0) {
            //     alert("This Contact already exists on SMALSUS site")
            // } else {
                siteArray.push('SMALSUS')
                let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
                await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.getById(props.data[0].Id).update(
                    {
                        Site: {
                            results: siteArray
                        }
                    }).then((e: any) => {
                        let dataArray = props.data;
                        dataArray?.map((items: any, index: any) => {
                            let staffIdData: any;
                            let staffIdString: any;
                            if (items.isSelect == true) {
                                const taggedSite = async (Item: any, taggedSite: any) => {

                                    let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/Smalsus');
                                    let data = await web.lists.getById('69e59417-fa02-4431-9d7d-100560cf3aff').items.select('Title,Id,staffID0').orderBy('staffID0', false).top(1).get();
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
                                        staffIdString = ("S-0000" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 2) {
                                        staffIdString = ("S-000" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 3) {
                                        staffIdString = ("S-00" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 4) {
                                        staffIdString = ("S-0" + tempStaffId);
                                    }
                                    if (tempStaffIdLength == 5) {
                                        staffIdString = ("S-" + tempStaffId);
                                    }
                                    if (taggedSite == 'SMALSUS') {
                                        try {
                                            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/Smalsus');
                                            await web.lists.getById('69e59417-fa02-4431-9d7d-100560cf3aff').items.add({
                                                Title: (Item.Title ? Item.Title : ''),
                                                FirstName: (Item.FirstName ? Item.FirstName : ''),
                                                FullName: (Item.FullName ? Item.FullName : ''),
                                                Suffix: (Item.Suffix ? Item.Suffix : ''),
                                                JobTitle: (Item.JobTitle ? Item.JobTitle : ''),
                                                Email: (Item.Email ? Item.Email : ''),
                                                WorkPhone: (Item.WorkPhone ? Item.WorkPhone : ''),
                                                CellPhone: (Item.CellPhone ? Item.CellPhone : ''),
                                                HomePhone: (Item.HomePhone ? Item.HomePhone : ''),
                                                WorkCity: (Item.WorkCity ? Item.WorkCity : ''),
                                                WorkAddress: (Item.WorkAddress ? Item.WorkAddress : ''),
                                                WorkZip: (Item.WorkZip ? Item.WorkZip : ''),
                                                IM: (Item.IM ? Item.IM : ''),
                                                staffID0: staffIdData,
                                                StaffID: staffIdString,
                                                SmartContactId: Item.Id,
                                                ItemType: 'Contact',
                                                InstitutionId:262
                                            }).then((e) => {
                                                console.log("request success", e);
                                            })
                                        } catch (error) {
                                            console.log("Error:", error.message);
                                        }
                                    }

                                }
                                taggedSite(items, "SMALSUS");
                            }
                        })
                    })
            // }
        }
        props.callBack()
    }
    const userDetails = () => {
        let userArray = props.data;
        userArray.map((Item: any, index: any) => {
            Item.SitesTagged = ''
            if (Item.Site != null) {
                if (Item.Site.length >= 0) {
                    Item.Site?.map((site: any, index: any) => {
                        if (index == 0) {
                            Item.SitesTagged = site;
                        } else if (index > 0) {
                            Item.SitesTagged = Item.SitesTagged + ', ' + site;
                        }
                    })
                }
            }
        })
        setUserData(userArray);
    }
    return (
        <div className="popup-section">
            {console.log("user data add to local ====", userData)}
            <div className="popup-container">
                <div className="popup-content">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div><h3>Tag Contact</h3></div>
                            <button className="header-btn" onClick={() => props.callBack()}>
                                <img src="https://hhhhteams.sharepoint.com/_layouts/images/delete.gif" />
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="tag-section">
                                <span onClick={() => setSelectedSite('HR')}>
                                    <input type='radio' className="mx-1" name="HR" />
                                    <label className="mx-2">HR</label>
                                </span>
                                <span>
                                    <input type='radio' onChange={() => setSelectedSite('GMBH')} className="mx-1" name="GMBH" />
                                    <label className="mx-">GMBH</label>
                                </span>
                                <span>
                                    <input type='radio' onChange={() => setSelectedSite('SMALSUS')} className="mx-1" name="GMBH" />
                                    <label className="mx-">SMALSUS</label>
                                </span>
                            </div>
                        </div>
                        <div className="card-footer d-flex flex-row-reverse">
                            <button onClick={() => props.callBack()} className="cancel-btn mx-1">Cancel</button>
                            <button className="save-btn" onClick={taggedSiteFunction}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default addToLocalDBComponent;