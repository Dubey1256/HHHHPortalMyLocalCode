import * as React from 'react';
import {useState} from 'react';
const ContactTable = (data:any, dataLength:any) => {
    const EmployeeData = data;
    const [searchedData, setSearchedData] = useState([]);
    const [userEmails, setUserEmails] = useState([]);

    const SearchData = (e: any, item: any) => {
        dataLength=searchedData.length;
        let Key: any = e.target.value.toLowerCase();
        if (item == "Main-Search") {
            const data: any = {
                nodes: EmployeeData.filter((items:any) =>
                    items.includes(Key)
                ),
            };
            setSearchedData(data.nodes);
        }
        if (item == "FullName") {
            const data: any = {
                nodes: EmployeeData.filter((items:any) =>
                    items.FullName?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
        }
        if (item == "Email-Address") {

            const data: any = {
                nodes: EmployeeData.filter((items:any) =>
                    items.Email?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
        }
        if (item == "Organization") {
            let temp: any[] = [];
            EmployeeData.map((items:any) => {
                if (items.Institution) {
                    if (items.Institution.FullName !== undefined) {
                        temp.push(items);
                    }
                }
            })
            const data: any = {
                nodes: temp.filter((items) =>
                    items.Email?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
        }
        if (item == "Department") {
            const data: any = {
                nodes: EmployeeData.filter((items:any) =>
                    items.Department?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
        }
        if (item == "Position") {
            const data: any = {
                nodes: EmployeeData.filter((items:any) =>
                    items.JobTitle?.toLowerCase().includes(Key)
                ),
            };
            setSearchedData(data.nodes);
        }
        if (item == "Sites") {
            let arr :any;
            const data: any = {
                nodes: EmployeeData.filter((items:any) =>{
                    arr={...items.Site}
                    arr.toLowerCase().includes(Key)
                }
                ),
            };
            setSearchedData(data.nodes);
            console.log("site hata ===", data.nodes);
        }
    }

    const allChecked = () => {
        EmployeeData.map((items:any, index:any)=>{
            setUserEmails(items.Email);
            console.log("emails ===", userEmails);
        })
    }
    return (
        <div>
            <thead>
                <tr>
                    <th ><input type='checkbox' onChange={allChecked} />All</th>
                    <th ><input type='text' placeholder='Name' onChange={(e) => SearchData(e, 'FullName')} /><button>=</button></th>
                    <th ><input type='text' placeholder='Email Address' onChange={(e) => SearchData(e, 'Email-Address')} /><button>=</button></th>
                    <th ><input type='text' placeholder='Organization' onChange={(e) => SearchData(e, 'Organization')} /><button>=</button></th>
                    <th ><input type='text' placeholder='Department' onChange={(e) => SearchData(e, 'Department')} /><button>=</button></th>
                    <th ><input type='text' placeholder='Position' onChange={(e) => SearchData(e, 'Position')} /><button>=</button></th>
                    <th ><input type='text' placeholder='Sites' onChange={(e) => SearchData(e, 'Sites')} /><button>=</button></th>
                </tr>
            </thead>
            <tbody>
                {searchedData?.map((items, index) => {

                    return (
                        <tr key={index}>
                            <th scope="row"><input type="checkbox" /></th>
                            <td><img className="userImg" src={items.Item_x0020_Cover != undefined ? items.Item_x0020_Cover.Url : null} />{items.FullName}</td>
                            <td>{items.Email}</td>
                            <td>{items.Institution ? items.Institution.FullName : null}</td>
                            <td>{items.Department}</td>
                            <td>{items.JobTitle}</td>
                            <td>{items.Site ? items.Site.toString() : ""}</td>
                        </tr>
                    )
                })}
            </tbody>
        </div>)
}
export default ContactTable;