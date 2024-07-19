import * as React from "react";
import { useState } from 'react';
import Tooltip from "../../../../../globalComponents/Tooltip";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "react-bootstrap";
const CountryContactEditPopup = (props: any) => {
    const [updateData, setUpdateData] = React.useState(props?.updateData)
    const [searchItem, setSearchItem] = React.useState('');
    const [value, setValue] = React.useState("");
    const [dataCapture, setDataCapture] = React.useState([]);
    const [searchedData, setSearchedData] = React.useState([]);
    const [isSearchWithDesciptions, setIsSearchWithDesciptions] = React.useState(true);
    const [selectedStateData, setSelectedStateData] = useState({
        Title: (props?.selectedState != undefined ? props?.selectedState?.Fedral_State : '')
    })
    React.useEffect(() => {
        setUpdateData(props?.updateData)
    }, [])
    const selectData = (item: any) => {
        let backupdata = JSON.parse(JSON.stringify(updateData));
        setUpdateData(backupdata);
        let data = [];
        data.push(item);
        if (props.popupName == 'Country') {
            backupdata = { ...backupdata, ...{ SmartCountries: [item] } }
            setUpdateData(backupdata);
        }
        if (props.popupName == 'State') {
            setSelectedStateData(item);
            props.selectedStateStatus(item);
        }
    }
    const SearchIteminMetadata = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        let searchedArray: any = [];
        setSearchItem(event.target.value);
        let searchedValue: any = event.target.value;
        if (searchedValue?.length > 0) {
            props?.data?.forEach((itemdata: any) => {
                if (itemdata.Newlabel.toLowerCase().includes(searchedValue.toLowerCase())) {
                    if (!isExistsSearchItems(searchedArray, itemdata))
                        searchedArray.push(itemdata);
                }
                if (itemdata.childs?.length > 0) {
                    itemdata.childs.forEach((child: any) => {
                        if (child.Newlabel.toLowerCase().includes(searchedValue.toLowerCase())) {
                            if (!isExistsSearchItems(searchedArray, child))
                                searchedArray.push(child);
                        }
                    });
                }
            });
            setDataCapture(searchedArray);
        }
        else {
            setDataCapture([]);
        }
    }
    const isExistsSearchItems = (arr: any, item: any) => {
        let itemFound = false;
        arr.forEach((data: any) => {
            if (data.Id == item.Id) {
                itemFound = true;
            }
        });
        return itemFound;
    }
    var AutoCompleteItemsArray: any = [];
    AutoCompleteItemsArray = props?.data;
    const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(event.target.value);
        let searchedKey: any = event.target.value;
        let tempArray: any = [];
        if (!isSearchWithDesciptions) {
            if (searchedKey?.length > 0) {
                AutoCompleteItemsArray.map((itemData: any) => {
                    if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
                        tempArray.push(itemData);
                    }
                })
                setSearchedData(tempArray)
            } else {
                setSearchedData([]);
            }
        }
        else {
            if (searchedKey?.length > 0) {
                AutoCompleteItemsArray.map((itemData: any) => {
                    if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase()) || itemData.Title?.toLowerCase().includes(searchedKey.toLowerCase())) {
                        tempArray.push(itemData);
                    }
                })
                setSearchedData(tempArray)
            } else {
                setSearchedData([]);
            }
        }
    };
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    Select {props.popupName}
                </div>
                <Tooltip ComponentId='710' />
            </>
        );
    };
    const CustomFooter = () => {
        return (
            <footer>
                <div className="align-items-center d-flex justify-content-between">
                    <div className="col text-start">
                        <div id="addNewTermDescription">
                            <p className="mb-1">New items are added under the currently selected item.
                                <a target="_blank" data-interception="off" href={`${props?.siteurl}/SitePages/SmartMetadataportfolio.aspx?TabName=${props?.popupName == undefined ? '' : props?.popupName}`} > Add New Item </a>
                            </p>
                        </div>
                        <div id="SendFeedbackTr">
                            <p className="mb-1">Make a request or send feedback to the Term Set manager.
                                <span><a className="hreflink" onClick={() => alert("We are working on it. This feature will be live soon..")}> Send Feedback </a></span>
                            </p>
                        </div>
                    </div>
                    <div className="col text-end">
                        <a target="_blank" data-interception="off" href={`${props?.siteurl}/SitePages/SmartMetadataportfolio.aspx?TabName=${props?.popupName == undefined ? '' : props?.popupName}`}> Manage Smart Taxonomy</a>
                        <button type="button" className="btn btn-primary ms-1 mx-2" onClick={() => props.callBack(updateData)}>
                            Save
                        </button>
                        <button type="button" className="btn btn-default" onClick={() => props.callBack()}>
                            Cancel
                        </button>
                    </div>
                </div>
            </footer>
        )
    };
    return (
        <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
            isOpen={true}
            onRenderFooterContent={CustomFooter}
            type={PanelType.custom}
            customWidth="1280px"
            isBlocking={false}
            isFooterAtBottom={true}
            onDismiss={() => props.callBack()}
        >
            <div>
                <div className="panel-body">
                    <div>
                        <div className="col">
                            <div className="gap-2 justify-content-start valign-middle">
                                <input className="form-check-input rounded-0" defaultChecked={isSearchWithDesciptions} onChange={() => setIsSearchWithDesciptions(isSearchWithDesciptions ? false : true)} type="checkbox" value="" />
                                <label className="small">Include description (info-icons) in search</label>
                            </div>
                        </div>
                        <div className="mb-2 col-sm-3 p-0">
                            <div className="position-relative">
                                <input type="text" className="form-control searchbox_height mt-1" value={value} onChange={onChange} placeholder="Search Category" />
                                <span style={{position:"absolute", top: "3px", right:"10px"}}> <IoSearchOutline size={24} /></span>
                                {searchedData?.length > 0 ? (
                                    <div className="SearchTableCategoryComponent">
                                        <ul className="list-group">
                                            {searchedData.map((item: any) => {
                                                return (
                                                    <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => selectData(item)} >
                                                        <a>{item.Newlabel}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                            </div>
                        </div>
                        <div className="col my-2 d-flex">
                            {props?.popupName == 'Country' && updateData?.SmartCountries?.length > 0 ?
                                <span className="block me-1">
                                    <span>{updateData?.SmartCountries?.[0]?.Title}</span>
                                    <span className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox" onClick={() => setUpdateData({ ...updateData, SmartCountries: [] })}></span>
                                </span>
                                : null}

                            {props?.popupName == 'State' && selectedStateData != undefined ?
                                <span className="block me-1">
                                    <span>{selectedStateData.Title}</span>
                                    <span className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox" onClick={() => setUpdateData({ ...updateData, Fedral_State: '' })}></span>
                                </span>
                                : null}
                        </div>
                        <div className="col-3 list-group my-2">
                            {props?.data?.map((item: any) => {
                                return (
                                    <li className="list-group-item rounded-0" style={{ cursor: 'pointer' }} onClick={() => selectData(item)}>{item.Title}</li>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Panel>
    )
}
export default CountryContactEditPopup;