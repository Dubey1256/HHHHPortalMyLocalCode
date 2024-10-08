import * as React from "react";
import { useState, useEffect } from 'react';
import { Web } from "sp-pnp-js";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../../../../globalComponents/Tooltip";
import { myContextValue } from '../../../../../globalComponents/globalCommon'
const addToLocalDBComponent = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
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
                let updateSiteTag
                siteArray.push('HR')
                if (props.data[0]?.ItemType != "Institution") {
                    updateSiteTag = {
                        Site: {
                            results: siteArray
                        }
                    }
                }
                else {
                    updateSiteTag = {
                        SharewebSites: {
                            results: siteArray
                        },
                        Site: {
                            results: siteArray
                        }
                    }
                }
                let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                await web.lists.getById(props.data[0]?.ItemType == "Institution" ? myContextData2?.allListId?.HHHHInstitutionListId : myContextData2?.allListId?.HHHHContactListId)
                    .items.getById(props.data[0].Id).update(updateSiteTag).then(async (e: any) => {
                        // let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
                        // await web.lists.getById('6DD8038B-40D2-4412-B28D-1C86528C7842').items.add(
                        //     {
                        //         SmartContactId: props.data[0].Id
                        //     }
                        // ).then(() => {
                        let dataArray = props.data;
                        dataArray?.map((items: any, index: any) => {
                            let staffIdData: any;
                            let staffIdString: any;
                            if (items.isSelect == true) {
                                const taggedSite = async (Item: any, taggedSite: any) => {
                                    let web = new Web(`${myContextData2?.allListId?.jointSiteUrl}/HR`);
                                    let data = await web.lists.getById(myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.select('Title,Id,staffID0').orderBy('staffID0', false).top(1).get();
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
                                        let addData: any;
                                        if (Item?.ItemType != "Institution") {
                                            //     addData= 
                                            // {
                                            //     Title: (Item.Title ? Item.Title : ''),
                                            //     FirstName: (Item.FirstName ? Item.FirstName : ''),
                                            //     FullName: (Item.FullName ? Item.FullName : ''),
                                            //     Suffix: (Item.Suffix ? Item.Suffix : ''),
                                            //     JobTitle: (Item.JobTitle ? Item.JobTitle : ''),
                                            //     Email: (Item.Email ? Item.Email : ''),
                                            //     WorkPhone: (Item.WorkPhone ? Item.WorkPhone : ''),
                                            //     CellPhone: (Item.CellPhone ? Item.CellPhone : ''),
                                            //     HomePhone: (Item.HomePhone ? Item.HomePhone : ''),
                                            //     WorkCity: (Item.WorkCity ? Item.WorkCity : ''),
                                            //     WorkAddress: (Item.WorkAddress ? Item.WorkAddress : ''),
                                            //     WorkZip: (Item.WorkZip ? Item.WorkZip : ''),
                                            //     IM: (Item.IM ? Item.IM : ''),
                                            //     staffID0: staffIdData,
                                            //     StaffID: staffIdString,
                                            //     SmartContactId: Item.Id
                                            // }


                                            addData = {
                                                Title: (Item?.Title),
                                                FirstName: (Item?.FirstName),
                                                Suffix: (Item?.Suffix),
                                                JobTitle: (Item?.JobTitle),
                                                FullName: (Item?.FirstName) + " " + (Item?.Title),
                                                // InstitutionId: (Item?.Institution!=undefined? Item?.Institution?.Id :null),
                                                Email: (Item?.Email),
                                                staffID0: staffIdData,
                                                StaffID: staffIdString,
                                                WorkPhone: (Item?.WorkPhone),
                                                CellPhone: (Item?.CellPhone),
                                                HomePhone: (Item?.HomePhone),
                                                WorkCity: (Item?.WorkCity),
                                                WorkAddress: (Item?.WorkAddress),
                                                DOJ: Item?.DOJ != undefined ? new Date(Item?.DOJ).toISOString() : null,
                                                DOE: Item?.DOE != undefined ? new Date(Item?.DOE).toISOString() : null,

                                                WebPage: {
                                                    "__metadata": { type: "SP.FieldUrlValue" },
                                                    Description: (Item?.WebPage ? Item?.WebPage?.Url : null),
                                                    Url: (Item?.WebPage ? Item?.WebPage?.Url : null)
                                                },

                                                Item_x0020_Cover: {
                                                    "__metadata": { type: "SP.FieldUrlValue" },
                                                    Description: Item?.Item_x002d_Image != undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : ""),
                                                    Url: Item?.Item_x002d_Image != undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : "")
                                                },
                                                WorkZip: (Item?.WorkZip),
                                                IM: (Item?.IM),
                                                SocialMediaUrls: Item?.SocialMediaUrls != undefined && Item?.SocialMediaUrls != null ? Item?.SocialMediaUrls : null,
                                                SmartCountriesId: {
                                                    results: Item?.SmartCountries?.length > 0 ? [Item?.SmartCountries[0]?.Id] : []
                                                },

                                                SmartContactId: Item.Id
                                            }
                                        } else {
                                            //     addData= {
                                            //         Title: (Item.Title ? Item.Title : " "),
                                            //           FirstName: Item.FirstName,
                                            //         FullName: Item.FullName,
                                            //           ItemType: "Institution",
                                            //         SmartInstitutionId:Item.Id

                                            // }  
                                            addData = {
                                                Title: (Item?.Title),
                                                FirstName: (Item?.FirstName),
                                                Suffix: (Item?.Suffix),
                                                JobTitle: (Item?.JobTitle),
                                                FullName: (Item?.FirstName) + " " + (Item?.Title),
                                                Categories: Item?.Categories,
                                                ItemType: "Institution",
                                                Email: (Item?.Email),
                                                WorkPhone: (Item?.WorkPhone),
                                                CellPhone: (Item?.CellPhone),
                                                InstitutionType: Item?.InstitutionType,
                                                WorkCity: (Item?.WorkCity),
                                                WorkAddress: (Item?.WorkAddress),
                                                Description: Item?.Description,
                                                About: Item?.About,
                                                WebPage: {
                                                    "__metadata": { type: "SP.FieldUrlValue" },
                                                    Description: (Item?.WebPage ? Item?.WebPage?.Url : null),
                                                    Url: (Item?.WebPage ? Item?.WebPage?.Url : null)
                                                },
                                                // ItemImage:{
                                                //     "__metadata": { type: "SP.FieldUrlValue" },
                                                //     Description: Item?.Item_x002d_Image!=undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover!=undefined?Item?.Item_x0020_Cover?.Url:""),
                                                //     Url: Item?.Item_x002d_Image!=undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover!=undefined?Item?.Item_x0020_Cover?.Url:"")
                                                // },
                                                WorkZip: (Item?.WorkZip),

                                                SocialMediaUrls: item?.SocialMediaUrls != undefined && item?.SocialMediaUrls != null ? item?.SocialMediaUrls : null,
                                                SmartCountriesId: {
                                                    results: Item?.SmartCountries?.length > 0 ? [Item?.SmartCountries[0]?.Id] : []
                                                },
                                                SmartInstitutionId: Item?.Id

                                            }



                                        }
                                        try {
                                            let web = new Web(`${myContextData2?.allListId?.jointSiteUrl}/HR`);
                                            await web.lists.getById(myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.add(addData).then(async (e) => {
                                                console.log("request success", e);
                                                const web = new Web(myContextData2?.allListId?.jointSiteUrl);
                                                await web.lists
                                                    .getById(myContextData2?.allListId?.MAIN_HR_LISTID)
                                                    .items.add({
                                                        Title: (Item?.FirstName) + " " + (Item?.Title),
                                                        SmartContactId: Item.Id
                                                    }).then((data: any) => {
                                                        console.log(data, "hr main post done")

                                                    }).catch((error: any) => {
                                                        console.log(error)
                                                    })


                                                props.callBack()
                                            })
                                        } catch (error) {
                                            console.log("Error:", error.message);
                                        }
                                    }
                                }
                                taggedSite(items, "HR");
                            }
                        })
                        // })
                    })
            }

        }

        //*****************GMBH  data tag function */
        if (selectedSite == 'GMBH') {
            let str = siteArray.toString();
            if (str.search("GMBH") >= 0) {
                alert("This Contact already exists on GMBH site")
            } else {
                let updateSiteTag
                siteArray.push('GMBH')
                if (props.data[0]?.ItemType != "Institution") {
                    updateSiteTag = {
                        Site: {
                            results: siteArray
                        }
                    }
                }
                else {
                    updateSiteTag = {
                        SharewebSites: {
                            results: siteArray
                        },
                        Site: {
                            results: siteArray
                        }
                    }
                }
                let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                await web.lists.getById(props.data[0]?.ItemType == "Institution" ? myContextData2?.allListId?.HHHHInstitutionListId : myContextData2?.allListId?.HHHHContactListId)
                    .items.getById(props.data[0].Id).update(updateSiteTag).then(() => {
                        let dataArray = props.data;
                        dataArray?.map((items: any) => {
                            if (items.isSelect == true) {
                                const taggedSite = async (Item: any, taggedSite: any) => {
                                    if (taggedSite == 'GMBH') {
                                        let addData: any
                                        if (Item?.ItemType != "Institution") {


                                            addData = {
                                                Title: (Item?.Title),
                                                FirstName: (Item?.FirstName),
                                                Suffix: (Item?.Suffix),
                                                JobTitle: (Item?.JobTitle),
                                                FullName: (Item?.FirstName) + " " + (Item?.Title),
                                                // InstitutionId: (Item?.Institution!=undefined? Item?.Institution?.Id :null),
                                                Email: (Item?.Email),

                                                WorkPhone: (Item?.WorkPhone),
                                                CellPhone: (Item?.CellPhone),
                                                HomePhone: (Item?.HomePhone),
                                                WorkCity: (Item?.WorkCity),
                                                WorkAddress: (Item?.WorkAddress),
                                                DOJ: Item?.DOJ != undefined ? new Date(Item?.DOJ).toISOString() : null,
                                                DOE: Item?.DOE != undefined ? new Date(Item?.DOE).toISOString() : null,

                                                WebPage: {
                                                    "__metadata": { type: "SP.FieldUrlValue" },
                                                    Description: (Item?.WebPage ? Item?.WebPage?.Url : null),
                                                    Url: (Item?.WebPage ? Item?.WebPage?.Url : null)
                                                },

                                                Item_x0020_Cover: {
                                                    "__metadata": { type: "SP.FieldUrlValue" },
                                                    Description: Item?.Item_x002d_Image != undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : ""),
                                                    Url: Item?.Item_x002d_Image != undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : "")
                                                },
                                                WorkZip: (Item?.WorkZip),
                                                IM: (Item?.IM),
                                                SocialMediaUrls: Item?.SocialMediaUrls != undefined && Item?.SocialMediaUrls != null ? Item?.SocialMediaUrls : null,
                                                SmartCountriesId: {
                                                    results: Item?.SmartCountries?.length > 0 ? [Item?.SmartCountries[0]?.Id] : []
                                                },

                                                SmartContactId: Item.Id
                                            }

                                        } else {
                                            addData = {
                                                Title: (Item?.Title),
                                                FirstName: (Item?.FirstName),
                                                Suffix: (Item?.Suffix),
                                                JobTitle: (Item?.JobTitle),
                                                FullName: (Item?.FirstName) + " " + (Item?.Title),
                                                Categories: Item?.Categories,
                                                ItemType: "Institution",
                                                Email: (Item?.Email),
                                                WorkPhone: (Item?.WorkPhone),
                                                CellPhone: (Item?.CellPhone),
                                                InstitutionType: Item?.InstitutionType,
                                                WorkCity: (Item?.WorkCity),
                                                WorkAddress: (Item?.WorkAddress),
                                                Description: Item?.Description,
                                                About: Item?.About,
                                                WebPage: {
                                                    "__metadata": { type: "SP.FieldUrlValue" },
                                                    Description: (Item?.WebPage ? Item?.WebPage?.Url : null),
                                                    Url: (Item?.WebPage ? Item?.WebPage?.Url : null)
                                                },
                                                ItemImage: {
                                                    "__metadata": { type: "SP.FieldUrlValue" },
                                                    Description: Item?.Item_x002d_Image != undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : ""),
                                                    Url: Item?.Item_x002d_Image != undefined ? Item?.Item_x002d_Image?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : "")
                                                },
                                                WorkZip: (Item?.WorkZip),

                                                SocialMediaUrls: item?.SocialMediaUrls != undefined && item?.SocialMediaUrls != null ? item?.SocialMediaUrls : null,
                                                SmartCountriesId: {
                                                    results: Item?.SmartCountries?.length > 0 ? [Item?.SmartCountries[0]?.Id] : []
                                                },
                                                SmartInstitutionId: Item?.Id

                                            }

                                        }

                                        try {
                                            let web = new Web(`${myContextData2?.allListId?.jointSiteUrl}/GmBH`);
                                            await web.lists.getById(myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.add(addData).then((e) => {
                                                console.log("request success", e);
                                                props.callBack()
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

        }
        //***************** END GMBH  data tag function */

        //*****************Smalsus data tag function */
        if (selectedSite == 'SMALSUS') {
            // let str = siteArray.toString();
            // if (str.search("SMALSUS") >= 0) {
            //     alert("This Contact already exists on SMALSUS site")
            // } else {
            siteArray.push('SMALSUS')
            let web = new Web(myContextData2?.allListId?.jointSiteUrl);
            await web.lists.getById(myContextData2?.allListId?.HHHHContactListId).items.getById(props.data[0].Id).update(
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
                                let web = new Web(`${myContextData2?.allListId?.jointSiteUrl}/Smalsus`);
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
                                        let web = new Web(`${myContextData2?.allListId?.jointSiteUrl}/Smalsus`);
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
                                            InstitutionId: 262
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
    //*****************End Smalsus data tag function */
    const userDetails = () => {
        let userArray = props.data;
        userArray?.map((Item: any, index: any) => {
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
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    {props.data[0]?.ItemType == "Institution" ? "Tag Institution" : "Tag Contact"}
                </div>
                {props.data[0]?.ItemType == "Institution" ? <Tooltip ComponentId='657' /> : <Tooltip ComponentId='656' />}
            </>
        );
    };
    return (
        <Panel
            onRenderHeader={onRenderCustomHeadersmartinfo}
            isOpen={true}
            type={PanelType.custom}
            customWidth="380px"
            isBlocking={false}
            onDismiss={() => props?.callBack()}
        >

            <div>
                <div className="tag-section">
                    <span onClick={() => setSelectedSite('HR')}>
                        <input type='radio' className="mx-1" name="GMBH" />
                        <label>HR</label>
                    </span>
                    <span>
                        <input type='radio' onChange={() => setSelectedSite('GMBH')} className="mx-1" name="GMBH" />
                        <label>GMBH</label>
                    </span>
                    <span>
                        <input type='radio' onChange={() => setSelectedSite('SMALSUS')} className="mx-1" name="GMBH" />
                        <label>SMALSUS</label>
                    </span>
                </div>
                <footer className='pull-right'>
                    <button className='btn btn-primary mx-2'
                        onClick={taggedSiteFunction}>
                        Save
                    </button>
                    <button className='btn btn-default' onClick={() => props.callBack()}>
                        Cancel
                    </button>
                </footer>
            </div>

        </Panel>
    )
}
export default addToLocalDBComponent;