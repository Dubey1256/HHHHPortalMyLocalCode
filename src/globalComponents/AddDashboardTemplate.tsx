import React, { useContext, useEffect, useState } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import Tooltip from "./Tooltip";
import _ from "lodash";


const AddDashboardTemplate = (props: any) => {
    const [SmartMetadata, setSmartMetadata] = React.useState([]);

    const [webpartArray, setwebpartArray] = React.useState([]);

    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            AllSmartDataListData = await web.lists.getById(props?.props?.SmartMetadataListID)
                .items.select("Id", "Title", "IsVisible", "Configurations", "SmartSuggestions", "Color_x0020_Tag", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                .filter("TaxType eq '" + props?.Item?.WebpartTitle + "'").expand('Parent').orderBy('SortOrder', true).orderBy("Title", true).top(1000).get();
            AllSmartDataListData?.forEach((obj: any) => {
                obj.checked = false;
            })
            let array: any = {};
            array.WebpartTitle = ""
            array.SmartMetaArray = AllSmartDataListData;

            setwebpartArray([array]);
            setSmartMetadata(AllSmartDataListData)
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
        props?.CloseDashboardTemplate(false, undefined)
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
        array.SmartMetaArray = SmartMetadata;
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
    const CopyExistingWebpartTemplate = async (WebpartGallary: any ,webpart:any) => {
        let CreatedSmartFavId: any = "";
        let IndexValue:any =0;
        let confirmation = confirm('Do you want to copy this item?')
        if (confirmation) {
            try {
                let result: any;
                let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
                let config = JSON.parse(WebpartGallary)
                const postData = {
                    Configurations: JSON.stringify(config),
                    Key: 'WebPartGallarySmartfavorites',
                    Title: 'WebPartGallarySmartfavorites'
                };
                await web.lists.getByTitle("AdminConfigurations").items.add(postData).then(async (result: any) => {
                    CreatedSmartFavId = result?.data?.Id;
                    await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").orderBy("Created", false).getAll().then(async (data: any) => {
                        let result: any;
                        let ItemNew:any =[];
                        let WebpartDetails:any;
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
                        WebpartDetails.WebpartPosition= {"Column": 1,"Row": 1},
                        WebpartDetails.smartFevId = CreatedSmartFavId;
                        WebpartDetails.DataSource = "Tasks";
                        WebpartDetails.WebPartGalleryColumnSettingData= {};
                        WebpartDetails.Key= "WebpartTemplate";
                        ItemNew.push(WebpartDetails);
                        await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: webpart?.WebpartTitle, Key: "WebpartTemplate", Configurations: JSON.stringify(ItemNew) })
                            .then(async (res: any) => {
                                web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").top(1).orderBy("Id", false).get().then((data: any) => {
                                    ItemNew.UpdatedId = data[0].Id;
                                    IndexValue++;
                                   if(webpartArray?.length ===IndexValue)
                                    props?.CloseDashboardTemplate(true, undefined)
                                })
                            }).catch((err: any) => {
                                console.log(err);
                            })
                    })

                })

            } catch (error) {
                console.log(error);
            }
        }
    }


    const SaveCompoent = () => {
        let finalArray: any = [];
        webpartArray?.forEach((val: any) => {
            let finalObj: any = {};
            finalObj.Title = props?.Item?.WebpartTitle + val?.WebpartTitle;
            finalObj.SmartFavoriteType = "SmartFilterBased";
            finalObj.CurrentUserID = props?.props?.Context?._pageContext?._legacyPageContext.userId
            finalObj.isShowEveryone = true,

                finalObj.filterGroupsData = [];
            let ItemObj: any = {};
            ItemObj.Title = props?.Item?.WebpartTitle;

            ItemObj.Values = val;
            finalObj.checkedObj = [];
            finalObj.checked = [];
            finalObj.selectAllChecked = false;
            let result = val?.SmartMetaArray.filter((fill: any) => fill?.checked === true);
            let filterData: any = {};
            result?.forEach((filterItem: any) => {
                finalObj.checked.push(filterItem?.Id);
                filterData.Id = filterItem.Id;
                filterData.Title = filterItem.Title;
                filterData.TaxType = filterItem.TaxType;
                finalObj.checkedObj.push(filterData);

            })
            if (SmartMetadata?.length == result?.length)
                finalObj.selectAllChecked = true;
            // finalObj.checkedObj = filterData;
            finalObj.filterGroupsData = result;
            finalObj.children = [];
            finalObj.label = props?.Item?.WebpartTitle;
            finalObj.value = val?.Id;
            finalArray.push(finalObj);
            CopyExistingWebpartTemplate(finalArray, val)
        })
        console.log(finalArray);
    }

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
                            <div className="row justify-content-between align-items-center mb-2" key={index}>
                                <div className="col-3 ">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="me-1">{props?.Item?.WebpartTitle} - </div>
                                        <div className="col"><input className='form-control' type='text' placeholder="Dashboard Title" value={webpart?.WebpartTitle} onChange={(e) => handlewebpartTitle(index, e.target.value)} /></div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="alignCheckbox d-flex">
                                        {webpart?.SmartMetaArray?.map((obj: any, indexnew: any) => {
                                            return (
                                                <div className="form-check" key={indexnew}>
                                                    <input className="form-check-input rounded-0" name="Phone" type="checkbox" checked={obj?.checked} value={obj?.Title} onChange={(e) => handleCheckboxChange(index, indexnew, e.currentTarget.checked)} />
                                                    <label className="form-check-label">{obj?.Title}</label>
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>

                                </div>
                                {(webpartArray?.length - 1 === index) && <div className="col p-0" onClick={AddMoreItem}> <span className="svg__iconbox svg__icon--Plus mini"></span> Add more</div>}
                                {(webpartArray?.length - 1 != index) && <div className="col p-0" onClick={AddMoreItem}><span title="Delete" className="dark ml-12  svg__icon--cross svg__iconbox" onClick={(e) => deletewebpart(index)} ></span></div>}
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