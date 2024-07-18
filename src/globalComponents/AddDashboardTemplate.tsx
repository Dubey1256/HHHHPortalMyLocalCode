import React, { useContext, useEffect, useState } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import Tooltip from "./Tooltip";
import _ from "lodash";
import CheckboxTree from "react-checkbox-tree";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import { deepCopy } from "./globalCommon";

let portfolioColor = '#2F5596';
let CreatedwebpartArray :any =[];
const AddDashboardTemplate = (props: any) => {
    const [SmartMetadata, setSmartMetadata] = React.useState([]);
    const [expanded, setExpanded] = React.useState([]);
    const [webpartArray, setwebpartArray] = React.useState([]);
    const getChildsBasedOn = (item: any, items: any) => {

        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                if (item.children === undefined)
                    item.children = [];
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.children.push(childItem);
                getChildsBasedOn(childItem, items);
            }
        }
    }
    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];
        let filterGroups: any = [];
        const catogryValue: any = {
            "Title": "Test",
            "checkedObj": [],
            "expanded": [],
            "values": [],
            "ValueLength": 0,
        };
        filterGroups.push(catogryValue);
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            let filterTitle: any = "";
            if (props?.Item?.WebpartTitle === "Status")
                filterTitle = "Percent Complete"
            else filterTitle = props?.Item?.WebpartTitle
            AllSmartDataListData = await web.lists.getById(props?.props?.SmartMetadataListID)
                .items.select("Id", "Title", "IsVisible", "Configurations", "SmartSuggestions", "Color_x0020_Tag", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                .filter("TaxType eq '" + filterTitle + "'").expand('Parent').orderBy('SortOrder', true).orderBy("Title", true).top(1000).get();
            AllSmartDataListData?.forEach((element: any) => {
                element.checked = false;
                if (element.Parent === undefined || element.Parent?.Title === null) {
                    element.value = element.Id;
                    element.label = element.Title;
                    getChildsBasedOn(element, AllSmartDataListData);
                    filterGroups[0].values.push(element);
                }
            })
            let array: any = {};
            array.WebpartTitle = ""
            array.SmartMetaArray =  deepCopy( filterGroups);

            setwebpartArray([array]);
            setSmartMetadata(filterGroups)
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };

    React.useEffect(() => {
        SmartMetaDataListInformations();
    }, [])

    const CustomHeaderConfiguration = () => {
        return (
            <>
                <div className='siteColor subheading'>
                    {props?.EditItem != undefined && props?.EditItem != '' ? <span>Edit Webpart </span> : <span>Add Webpart</span>}
                </div>
                {props?.EditItem != undefined && props?.EditItem != '' ? <Tooltip ComponentId={11975} /> : <Tooltip ComponentId={1107} />}

            </>
        );
    };
    const CloseConfiguationPopup = () => {
        props?.CloseDashboardTemplate(undefined, undefined)
    }
    const handleCheckboxChange = (webpartIndex: number, metaIndex: number, isChecked: boolean) => {
        setwebpartArray(prevState =>
            prevState.map((webpart, index) =>
                index === webpartIndex ? {
                    ...webpart,
                    SmartMetaArray: webpart.SmartMetaArray.map((meta: any, i: any) =>
                        i === metaIndex ? { ...meta, checked: isChecked } : meta
                    )
                } : webpart
            )
        );
    };
    const handlewebpartTitle = (index: number, value: string) => {
        setwebpartArray(prevState =>
            prevState.map((webpart, i) =>
                i === index ? { ...webpart, WebpartTitle: value } : webpart
            )
        );
    };
    const AddMoreItem = () => {
        let webpartArrayNew = [...webpartArray];
        let array: any = {};
        array.WebpartTitle = ""
        array.SmartMetaArray = deepCopy( SmartMetadata);;
        webpartArrayNew = webpartArrayNew.concat([array]);
        setwebpartArray(webpartArrayNew);
    }
    const deletewebpart = (indexwebpart: any) => {
        let webpartArrayNew = [...webpartArray];
        let webpartArrayValue: any = [];
        webpartArrayNew?.forEach((obj: any, index: any) => {
            if (index != indexwebpart)
                webpartArrayValue.push(obj);
        })
        setwebpartArray(webpartArrayValue);
    }
    const formatId = (id: number): string => {
        const paddedId = '00' + id;
        return paddedId.slice(-3);
    }

    const CopyExistingWebpartTemplate = async (WebpartGallary: any, webpart: any) => {
        let CreatedSmartFavId: any = "";
      
      
            try {
                let result: any;
                let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
                // let config = JSON.parse(WebpartGallary)
                const postData = {
                    Configurations: JSON.stringify(WebpartGallary),
                    Key: 'WebPartGallarySmartfavorites',
                    Title: 'WebPartGallarySmartfavorites'
                };
                await web.lists.getByTitle("AdminConfigurations").items.add(postData).then(async (result: any) => {
                    CreatedSmartFavId = result?.data?.Id;
                    await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").orderBy("Created", false).getAll().then(async (data: any) => {
                        let result: any;
                        let ItemNew: any = [];
                        let WebpartDetails: any = {};
                        if (data?.length && data[data.length - 1].Value != undefined && data[data.length - 1].Value != '') {
                            result = parseInt(data[data.length - 1].Value) + 1;
                        }
                        else {
                            result = data?.length + 1;
                        }
                        WebpartDetails.WebpartTitle = webpart?.WebpartTitle;
                        WebpartDetails.IsShowTile = true;

                        WebpartDetails.TileName = ""
                        WebpartDetails.WebpartId = 'WP-' + formatId(result)
                        WebpartDetails.WebpartPosition = { "Column": 1, "Row": 1 },
                            WebpartDetails.smartFevId = CreatedSmartFavId;
                        WebpartDetails.DataSource = "Tasks";
                        WebpartDetails.WebPartGalleryColumnSettingData = {};
                        WebpartDetails.Key = "WebpartTemplate";
                        WebpartDetails.IsDashboardFav =true;
                        CreatedwebpartArray.push(WebpartDetails);
                        //ItemNew.push(WebpartDetails);
                        // await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: webpart?.WebpartTitle, Key: "WebpartTemplate", Configurations: JSON.stringify(WebpartDetails) })
                        //     .then(async (res: any) => {
                        //         web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").top(1).orderBy("Id", false).get().then((data: any) => {
                        //             ItemNew.UpdatedId = data[0].Id;
                                 
                                    if (webpartArray?.length === CreatedwebpartArray.length){
                                        props?.CloseDashboardTemplate(CreatedwebpartArray, undefined)
                                    }
                            //     })
                            // }).catch((err: any) => {
                            //     console.log(err);
                            // })
                    })

                })

            } catch (error) {
                console.log(error);
            }
        
    }

   
    const SaveCompoent = () => {
        let finalArray: any = [];
        let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        webpartArray?.forEach((val: any ) =>  {
            web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebPartGallarySmartfavorites'").top(1).orderBy("Id", true).get().then((data: any) => {
                let Config = JSON.parse(data[0]?.Configurations)
                if (Config?.length > 0) {
                    Config.forEach((obj: any) => {
                        obj.CurrentUserID = props?.props?.Context?._pageContext?._legacyPageContext.userId
                        obj.Title = props?.Item?.WebpartTitle + ' ' + val?.WebpartTitle;
                        obj?.TaskUsersData?.forEach((user: any) => {
                            user.checked = [];
                            user.checkedObj = [];
                        })  
                         obj?.allFilterClintCatogryData?.forEach((client: any) => {
                            client.checked = [];
                            client.checkedObj = [];
                        })
                         obj?.allStites?.forEach((site: any) => {
                            site.checked = [];
                            site.checkedObj = [];
                            site.selectAllChecked =false;
                            site.selectAllChecked =false;
                            if(site?.Title ===props?.Item?.WebpartTitle){
                                site.checkedObj = val?.SmartMetaArray[0].checkedObj;
                                site.checked = val?.SmartMetaArray[0].checked;
                            }
                        })
                        obj?.filterGroupsData?.forEach((filtergroup: any) => {
                            filtergroup.checked = [];
                            filtergroup.checkedObj = [];
                            filtergroup.selectAllChecked =false;
                            if(filtergroup?.Title ===props?.Item?.WebpartTitle){
                                filtergroup.checkedObj = val?.SmartMetaArray[0].checkedObj;
                                filtergroup.checked = val?.SmartMetaArray[0].checked;
                            }
                           
                        })
                    })

                }
               // indexValue++;
                CopyExistingWebpartTemplate(Config, val)
            })
        })
        // webpartArray?.forEach((val: any) => {
        //     let finalObj: any = {};
        //     finalObj.Title = props?.Item?.WebpartTitle + val?.WebpartTitle;
        //     finalObj.SmartFavoriteType = "SmartFilterBased";
        //     finalObj.CurrentUserID = props?.props?.Context?._pageContext?._legacyPageContext.userId
        //     finalObj.isShowEveryone = true,

        //         finalObj.filterGroupsData = [];
        //     let ItemObj: any = {};
        //     ItemObj.Title = props?.Item?.WebpartTitle;

        //     ItemObj.Values = val;
        //     finalObj.checkedObj = [];
        //     finalObj.checked = [];
        //     finalObj.selectAllChecked = false;
        //     finalObj.checkedObj = val?.SmartMetaArray[0].checkedObj;
        //     finalObj.checked = val?.SmartMetaArray[0].checked;
        //     finalObj.selectAllChecked = true;
        //     finalObj.filterGroupsData = val?.SmartMetaArray[0].values;

        //     finalObj.label = props?.Item?.WebpartTitle;
        //     finalObj.value = val?.Id;
        //     finalArray.push(finalObj);
        //     // CopyExistingWebpartTemplate(finalArray, val)
        // })
        console.log(finalArray);
    }
    const GetCheckedObject = (arr: any, checked: any) => {
        let checkObj: any = [];
        checked?.forEach((value: any) => {
            arr?.forEach((element: any) => {
                if (value == element.Id) {
                    checkObj.push({
                        Id: element.ItemType === "User" ? element?.AssingedToUser?.Id : element.Id,
                        Title: element.Title,
                        TaxType: element.TaxType ? element.TaxType : ''
                    })
                }
                if (element.children != undefined && element.children.length > 0) {
                    element.children.forEach((chElement: any) => {
                        if (value == chElement.Id) {
                            checkObj.push({
                                Id: chElement.ItemType === "User" ? chElement?.AssingedToUser?.Id : chElement.Id,
                                Title: chElement.Title,
                                TaxType: element.TaxType ? element.TaxType : ''
                            })
                        }
                    });
                }
            });
        });
        return checkObj;
    }
    const handleSelectAll = (index: any, selectAllChecked: any, event: any) => {
        if (event == "filterSites") {
            let filterGroups = [...SmartMetadata];
            filterGroups[index].selectAllChecked = selectAllChecked;
            let selectedId: any = [];
            filterGroups[index].values.forEach((item: any) => {
                item.checked = selectAllChecked;
                if (selectAllChecked) {
                    selectedId.push(item?.Id)
                }
                item?.children?.forEach((chElement: any) => {
                    if (selectAllChecked) {
                        selectedId.push(chElement?.Id)
                    }
                });
            });
            filterGroups[index].checked = selectedId;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, selectedId);
            setSmartMetadata((prev: any) => filterGroups);



        }
    }

    const onCheck = async (parentIndex: any, index: any, checked: any) => {

        let filterGroups = [...webpartArray];
        filterGroups[parentIndex].SmartMetaArray[index].checked = checked;
        filterGroups[parentIndex].SmartMetaArray[index].checkedObj = GetCheckedObject(filterGroups[parentIndex].SmartMetaArray[index].values, checked)
        setwebpartArray(filterGroups);

    }

    const checkIcons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="0.5" y="0.5" width="15" height="15" fill="${portfolioColor}" stroke="${portfolioColor}"/>
    <path d="M5 8L7 10L11 6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
    const checkBoxIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="0.5" y="0.5" width="15" height="15" fill="white" stroke="#CCCCCC"/>
    </svg>
  `;
    const halfCheckBoxIcons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="0.5" y="0.5" width="15" height="15" fill="${portfolioColor}" stroke="${portfolioColor}"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8.25V8.25C4 8.94036 4.55964 9.5 5.25 9.5H8.375H11.5C12.1904 9.5 12.75 8.94036 12.75 8.25V8.25V8.25C12.75 7.55964 12.1904 7 11.5 7H8.375H5.25C4.55964 7 4 7.55964 4 8.25V8.25Z" fill="white"/>
    </svg>
    `;
    return (
        <>
            <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsDashboardTemplate}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                customWidth="1300px"
                type={PanelType.custom}>
                <div className='border container modal-body p-1 mb-1'>
                    <label className='form-label full-width mb-2'>WebPart Title</label>
                    {webpartArray?.map((webpart: any, index) => {
                        return (
                            <div className="row justify-content-between mb-2" key={index}>
                                <div className="col-3 ">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="me-1">{props?.Item?.WebpartTitle} - </div>
                                        <div className="col"><input className='form-control' type='text' placeholder="Dashboard Title" value={webpart?.WebpartTitle} onChange={(e) => handlewebpartTitle(index, e.target.value)} /></div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="alignCheckbox d-flex">
                                        <div className="col-sm-12 pad0">
                                            <div className="togglecontent">
                                                <table width="100%" className="indicator_search">
                                                    <tr className=''>
                                                        <td valign="top" className='parentFilterSec w-100'>
                                                            {webpart?.SmartMetaArray != null && webpart?.SmartMetaArray.length > 0 &&
                                                                webpart?.SmartMetaArray?.map((Group: any, Itemindex: any) => {
                                                                    return (
                                                                        <div className='filterContentSec'>
                                                                            <div className="fw-semibold fw-medium mx-1 text-dark">{props?.Item?.WebpartTitle}</div>
                                                                            <fieldset className='pe-3 smartFilterStyle'>
                                                                                <div className="custom-checkbox-tree">
                                                                                    <CheckboxTree
                                                                                        nodes={Group.values}
                                                                                        checked={Group.checked}
                                                                                        expanded={expanded}
                                                                                        onCheck={checked => onCheck(index, Itemindex, checked)}
                                                                                        onExpand={expanded => setExpanded(expanded)}
                                                                                        nativeCheckboxes={false}
                                                                                        showNodeIcon={false}
                                                                                        checkModel={'all'}
                                                                                        icons={{
                                                                                            check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkIcons }} />),
                                                                                            uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkBoxIcon }} />),
                                                                                            halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: halfCheckBoxIcons }} />),
                                                                                            expandOpen: <SlArrowDown />,
                                                                                            expandClose: <SlArrowRight />,
                                                                                            parentClose: null,
                                                                                            parentOpen: null,
                                                                                            leaf: null,
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                        {/* {webpart?.SmartMetaArray?.map((obj: any, indexnew: any) => {
                                            return (
                                                <div className="form-check" key={indexnew}>
                                                    <input className="form-check-input rounded-0" name="Phone" type="checkbox" checked={obj?.checked} value={obj?.Title} onChange={(e) => handleCheckboxChange(index, indexnew, e.currentTarget.checked)} />
                                                    <label className="form-check-label">{obj?.Title}</label>
                                                </div>
                                            )
                                        }
                                        )} */}
                                    </div>

                                </div>
                                {(webpartArray?.length - 1 === index) && <div className="col ps-0"><div className="alignCenter justify-content-end gap-1 col" onClick={AddMoreItem}> <span className="svg__iconbox svg__icon--Plus mini"></span> Add more</div></div>}
                                {(webpartArray?.length - 1 != index) && <div className="col ps-0"><div className="alignCenter justify-content-end gap-1 col"><span title="Delete" className="dark ml-12  svg__icon--cross svg__iconbox" onClick={(e) => deletewebpart(index)} ></span></div></div>}
                            </div>)
                    })}
                </div>
                <div className='modal-footer mt-2 pe-0'>
                    <button className="btn btn-primary ms-1" onClick={SaveCompoent}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel >

        </>
    )
}
export default AddDashboardTemplate;
