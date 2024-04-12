import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import { Panel, PanelType, DefaultButton } from 'office-ui-fabric-react';
import EditContactPopup from './EditContactPopup';
import CreateContactComponent from './CreateContact';
import ContactSmartFilter from './ContactSmartFilter';
let EditItem: any;
let allListId: any = {};
let backupallContact: any = []
const ContactSearch = (props: any) => {
    const baseUrl = props?.props?.Context?.pageContext?._web?.absoluteUrl;
    const MainSiteUrl = props?.props?.Context?.pageContext?.site?.absoluteUrl;
    const [allContactData, setallContactData] = useState([]);
    const [SelectCreateContact, setSelectCreateContact] = useState(false)
    const [EditPopupflag, setEditPopupflag] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true);
    const [userEmails, setUserEmails] = useState([]);
    let webs = new Web(baseUrl);

    useEffect(() => {
        allListId = {
            TeamContactSearchlistIds: props?.props?.TeamContactSearchlistIds,
            TeamSmartMetadatalistIds: props?.props?.TeamSmartMetadatalistIds,
            SmartMetadataListID: props?.props?.TeamSmartMetadatalistIds,
            Context: props?.props?.Context,
            baseUrl: baseUrl
        }
        getAllContact();
    }, [])
    const getAllContact = async () => {
        //allListId?.TeamContactSearchlistIds
        try {
            let data = await webs.lists.getById(allListId?.TeamContactSearchlistIds).items.select("WorkCity,Id,SmartActivitiesId,SmartCategories/Id,SmartCategories/Title,WorkCountry,ItemType,Email,FullName,ItemCover,Attachments,Categories,Company,JobTitle,FirstName,Title,Suffix,WebPage,IM,WorkPhone,CellPhone,HomePhone,WorkZip,Office,Comments,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title").expand("Author,Editor,SmartCategories").orderBy("Created desc").getAll();
            data.map((item: any) => {
                item.Selected = false
                if (item?.SmartCategories) {
                    item.SmartCategories.forEach((i: any) => {
                        if (i.Title == 'Member OV' || i.Title == 'Member' || i.Title == 'Friends' || i.Title == 'Friends - Active' || i.Title == 'Interest' || i.Title == 'Info' || i.Title == 'Partner' || i.Title == 'Ex')
                            item.Status = i.Title
                    })
                }
            })
            backupallContact = data
            setallContactData(data)
        } catch (error: any) {
            console.error(error);
        };
    };
    const OpenEditContactPopup = (item: any) => {
        setEditPopupflag(true)
        EditItem = item
    }
    const closeEditContactPopup = (item: any) => {
        setEditPopupflag(false)
        getAllContact();
    }
    const ClosePopup = useCallback(() => {
        setSelectCreateContact(false)
    }, []);
    const handleEmailClick = (email: any) => {
        window.location.href = `mailto:${email}`;
    };
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
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
                        <img className='workmember ' src={`${row?.original?.ItemCover != null && row?.original?.ItemCover?.Url != null ? row?.original?.ItemCover?.Url : `${MainSiteUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}`} />
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
                accessorKey: "FullName",
                placeholder: "Title",
                header: "",
                id: "Title",
                cell: ({ row }: any) => (
                    <>
                        <a target='_blank' data-interception="off"
                            href={`${baseUrl}/Sitepages/Contact-Profile.aspx?contactId=${row?.original.Id}`}
                        >{row.original.FullName}</a>
                    </>
                ),
            },
            {
                accessorKey: "Company", placeholder: "Institution", header: "", id: "Company",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.Company}</a>
                    </>
                ),
            },
            {
                accessorKey: "Email", placeholder: "Email", header: "", id: "Email", size: 55,
                cell: ({ row }: any) => (
                    <>
                        <a onClick={() => handleEmailClick(row?.original?.Email)}>{row?.original?.Email}</a>
                    </>
                ),
            },

            {
                accessorKey: "WorkCity", placeholder: "City", header: "", id: "WorkCity",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.WorkCity}</a>
                    </>
                ),
            },

            {
                accessorKey: "WorkCountry", placeholder: "Country", header: "", id: "WorkCountry",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.WorkCountry}</a>
                    </>
                ),
            },
            {
                cell: ({ row }) => (
                    <>
                        <span onClick={() => OpenEditContactPopup(row?.original)} title="Edit Contact Popup" className='svg__iconbox svg__icon--edit hreflink'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg>
                        </span>
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
        [allContactData]
    );
    //***********************************Bulk Email function  */
    const sendEmail = () => {
        let emails = '';
        var ContactsNotHavingEmail: any = [];
        userEmails.map((item: any) => {

            if (item.isSelect == true) {
                item.map((child: any) => {
                    if (child.Email == null) {
                        ContactsNotHavingEmail.push(child);

                    }
                    if (child.Email != null) {
                        emails += child.Email + ";";
                    }
                })
            }

        })
        window.location.href = 'mailto:' + emails;
    }
    //********************************End Bulk Email function */

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
    const EditCallBackItem = (updateData: any) => {
        let backupAllContactData = [...allContactData]; // Create a shallow copy of the original array
        if (updateData !== undefined && updateData !== null) {
            backupAllContactData = backupAllContactData.map((item) => {
                if (updateData.Id === item.Id) {
                    return updateData; // Replace the item with updateData if IDs match
                } else {
                    return item; // Otherwise, return the original item
                }
            });
        } else {
            getAllContact();
        }
        setallContactData(backupAllContactData);
        setSelectCreateContact(false)
    }
    const AddCallBackItem = () => {
        getAllContact();
        setSelectCreateContact(false)
    }
    const FilterCallback = (filterData: any) => {
        setallContactData(filterData)
    }
    const customTableHeaderButtons = (
        <div>
            <button className={isDisabled ? 'btnCol btn btn-primary mx-1' : "btnCol btn btn-primary mx-1"} onClick={sendEmail} disabled={isDisabled}>Bulk Email</button>
            <button className='btnCol btn btn-primary' onClick={() => setSelectCreateContact(true)}>Create Contact</button>
        </div>
    )
    return (
        <><div className="container">
            <header className="page-header">
                <h1 className="page-title heading">Contact Database</h1>
            </header>
            <div className="tab-pane show active" id="Contacts" role="tabpanel" aria-labelledby="Contacts">
                <div>
                    {/* <ContactSmartFilter props={props?.props} allContactData={allContactData} backupallContact={backupallContact} FilterCallback={FilterCallback}></ContactSmartFilter> */}
                    {/* <div className="alignCenter" >
                        <div className='ml-auto mb-1 '>
                            
                        </div>
                    </div> */}
                    <div className="TableContentSection">
                        <div className='Alltable mt-2 mb-2'>
                            <div className='col-md-12 p-0 '>
                                <GlobalCommanTable fixedWidthTable={true} columns={columns} customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons} data={allContactData} showHeader={true} callBackData={callBackData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {SelectCreateContact ? <CreateContactComponent callBack={ClosePopup} data={allContactData} AddCallBackItem={AddCallBackItem} closeEditContactPopup={closeEditContactPopup} EditCallBackItem={EditCallBackItem} allListId={allListId} /> : null}
            {EditPopupflag && (<EditContactPopup Context={props.props.Context} props={EditItem} closeEditContactPopup={closeEditContactPopup} EditCallBackItem={EditCallBackItem} allListId={allListId}></EditContactPopup>)}
        </div>
        </>
    )
};
export default ContactSearch;