import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import HHHHEditComponent from './popup-components/HHHHEditcontact';
import AddToLocalDBComponent from './popup-components/addToLocalDB';
import CreateContactComponent from './popup-components/CreateContact';
// import { BsSearch } from 'react-icons/Bs';
import { VscClearAll , VscSearch} from 'react-icons/Vsc';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { AiFillPrinter } from 'react-icons/ai';
// import { MdOpenInFull } from 'react-icons/md';


const ContactMainPage = (props: any) => {
    const [EmployeeData, setEmployeeData] = useState([]);
    const [institutionData, setInstitutionsData] = useState([]);
    const [inputField, setInputField] = useState({ FullName: '', EmailAddress: '', Organization: '', Department: '', Position: '', Sites: '', SearchInstitution: '', City: '', Country: '', InstituteSites: '', mainSearch: '', InstituteMainSearch: '' });
    const [EditContactStatus, setEditContactStatus] = useState(false);
    const [EditContactData, setEditContactData] = useState([]);
    const [count, setCount] = useState(0);
    const [userEmails, setUserEmails] = useState([]);
    const [tableStatus, setTableStatus] = useState(true);
    const [searchedData, setSearchedData] = useState([]);
    const [searchedInstituteData, setSearchedInstituteData] = useState([]);
    const [AddToLocalDBStatus, setAddToLocalDBStatus] = useState(false);
    const [CreateContactStatus, setCreateContactStatus] = useState(false);
    const [CreateInstituteStatus, setCreateInstituteStatus] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [btnVisibility, setBtnVisibility] = useState(true);
    // const [mainSearch, setMainSearch] = useState([]);
    // const [Index, setIndex] =useState(0);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    useEffect(() => {
        EmployeeDetails();
        InstitutionDetails();
    }, [])
    const EmployeeDetails = async () => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a')
                .items
                .select("Id", "Title", "FirstName", "FullName", "Department", "Company", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip", "Site", "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage", "Site", "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls", "SmartCountries/Title", "SmartCountries/Id", "Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
                .expand("EmployeeID", "Division", "Author", "Editor", "SmartCountries", "Institution")
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
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('9f13fd36-456a-42bc-a5e0-cd954d97fc5f')
                .items
                .select("Id,Title,FirstName,FullName,Company,JobTitle,ItemType,WorkCity,ItemImage,WorkCountry,WorkAddress,Twitter,Instagram,Facebook,LinkedIn,WebPage,CellPhone,HomePhone,Email,SharewebSites,Created,Author/Title,Modified,Editor/Title")
                .expand("Author", "Editor",)
                .orderBy("Created", true)
                .get();
            data.map((Item: any) => {
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
            setInstitutionsData(data);
            setSearchedInstituteData(data);
        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    const contactNavButtonFunction = () => {
        setTableStatus(true);
        setBtnVisibility(true);
    }
    const instituteNavButtonFunction = () => {
        setTableStatus(false);
        setBtnVisibility(false);
    }
    const SearchData = (e: any, item: any) => {
        let Key: any = e.target.value.toLowerCase();
        if (item == "Main-Search") {
            setInputField({ ...inputField, mainSearch: Key });
            let filteredAllAdminData;
            if (Key) {
                filteredAllAdminData = EmployeeData.filter((item) => {
                    if (
                        item.FullName?.toLowerCase().includes(Key) || item.Email?.toLowerCase().includes(Key) ||
                        item.Institution?.FullName?.toLowerCase().includes(Key) || item.JobTitle?.toLowerCase().includes(Key) || item.Department?.toLowerCase().includes(Key) || item.SitesTagged?.toLowerCase().includes(Key)
                    ) {
                        return true;
                    }
                    return false;
                });
                setSearchedData(filteredAllAdminData)

            } if (Key.length == 0) {
                setSearchedData(EmployeeData);
            }
        }
        if (item == "FullName") {
            setInputField({ ...inputField, FullName: Key });
            const data: any = {
                nodes: EmployeeData.filter((items: any) =>
                    items.FullName?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if (Key.length == 0) {
                setSearchedData(EmployeeData);
            }
        }
        if (item == "Email-Address") {
            setInputField({ ...inputField, EmailAddress: Key });
            const data: any = {
                nodes: EmployeeData.filter((items: any) =>
                    items.Email?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if (Key.length == 0) {
                setSearchedData(EmployeeData);
            }
        }
        if (item == "Organization") {
            setInputField({ ...inputField, Organization: Key });
            let temp: any[] = [];
            EmployeeData.map((items: any) => {
                if (items.Institution) {
                    if (items.Institution.FullName !== undefined) {
                        temp.push(items);
                    }
                }
            })
            const data: any = {
                nodes: temp.filter((items) =>
                    items.Institution.FullName?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if (Key.length == 0) {
                setSearchedData(EmployeeData);
            }
        }
        if (item == "Department") {
            setInputField({ ...inputField, Department: Key });
            const data: any = {
                nodes: EmployeeData.filter((items: any) =>
                    items.Department?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if (Key.length == 0) {
                setSearchedData(EmployeeData);
            }
        }
        if (item == "Position") {
            setInputField({ ...inputField, Position: Key });
            const data: any = {
                nodes: EmployeeData.filter((items: any) =>
                    items.JobTitle?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if (Key.length == 0) {
                setSearchedData(EmployeeData);
            }
        }
        if (item == "Sites") {

            setInputField({ ...inputField, Sites: Key });
            const data: any = {
                nodes: EmployeeData.filter((items: any) =>
                    items.SitesTagged?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
            if (Key.length == 0) {
                setSearchedData(EmployeeData);
            }
        }

        if (item == "Institute-Main-Search") {
            setInputField({ ...inputField, mainSearch: Key });
            let filteredAllAdminData;
            if (Key) {
                filteredAllAdminData = institutionData.filter((item) => {
                    if (
                        item.FullName?.toLowerCase().includes(Key) || item.WorkCity?.toLowerCase().includes(Key) ||
                        item.WorkCountry?.toLowerCase().includes(Key) || item.SitesTagged?.toLowerCase().includes(Key)
                    ) {
                        return true;
                    }
                    return false;
                });
                setSearchedData(filteredAllAdminData)

            } if (Key.length == 0) {
                setSearchedData(institutionData);
            }
        }

        if (item == 'Search-Institution') {
            setInputField({ ...inputField, SearchInstitution: Key });
            const data: any = {
                nodes: institutionData.filter((items: any) =>
                    items.FullName?.toLowerCase().includes(Key)
                ),
            };
            setSearchedInstituteData(data.nodes);
            if (Key.length == 0) {
                setSearchedInstituteData(institutionData);
            }
        }
        if (item == 'City') {
            setInputField({ ...inputField, City: Key });
            const data: any = {
                nodes: institutionData.filter((items: any) =>
                    items.WorkCity?.toLowerCase().includes(Key)
                ),
            };
            setSearchedInstituteData(data.nodes);
            if (Key.length == 0) {
                setSearchedInstituteData(institutionData);
            }
        }
        if (item == 'Country') {
            setInputField({ ...inputField, Country: Key });
            const data: any = {
                nodes: institutionData.filter((items: any) =>
                    items.WorkCountry?.toLowerCase().includes(Key)
                ),
            };
            setSearchedInstituteData(data.nodes);
            if (Key.length == 0) {
                setSearchedInstituteData(institutionData);
            }
        }
        if (item == 'Institute-Sites') {
            setInputField({ ...inputField, InstituteSites: Key });
            const data: any = {
                nodes: institutionData.filter((items: any) =>
                    items.SitesTagged?.toLowerCase().includes(Key)
                ),
            };
            setSearchedInstituteData(data.nodes);
            if (Key.length == 0) {
                setSearchedInstituteData(institutionData);
            }
        }
    }
    const allChecked = (e: any) => {
        var key = e.currentTarget.checked;
        if (key == true) {
            searchedData.map((item, index) => {
                item.isSelect = key;
            })
            setIsDisabled(false);
            setUserEmails(EmployeeData)
        } if (key == false) {
            searchedData.map((item, index) => {
                item.isSelect = key;
            })
            setIsDisabled(true);
            setUserEmails([])
        }
    }
    const checkedData = (e: any, item: any, index: number) => {
        var key = e.currentTarget.checked;
        var selectArray: any = [];
        if (key == true) {
            setCount(count + 1);
            searchedData.map((items, index) => {
                if (items.Id == item.Id) {
                    selectArray.push(items);
                    item.isSelect = key;
                }
                if (items.Id != item.Id) {
                    selectArray.push(items);
                }
            })
            setSearchedData(selectArray);
            setIsDisabled(false);
        }
        if (key == false) {
            setCount(count - 1);
            searchedData.map((items, index) => {
                if (items.Id == item.Id) {
                    item.isSelect = key;
                    selectArray.push(items);
                }
                if (items.Id != item.Id) {
                    selectArray.push(items);
                } if (count == 1) {
                    setIsDisabled(true);
                }
            })
        }
        userEmails.push(item);
    }
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
    const clearFilter = () => {
        setSearchedData(EmployeeData);
        setSearchedInstituteData(institutionData);
        setInputField({ FullName: '', EmailAddress: '', Organization: '', Department: '', Position: '', Sites: '', SearchInstitution: '', City: '', Country: '', InstituteSites: '', mainSearch: '',InstituteMainSearch:'' });
    }
    const printFunction = () => {
        window.print();
    }
    const downloadExcel = (csvData: any, fileName: any) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    const fullScreen = () => {
    }
    const EditContactPopup = (items: any) => {
        setEditContactStatus(true);
        setEditContactData(items);
    }
    const ClosePopup = useCallback(() => {
        setEditContactStatus(false);
        setAddToLocalDBStatus(false);
        setCreateContactStatus(false);
        setCreateInstituteStatus(false);
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
    return (
        <div className='contact-section'>
            <div className='contact-container'>
                <div className='contact-heading'>
                    <h2>Joint Contact Database</h2>
                    <button className='btn btn-light btn-sm mx-1'><img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif' /></button>
                </div>
                <div className='contact-navigation'>
                    <button className={btnVisibility ? 'contact-nav-button-active' : 'contact-nav-button'} onClick={contactNavButtonFunction}>Contacts</button>
                    <button className={btnVisibility ? 'institute-nav-button' : 'institute-nav-button-active'} onClick={instituteNavButtonFunction}>Institution</button>
                </div>
                <div className='component-section my-2'>
                    {tableStatus ? <div>
                        <div className="card-header d-flex justify-content-between" >
                            <div><span className='mx-2'>Showing <b>{searchedData.length}</b> of <b>{EmployeeData.length} </b>Contacts</span>
                                <input type='text' onChange={(e) => SearchData(e, 'Main-Search')} className="main-search" value={inputField.mainSearch} />
                                <button className='search-button'><VscSearch /></button>
                            </div>
                            <div className='table-buttons'>
                                {isDisabled ? null : <><button className='function-btns' onClick={sendEmail} disabled={isDisabled}>Bulk Email</button>
                                    <button className='function-btns' onClick={() => setAddToLocalDBStatus(true)} disabled={isDisabled}>Add Contact To The Loacl Database</button></>}
                                <button className='function-btns' onClick={() => setCreateContactStatus(true)}>Create Contact</button>
                                <button className='btn-light btn-sm mx-1' onClick={clearFilter}><VscClearAll /></button>
                                <button className='btn-light btn-sm mx-1' onClick={() => downloadExcel(EmployeeData, "Employee-Data")}><RiFileExcel2Fill /></button>
                                <button className='btn-light btn-sm mx-1' onClick={printFunction}><AiFillPrinter /></button>
                                <button className='btn-light btn-sm mx-1' onClick={fullScreen}>a</button>
                            </div>
                        </div>
                        <div className='section-event'>
                            <div className='table-container'>
                                <table className="table table-hover">
                                    <thead className='table-head'>
                                        <tr>
                                            <th>
                                                <input type='checkbox' onChange={(e) => allChecked(e)} />All
                                            </th>
                                            <th>
                                                <input type='text' id='FullName' className='search-input' placeholder='Name' value={inputField.FullName} onChange={(e) => SearchData(e, 'FullName')} />
                                            </th>
                                            <th>
                                                <input type='text' id='Email-Address' className='search-input' placeholder='Email Address' value={inputField.EmailAddress} onChange={(e) => SearchData(e, 'Email-Address')} />
                                            </th>
                                            <th>
                                                <input type='text' id='Organization' className='search-input' placeholder='Organization' value={inputField.Organization} onChange={(e) => SearchData(e, 'Organization')} />
                                            </th>
                                            <th>
                                                <input type='text' id='Department' className='search-input' style={{ width: "100px" }} placeholder='Department' value={inputField.Department} onChange={(e) => SearchData(e, 'Department')} />
                                            </th>
                                            <th>
                                                <input type='text' id='Position' className='search-input' placeholder='Position' value={inputField.Position} onChange={(e) => SearchData(e, 'Position')} />
                                            </th>
                                            <th>
                                                <input type='text' id='Sites' placeholder='Sites' className='search-input' value={inputField.Sites} onChange={(e) => SearchData(e, 'Sites')} />
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody className='contact-table'>
                                        {searchedData?.map((items, index) => {
                                            return (
                                                <tr key={index} style={{ fontSize: "13px" }}>
                                                    <td scope="row" style={{ width: "4%" }}>
                                                        <input type="checkbox" checked={items.isSelect} onChange={(e) => checkedData(e, items, index)} />
                                                    </td>
                                                    <td className='full-name' style={{ width: "17%" }}>
                                                        <img className="userImg" src={items.Item_x0020_Cover != undefined ? items.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />

                                                        <a href={"https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Contact-Profile-SPFx.aspx?contactId=" + items.Id} target="_blank"> {items.FullName ? items.FullName : "NA"}
                                                        </a>
                                                    </td>
                                                    <td style={{ width: "17%" }} >{items.Email ? items.Email : "NA"}</td>
                                                    <td className="full-name" style={{ width: "18%" }}>{items.Institution ? items.Institution.FullName : "NA"}
                                                    </td>
                                                    <td style={{ width: "15%" }}>{items.Department ? items.Department : "NA"}</td>
                                                    <td style={{ width: "17%" }}>{items.JobTitle ? items.JobTitle : "NA"}</td>
                                                    <td style={{ width: "17%" }}>{items.SitesTagged ? items.SitesTagged : "NA"}</td>
                                                    <td>
                                                        <button className='edit-btn' onClick={() => EditContactPopup(items.Id)}><img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif' />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </ table>
                            </div>
                        </div>
                    </div> :
                        <div className='table-buttons'>
                            <div className="card-header d-flex justify-content-between">
                                <div><span className='mx-2'>Showing <b>{searchedInstituteData.length}</b> of <b>{institutionData.length}</b> Institutes</span>
                                    <input type='text' className="main-search" onChange={(e) => SearchData(e, 'Institute-Main-Search')} defaultValue={inputField.InstituteMainSearch} />
                                    <button className='search-button'><VscSearch /></button>
                                </div>
                                <div>
                                    {isDisabled ? null : <button className='function-btns' onClick={() => setAddToLocalDBStatus(true)}>Tag Institution</button>}
                                    <button className='function-btns' onClick={() => setCreateInstituteStatus(true)}>Create Institution</button>
                                    <button className='btn-light btn-sm mx-1' onClick={clearFilter}><VscClearAll /></button>
                                    <button className='btn-light btn-sm mx-1' onClick={() => downloadExcel(institutionData, "Institution-Data")}><RiFileExcel2Fill /></button>
                                    <button className='btn-light btn-sm mx-1' onClick={printFunction}><AiFillPrinter /></button>
                                </div>
                            </div>
                            <div>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th><input type='checkbox' onChange={(e) => allChecked(e)} />All</th>
                                            <th><input type='text' placeholder='Search Institution' className='search-input' value={inputField.SearchInstitution} onChange={(e) => SearchData(e, 'Search-Institution')} /></th>
                                            <th><input type='text' placeholder='City' value={inputField.City} className='search-input' onChange={(e) => SearchData(e, 'City')} /></th>
                                            <th><input type='text' placeholder='Country' value={inputField.Country} onChange={(e) => SearchData(e, 'Country')} /></th>
                                            <th><input type='text' placeholder='Sites' value={inputField.InstituteSites} className='search-input' onChange={(e) => SearchData(e, 'Institute-Sites')} /></th>

                                        </tr>
                                    </thead>
                                    <tbody className='institute-table'>
                                        {searchedInstituteData?.map((items, index) => {
                                            return (
                                                <tr key={index} style={{ fontSize: "13px" }}>
                                                    <th scope="row"><input type="checkbox" onChange={(e) => checkedData(e, items, index)} /></th>
                                                    <td className='full-name'>{items.FullName}</td>
                                                    <td>{items.WorkCity ? items.WorkCity : "NA"}</td>
                                                    <td>{items.WorkCountry ? items.WorkCountry : "NA"}</td>
                                                    <td>{items.SitesTagged ? items.SitesTagged : "NA"}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {EditContactStatus ? <HHHHEditComponent props={EditContactData} loggedInUserName={props.loggedInUserName} InstitutionAllData={institutionData} callBack={ClosePopup} userUpdateFunction={updateUserDtlFunction} /> : null}
            {AddToLocalDBStatus ? <AddToLocalDBComponent callBack={addToLocalDBClosePopup} data={userEmails} /> : null}
            {CreateContactStatus ? <CreateContactComponent callBack={ClosePopup} data={EmployeeData} userUpdateFunction={updateUserDtlFunction} /> : null}
            {CreateInstituteStatus ? <CreateContactComponent callBack={ClosePopup} data={institutionData} userUpdateFunction={updateUserDtlFunction} /> : null}
        </div>
    )
}
export default ContactMainPage;