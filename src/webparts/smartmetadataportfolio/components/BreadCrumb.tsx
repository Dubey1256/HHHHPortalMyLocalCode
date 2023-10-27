import React, { useEffect, useState } from 'react';
import { Web } from 'sp-pnp-js';
var allTopNavigationItems: any = [];
export default function BraedCrum(props: any) {
    const [breadcrum, setBreadcrum]: any = useState([]);
    const loadTopNavigation = async () => {
        try {
            let web = new Web(props?.AllList?.SPSitesListUrl);
            allTopNavigationItems = await web.lists.getById(props.AllList.SPTopNavigationListID).items.getAll();
            showingBreadcrumb();
            console.log(breadcrum)
        } catch (error: any) {
            console.error(error);
        }
    };
    const showingBreadcrumb = () => {
        const findBreadcrumb = (itemId: any) => {
            const item = allTopNavigationItems.find((top: any) => top.Id === itemId);
            if (item) {
                breadcrumb.unshift(item);
                if (item.ParentID) {
                    findBreadcrumb(item.ParentID);
                }
            }
        };
        const breadcrumb: any = [];
        const manageSmartmetadataItem = allTopNavigationItems.find(
            (top: any) => top.Title === "Manage Smartmetadata"
        );
        if (manageSmartmetadataItem) {
            findBreadcrumb(manageSmartmetadataItem.Id);
        }
        setBreadcrum(breadcrumb);
    };

    useEffect(() => {
        loadTopNavigation();
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-sm-12 p-0 ">
                    <ul className="spfxbreadcrumb m-0 p-0">
                        {
                            breadcrum?.map((item: any) => {
                                return (<>
                                    <li>
                                        <a target="_blank" data-interception="off" title={item?.Title} href={item?.href?.Url}>{item?.Title}</a>
                                    </li>
                                </>)
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}