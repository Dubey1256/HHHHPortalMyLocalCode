import React from 'react';
import EditPage from '../../../globalComponents/EditPanelPage/EditPage'
import { Web } from 'sp-pnp-js';
import { useState, useEffect, useMemo } from 'react';


const GmbhHomePage = (props: any): any => {
    const [headerChange, setHeaderChange] = useState("")
    const [description, setDescription]: any = useState("");

    useEffect(() => {
        loadSitePages();
    }, [])

    const loadSitePages = async () => {
    let web = new Web(props?.props?.siteUrl);
    const currentUrl = window.location.href;
    var match = currentUrl.match(/\/([^/]+\.aspx)(\?.*)?$/);
    let checkValueAfterLastSlash = match ? match[1] : null;
    let valueAfterLastSlash = checkValueAfterLastSlash;
    try {
      await web.lists
        .getById(props?.props?.SitePagesList)
        .items.select("ID", "Page_x0020_Content", "FileLeafRef", "Page_x002d_Title", "Title", "ItemRank", "Author/ID", "Author/Title", "Editor/Title", "Editor/ID", 'Created', 'Modified', "IsStatic").expand("Editor", "Author")
        .getAll().then((taskUsers2: any) => {
          const foundObject = taskUsers2.filter((obj: any) => obj.FileLeafRef.toUpperCase().includes(valueAfterLastSlash.toUpperCase()));
          let taskUsers: any = foundObject;
          taskUsers[0].ItemRank2 = taskUsers[0].ItemRank == 8 ? '(8) Top Highlights' : (taskUsers[0].ItemRank == 7 ? '(7) Featured Item' : (taskUsers[0].ItemRank == 6 ? '(6) Key Item' :
          (taskUsers[0].ItemRank == 5 ? '(5) Relevant Item' : (taskUsers[0].ItemRank == 4 ? '(4) Unsure' : (taskUsers[0].ItemRank == 2 ? '(2) to be verified' : (taskUsers[0].ItemRank == 1 ? '(1) Archive'
          : (taskUsers[0].ItemRank == 0 ? '(0) No Show' : null)))))))
        setDescription(taskUsers[0].Page_x0020_Content)    

        }).catch((err: any) => {
          console.log(err);
        });

    } catch (error) {
      console.log("Error fetching items:", error);
    }
}


const changeHeader=(items: string)=>{
    setHeaderChange(items)
}
    

    let context = props.props.context
    context.siteUrl = context.pageContext.web.absoluteUrl;
    context.SitePagesList = props.props.SitePagesList;

    return (
        <>
            <h2 className='heading mb-3'>{headerChange != undefined && headerChange != null && headerChange != '' ? headerChange : 'Welcome To Smart Administration'}
            <EditPage context={context} changeHeader={changeHeader} GmbhHomePageDesc={description}/>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: description }} />
        </>
    )
}
export default GmbhHomePage;
