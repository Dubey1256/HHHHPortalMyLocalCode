import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
let Categories: any = [];
let allListId: any = {};
let FilterCategories: any = []
let backupAllCategories: any = []
const ContactSmartFilter = (props: any) => {
    const baseUrl = props?.props?.Context?.pageContext?._web?.absoluteUrl;
    const [AllCategories, setAllCategories] = useState([]);
    const [isContentVisible, setIsContentVisible] = useState(true);


    let webs = new Web(baseUrl);
    React?.useEffect(() => {
        allListId = {
            TeamContactSearchlistIds: props?.props?.TeamContactSearchlistIds,
            TeamSmartMetadatalistIds: props?.props?.TeamSmartMetadatalistIds,
            Context: props?.props?.Context,
            baseUrl: baseUrl
        }
        loadSmartTaxonomyItems()
    }, [])

    const getStructuredItems = (items: any) => {
        let structuredItems: any = [];
        items?.forEach((item: any) => {
            if (item?.ParentId === undefined || item?.ParentId == null) {
                const newItem = { ...item, childs: [] };
                structuredItems?.push(newItem);
                getChilds(newItem, items);
            }
        });
        return structuredItems;
    }

    const getChilds = (parentItem: any, items: any) => {
        items?.forEach((childItem: any) => {
            if (childItem?.ParentId && childItem?.ParentId !== undefined && childItem?.ParentId !== null && childItem?.ParentId === parentItem?.Id) {
                const newChildItem = { ...childItem, childs: [] };
                parentItem?.childs?.push(newChildItem);
                getChilds(newChildItem, items);
            }
        });
    }
    const loadSmartTaxonomyItems = async () => {
        //allListId?.TeamSmartMetadatalistIds
        try {
            const data = await webs?.lists?.getById(allListId?.TeamSmartMetadatalistIds)?.items?.select('Id, Title, TaxType, ParentID, Parent/Id, Parent/Title')?.expand('Parent')?.getAll();
            data?.map((taxItem) => {
                let item: any = {};
                item["value"] = taxItem?.Title;
                item["label"] = taxItem?.Title;
                taxItem.Selected = false
                taxItem.expanded = false;
                if (taxItem?.TaxType == 'Contact Categories') {
                    Categories?.push(taxItem)
                }
            })
            let structureArray = getStructuredItems(Categories);
            setAllCategories(structureArray)
        } catch (error) {
            console?.error('Error loading smart taxonomy items:', error);
            alert('Error: ' + error?.message);
        }
    };
    const toggleContentVisibility = () => {
        setIsContentVisible(prevState => !prevState);
    };

    const loadMoreFilters = (child: { expanded: boolean; }) => {
        child.expanded = !child.expanded; // Toggle the expanded state
        setAllCategories([...AllCategories]); // Assuming you are using state to manage AllCategories
    };


    const getMoreFilterTask = (child: any, isChecked: any) => {
        child.Selected = isChecked;
        const updatedAllCategories = [...AllCategories];
        const filteredData = props?.allContactData?.filter((item: any) =>
            item?.SmartCategories?.some((cat: any) => cat.Title === child.Title)
        );
        if (isChecked) {
            FilterCategories.push(...filteredData);
        } else {
            FilterCategories = FilterCategories.filter((item: any) =>
                !item?.SmartCategories?.some((cat: any) => cat.Title === child.Title)
            );
        }
        setAllCategories(updatedAllCategories);
    };
        const ClearFilters = () => {
        AllCategories.map((item: any) => {
            item.Selected = false
            if (item?.childs != undefined && item?.childs != null && item?.childs?.length > 0) {
                item?.childs.map((child: any) => {
                    child.Selected = false
                    if (child?.childs != undefined && child?.childs != null && child?.childs.length > 0) {
                        child?.childs.map((subchild: any) => {
                            subchild.Selected = false
                        })
                    }
                })
            }
        })
        backupAllCategories = [...AllCategories];
        setAllCategories(backupAllCategories)
        FilterCategories = []
        props.FilterCallback(props?.backupallContact)
    };

    const FilterProjects = () => {
        props.FilterCallback(FilterCategories)
    };

    return (
        <>
            <div className="g-smartFilters">
                <div className='bdrbox bg-f5f5 togglebox clearfix filter-container mb-3'>
                    <div className="panel-group" id="accordion">
                        <div className="p-0 togglebox">
                            <label className="gap-1 d-flex justify-content-start valign-middle">
                                {isContentVisible === true && <a className="filter-icon cursor-pointer" onClick={toggleContentVisibility}><SlArrowDown></SlArrowDown>
                                </a>}
                                {isContentVisible === false && <a className="filter-icon cursor-pointer" onClick={toggleContentVisibility}><SlArrowRight></SlArrowRight>
                                </a>}
                                <span className="f-15 fw-semibold">SmartSearch-Filters</span>
                            </label>
                            <div id="collapseOne" className={isContentVisible ? "panel-collapse collapse show " : "panel-collapse collapse"}>
                                <div className="toggle-content mt-2" style={{ display: isContentVisible ? 'block' : 'none' }}>
                                    <div className="col-sm-12 mb-10">
                                        <table width="100%">
                                            <tbody>
                                                <tr>
                                                    {AllCategories?.map((category: any) => {
                                                        return (
                                                            <td valign="top" style={{ width: '20%' }} className="pe-2">
                                                                {(category?.ParentId === undefined || category?.ParentId === null) && category?.childs?.length > 0 && (
                                                                    <>
                                                                        <legend className="siteBdrBottom">{category?.Title}</legend>
                                                                        <div className='filtercolumn' style={{ display: 'flex', flexDirection: 'column' }}>
                                                                           <ul className='list-none'>
                                                                            {category?.childs?.map((child: any) => {
                                                                                return (
                                                                                    <li className='filterbox' key={child?.Id}>
                                                                                        <span className="expand-icon" style={{ cursor: 'pointer' }}>
                                                                                        {child?.childs?.length > 0 && (
                                                                                            <span  onClick={() => loadMoreFilters(child)}>
                                                                                                {child.expanded ?
                                                                                                    <span><SlArrowDown></SlArrowDown></span> :
                                                                                                    <span><SlArrowRight></SlArrowRight></span>
                                                                                                }
                                                                                            </span>
                                                                                        )}
                                                                                        &nbsp;
                                                                                        </span>
                                                                                        <input type="checkbox" className="form-check-input cursor-pointer" checked={child?.Selected} onChange={(e) => getMoreFilterTask(child, e.target.checked)} /> {child?.Title}
                                                                                        {child?.childs?.length > 0 && child?.expanded && (
                                                                                            <div className="sub-filter">
                                                                                                {child?.childs?.map((child2: any) => {
                                                                                                    return (
                                                                                                        <div key={child2?.Id}>
                                                                                                            <input type="checkbox" className="form-check-input cursor-pointer" checked={child2?.Selected} onChange={(e) => getMoreFilterTask(child2, e.target.checked)} />
                                                                                                            <span className="filter-input">{child2?.Title}</span>
                                                                                                        </div>
                                                                                                    )
                                                                                                })}
                                                                                            </div>
                                                                                        )}
                                                                                    </li>
                                                                                )
                                                                            })}
                                                                            </ul>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>


                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row my-2">
                                        <div className="text-end">
                                            <button type="button" className="btn btn-default" onClick={ClearFilters} title="Clear Filters">Clear Filters</button>
                                            <button type="button" className="btnCol btn btn-primary  ms-2" title="Update" onClick={FilterProjects}>Update Filters</button>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div ></>
    );
}

export default ContactSmartFilter;