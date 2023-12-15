import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
// import './style.css'
import { Web } from 'sp-pnp-js';
import HHHHEditComponent from './popup-components/HHHHEditcontact';
import AddToLocalDBComponent from './popup-components/addToLocalDB';
import CreateContactComponent from './popup-components/CreateContact';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from '../../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { myContextValue } from '../../../../globalComponents/globalCommon'
import EditInstitutionPopup from './popup-components/EditInstitutionPopup';
let allListId: any = {};
let allSite: any = {
    GMBHSite: false,
    HrSite: false,
    MainSite: true,
}
let oldTaskLink:any

const ContactMainPage = (props: any) => {
    const [EmployeeData, setEmployeeData] = useState([]);
    const [institutionData, setInstitutionsData] = useState([]);
    const [EditContactStatus, setEditContactStatus] = useState(false);
    const [EditInstitutionStatus, setEditInstitutionStatus] = useState(false);
    const [EditContactData, setEditContactData] = useState([]);
    const [editInstitutionData, setEditInstitutionData] = useState([]);
    const [userEmails, setUserEmails] = useState([]);
    const [tableStatus, setTableStatus] = useState(true);
    const [searchedData, setSearchedData] = useState([]);
    const [searchedInstituteData, setSearchedInstituteData] = useState([]);
    const [AddToLocalDBStatus, setAddToLocalDBStatus] = useState(false);
    const [CreateContactStatus, setCreateContactStatus] = useState(false);
    const [CreateInstituteStatus, setCreateInstituteStatus] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [btnVisibility, setBtnVisibility] = useState(true);

    useEffect(() => {
        if (props?.props.Context.pageContext.web.absoluteUrl.toLowerCase().includes("hr")) {
            allSite = {
                HrSite: true,
                MainSite: false
            }
        }
        if (props?.props.Context.pageContext.web.absoluteUrl.toLowerCase().includes("gmbh")) {
            allSite = {
                GMBHSite: true,
                MainSite: false,
            }

        }
        allListId = {
            Context: props?.props.Context,
            HHHHContactListId: props?.props?.HHHHContactListId,
            HHHHInstitutionListId: props?.props?.HHHHInstitutionListId,
            MAIN_SMARTMETADATA_LISTID: props?.props?.MAIN_SMARTMETADATA_LISTID,
            MAIN_HR_LISTID: props?.props?.MAIN_HR_LISTID,
            ContractListID:props?.props?.ContractListID,
            GMBH_CONTACT_SEARCH_LISTID: props?.props?.GMBH_CONTACT_SEARCH_LISTID,
            HR_EMPLOYEE_DETAILS_LIST_ID: props?.props?.HR_EMPLOYEE_DETAILS_LIST_ID,
            siteUrl: props?.props.Context.pageContext.web.absoluteUrl,
            jointSiteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH"
        }
        if (allSite?.MainSite == true) {
            oldTaskLink="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Contacts-Search-Old.aspx"
            EmployeeDetails();
            InstitutionDetails();
        }
        if (allSite?.GMBHSite || allSite?.HrSite) {
            oldTaskLink=`${allListId?.siteUrl}/SitePages/Contacts-Search-Old.aspx`
            HrGmbhEmployeDeatails();
        }

    }, [])
    const EmployeeDetails = async () => {
        try {
            let web = new Web(allListId?.siteUrl);
            let data = await web.lists.getById(props?.props?.HHHHContactListId)
                .items
                .select("Id, Title, FirstName, FullName, Department,DOJ,DOE, Company, WorkCity, Suffix, WorkPhone, HomePhone, Comments, WorkAddress, WorkFax, WorkZip, Site, ItemType, JobTitle, Item_x0020_Cover, WebPage, Site, CellPhone, Email, LinkedIn, Created, SocialMediaUrls, SmartCountries/Title, SmartCountries/Id, Author/Title, Modified, Editor/Title, Division/Title, Division/Id, EmployeeID/Title, StaffID, EmployeeID/Id, Institution/Id, Institution/FullName, IM")
                .expand("EmployeeID, Division, Author, Editor, SmartCountries, Institution")
                .orderBy("Created", true)
                .get();
            data.map((Item: any) => {
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
            setEmployeeData(data);
            setSearchedData(data);
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const InstitutionDetails = async () => {
        try {
            let web = new Web(allListId?.siteUrl);
            await web.lists.getById(props?.props?.HHHHInstitutionListId)
                .items
               . select("Id","Title","FirstName","Description","FullName","Company","JobTitle","About","InstitutionType","SocialMediaUrls","ItemType","WorkCity","ItemImage","WorkCountry","WorkAddress","WebPage","CellPhone","HomePhone","Email","SharewebSites","Created","Author/Id","Author/Title","Modified","Editor/Id","Editor/Title")
                .expand("Author", "Editor",)
                .orderBy("Created", true)
                .get().then((data: any) => {
                    let instData = data.filter((instItem: any) => instItem.ItemType == "Institution")
                    if (instData?.length > 0) {
                        instData?.map((Item: any) => {
                            Item.SitesTagged = ''
                            if (Item.SharewebSites != null) {
                                if (Item.SharewebSites.length > 0) {
                                    Item.SharewebSites.map((site: any, index: any) => {
                                        if (index == 0) {
                                            Item.SitesTagged = site;
                                        } else if (index > 0) {
                                            Item.SitesTagged = Item.SitesTagged + ', ' + site;

                                        }
                                    })
                                }
                            }
                        })
                        setInstitutionsData(instData);
                        setSearchedInstituteData(instData);
                    }

                }).catch((error: any) => {
                    console.log(error)
                });

        } catch (error) {
            console.log("Error:", error.message);
        }

    }

    const HrGmbhEmployeDeatails = async () => {
        let employeeData: any = []
        let institutionData: any = []
        try {
            let web = new Web(allListId?.siteUrl);
            await web.lists.getById(allSite?.GMBHSite ? props?.props?.GMBH_CONTACT_SEARCH_LISTID : props?.props?.HR_EMPLOYEE_DETAILS_LIST_ID)
                .items
                .select("Id", "Title", "FirstName","FullName","DOJ","DOE", "Company", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip", "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage", "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls", "Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
                .expand("EmployeeID", "Division", "Author", "Editor", "Institution")
                .orderBy("Created", true)
                .get().then((data: any) => {
                    data.map((Item: any) => {
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
                        if (Item?.ItemType == "Institution") {
                            institutionData.push(Item)

                        } else {
                            employeeData.push(Item)

                        }
                    })
                    if (employeeData.length > 0) {
                        setEmployeeData(employeeData);
                        setSearchedData(employeeData);
                    }
                    if (institutionData.length > 0) {
                        setInstitutionsData(institutionData);
                        setSearchedInstituteData(institutionData);
                    }
                }).catch((error: any) => {
                    console.log(error)
                });



        } catch (error) {
            console.log("Error:", error.message);
        }
    }
 
    //***********************************Bulk Email function  */
    const sendEmail = () => {
        let emails = '';
        var ContactsNotHavingEmail: any = [];
        userEmails.map((item: any) => {

            if (item.isSelect == true) {
                if (item.Email == null) {
                    ContactsNotHavingEmail.push(item);

                }
                if (item.Email != null) {
                    emails += item.Email + ";";
                }
            }

        })
        window.location.href = 'mailto:' + emails;
    }
    //********************************End Bulk Email function */

    // *****************************All popup function and popup callback function*******************************
    const EditContactPopup = (items: any) => {
        setEditContactStatus(true);
        setEditContactData(items);
    }
    const ClosePopup = useCallback(() => {
        setEditContactStatus(false);
        setAddToLocalDBStatus(false);
        setCreateContactStatus(false);
        setCreateInstituteStatus(false);
        setEditInstitutionStatus(false);
    }, []);

    const addToLocalDBClosePopup = () => {
        setAddToLocalDBStatus(false);
        EmployeeDetails();
        setUserEmails([]);
    }
    const updateUserDtlFunction = useCallback(() => {
        EmployeeDetails();
        InstitutionDetails();
    }, [])
    const openInstitutionPopup=(editItems:any)=>{
        setEditInstitutionStatus(true);
        setEditInstitutionData(editItems);
    }
    //**************************End All popup function and popup callback function****************************************** */



    // ******************************column preparintion for contact and instituion function ***********************************
    const columns:any = React.useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 25,
                id: 'Id',
            },
            
            {
                cell: ({ row }: any) => (
                    <>
                        <img className='workmember ' src={`${row.original.Item_x0020_Cover != null && row.original.Item_x0020_Cover.Url != null ? row.original.Item_x0020_Cover.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg'}`} />
                    </>
                ),
                accessorFn: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 25,
            },
           
            {
                accessorFn: (row: any) => row?.FullName,
                cell: ({ row }: any) => (
                    <a target='_blank'data-interception="off" 
                        href={allSite?.HrSite?`${allListId?.siteUrl}/SitePages/EmployeeInfo.aspx?employeeId=${row?.original.Id}`:`${allListId?.siteUrl}/SitePages/Contact-Profile.aspx?contactId=${row?.original.Id}`}
                    >{row.original.FullName}</a>

                ),

                canSort: false,
                placeholder: 'Name',
                header: '',
                id: 'FullName',
                size: 150,
            },
            { accessorKey: "Email", placeholder: "Email Address", header: "", size: 80, },
            {
                accessorFn: (row: any) => row?.Institution?.FullName,
                cell: ({ row }: any) => (
                    <span>{row?.original?.Institution?.FullName}</span>

                ),
                canSort: false,
                placeholder: 'Organization',
                header: '',
                id: 'Company',
                size: 250,
            },
            {
                accessorFn: (row: any) => row?.Division?.Title,
                cell: ({ row }: any) => (
                    <span>{row?.original?.Division?.Title}</span>

                ),
                canSort: false,
                placeholder: 'Department',
                header: '',
                id: 'Department',
                size: 80,
            },
            { accessorKey: "JobTitle", placeholder: "Position", header: "", size: 80, },
            { accessorKey: "SitesTagged", placeholder: "Site", header: "", size: 80, },
            {
                cell: ({ row }) => (
                    <>
                        {/* <a onClick={() => EditContactPopup(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a> */}
                        <span onClick={() => EditContactPopup(row.original)} title="Edit" className='svg__iconbox svg__icon--edit hreflink'></span>
                    </>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 10,
            },
            // {
            //     cell: ({ row }) => (
            //         <>
            //             {/* <a onClick={() => postDataToServer(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a> */}                      
            //             <PrimaryButton onClick={() => postDataToServer(row.original)} text="Sync" />
            //         </>
            //     ),
            //     accessorKey: '',
            //     canSort: false,
            //     placeholder: '',
            //     header: '',
            //     id: 'row.original',
            //     size: 10,
            // }
        ],
        [searchedData]);
        const hrColumns:any = React.useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 25,
                id: 'Id',
            },
            
            {
                cell: ({ row }: any) => (
                    <>
                        <img className='workmember ' src={`${row.original.Item_x0020_Cover != null && row.original.Item_x0020_Cover.Url != null ? row.original.Item_x0020_Cover.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg'}`} />
                    </>
                ),
                accessorFn: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 25,
            },
            { accessorKey: "StaffID", placeholder: "StaffID", header: "", size: 100, },
            {
                accessorFn: (row: any) => row?.FullName,
                cell: ({ row }: any) => (
                    <a target='_blank'data-interception="off" 
                        href={allSite?.HrSite?`${allListId?.siteUrl}/SitePages/EmployeeInfo.aspx?employeeId=${row?.original.Id}`:`${allListId?.siteUrl}/SitePages/Contact-Profile.aspx?contactId=${row?.original.Id}`}
                    >{row.original.FullName}</a>

                ),

                canSort: false,
                placeholder: 'Name',
                header: '',
                id: 'FullName',
                size: 150,
            },
            { accessorKey: "Email", placeholder: "Email Address", header: "", size: 80, },
            {
                accessorFn: (row: any) => row?.Institution?.FullName,
                cell: ({ row }: any) => (
                    <span>{row?.original?.Institution?.FullName}</span>

                ),
                canSort: false,
                placeholder: 'Organization',
                header: '',
                id: 'Company',
                size: 250,
            },
            // {
            //     accessorFn: (row: any) => row?.Division?.Title,
            //     cell: ({ row }: any) => (
            //         <span>{row?.original?.Division?.Title}</span>

            //     ),
            //     canSort: false,
            //     placeholder: 'Department',
            //     header: '',
            //     id: 'Department',
            //     size: 80,
            // },
            { accessorKey: "JobTitle", placeholder: "Position", header: "", size: 80, },
            { accessorKey: "WorkCity", placeholder: "city", header: "", size: 80, },
            {
                cell: ({ row }) => (
                    <>
                        {/* <a onClick={() => EditContactPopup(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a> */}
                        <span onClick={() => EditContactPopup(row.original)} title="Edit" className='svg__iconbox svg__icon--edit hreflink'></span>
                    </>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 10,
            },
            // {
            //     cell: ({ row }) => (
            //         <>
            //             {/* <a onClick={() => postDataToServer(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a> */}                      
            //             <PrimaryButton onClick={() => postDataToServer(row.original)} text="Sync" />
            //         </>
            //     ),
            //     accessorKey: '',
            //     canSort: false,
            //     placeholder: '',
            //     header: '',
            //     id: 'row.original',
            //     size: 10,
            // }
        ],
        [searchedData]);
    const Inscolumns = React.useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [{
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: false,
            hasExpanded: false,
            isHeaderNotAvlable: true,
            size: 55,
            id: 'Id',
        },
        {
            cell: ({ row }: any) => (
                <>
                    <img className='workmember ' src={`${row.original.ItemImage != null && row.original.ItemImage.Url != null ? row.original.ItemImage.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/InstitutionPicture.jpg'}`} />
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 25,
        },
        {
            accessorFn: (row: any) => row?.FullName,
            cell: ({ row }: any) => (
                <a target='_blank'data-interception="off" 
                    href={`${allListId?.siteUrl}/SitePages/Institution-Profile.aspx?InstitutionId=${row?.original.Id}`}
                >{row.original.FullName}</a>

            ),

            canSort: false,
            placeholder: 'Search Instituion',
            header: '',
            id: 'FullName',
            size: 150,
        },
        { accessorKey: "WorkCity", placeholder: "City", header: "", size: 80, },
        { accessorKey: "SmartCountriesIns", placeholder: "Country", header: "", size: 80, },
        { accessorKey: "SitesTagged", placeholder: "Site", header: "", size: 80, },
       
        {
            cell: ({ row }) => (
                <>
                    {/* <a onClick={() => EditContactPopup(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a> */}
                    <span onClick={() => openInstitutionPopup(row?.original)} title="Edit" className='svg__iconbox svg__icon--edit hreflink'></span>
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        },
        ],
        [searchedInstituteData]);

    //***********************End  column preparintion for contact and instituion function */
    // ***********callback for table***************************************
    const callBackData = (data: any) => {
        if (data != undefined) {
            setIsDisabled(false);
            data.isSelect = true;
            setUserEmails([data]);
        } else {
            setUserEmails([]);
            setIsDisabled(true);
        }
        console.log(data)
    }
    // **************End *************************************
    return (
        <myContextValue.Provider value={{ ...myContextValue, allSite:allSite,allListId:allListId ,loggedInUserName:props.props?.userDisplayName,InstitutionAllData:institutionData}}>
        <div className='contact-section'>
            <div className='contact-container'>

                <div className='alignCenter'>
                {allSite?.GMBHSite &&<h2 className='heading'> Contact Database -Gmbh</h2>}
                    {allSite?.MainSite &&<h2 className='heading'>Joint Contact Database</h2>}
                    {allSite?.HrSite &&<h2 className='heading'>Contact Database-HR</h2>}
                    {/* <button className='btn btn-light btn-sm mx-1'><img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif' /></button> */}
                    <a className="hreflink" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg>
                    </a>
                    <span className="fw-semibold ml-auto"> <a target='_blank' data-interception="off" href={oldTaskLink} style={{ cursor: "pointer", fontSize: "14px" }}>Old Contact Page</a></span>
                </div>
               
                {/* <div className='contact-navigation'>
                    <button className={btnVisibility ? 'contact-nav-button-active' : 'contact-nav-button'} onClick={contactNavButtonFunction}>Contacts</button>
                    <button className={btnVisibility ? 'institute-nav-button' : 'institute-nav-button-active'} onClick={instituteNavButtonFunction}>Institution</button>
                </div> */}
                <div>
                    <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                        <button
                            className="nav-link active"
                            id="Contacts-Tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Contacts"
                            type="button"
                            role="tab"
                            aria-controls="Contacts"
                            aria-selected="true"
                        >
                            CONTACTS
                            {/* TASK INFORMATION */}
                        </button>
                        <button
                            className="nav-link"
                            id="Institution-Tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Institution"
                            type="button"
                            role="tab"
                            aria-controls="Institution"
                            aria-selected="false"
                        >
                            {/* TASK PLANNING */}
                            INSTITUTION
                        </button>
                    </ul>
                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                        <div className="tab-pane show active" id="Contacts" role="tabpanel" aria-labelledby="Contacts">
                            <div>
                                <div className="alignCenter" >
                                    <div className='ml-auto mb-1 '>
                                        <button className={isDisabled ? 'btnCol btn btn-primary mx-1' : "btnCol btn btn-primary mx-1"} onClick={sendEmail} disabled={isDisabled}>Bulk Email</button>
                                      {allSite?.MainSite&&<button className={isDisabled ? 'btnCol btn btn-primary mx-1' : "btnCol btn btn-primary mx-1"} onClick={() => setAddToLocalDBStatus(true)} disabled={isDisabled}>Add Contact To The Local Database</button>}
                                        <button className='btnCol btn btn-primary' onClick={() => setCreateContactStatus(true)}>Create Contact</button>

                                    </div>
                                </div>
                                <div className='Alltable'>
                                        <GlobalCommanTable columns={allSite?.HrSite?hrColumns:columns} data={searchedData} showHeader={true}
                                            callBackData={callBackData}
                                        />
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane" id="Institution" role="tabpanel" aria-labelledby="Institution">
                            <div>
                                <div className="alignCenter">
                                    <div className='ml-auto'>
                                        { allSite?.MainSite&&<button className={isDisabled ? 'btnCol btn btn-primary mx-1' : "btnCol btn btn-primary mx-1"} onClick={() => setAddToLocalDBStatus(true)}disabled={isDisabled}>Tag Institution</button>}
                                        <button className='btnCol btn btn-primary' onClick={() => setCreateInstituteStatus(true)}>Create Institution</button>
                                    </div>
                                </div>
                                <div className='Alltable'>
                                    <GlobalCommanTable columns={Inscolumns} data={searchedInstituteData} showHeader={true}
                                        callBackData={callBackData}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             
            </div>
            {EditContactStatus ? <HHHHEditComponent props={EditContactData}  callBack={ClosePopup}  /> : null}
            {AddToLocalDBStatus ? <AddToLocalDBComponent callBack={addToLocalDBClosePopup} data={userEmails} /> : null}
            {CreateContactStatus ? <CreateContactComponent callBack={ClosePopup}data={EmployeeData} userUpdateFunction={updateUserDtlFunction}/> : null}
            {CreateInstituteStatus ? <CreateContactComponent callBack={ClosePopup}CreateInstituteStatus={CreateInstituteStatus} data={institutionData} userUpdateFunction={updateUserDtlFunction} /> : null}
           {EditInstitutionStatus?<EditInstitutionPopup props={editInstitutionData} callBack={ClosePopup}/>:null}
        </div>
        </myContextValue.Provider>
    )
}
export default ContactMainPage;
export{myContextValue}