import { Panel, PanelType } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react'
import Tooltip from '../Tooltip';
import HtmlEditorCard from '../HtmlEditor/HtmlEditor';
import { Web } from 'sp-pnp-js';



const EditPage = () => {
const [openEditPanel , setOpenEditPanel] : any = useState(false);
const [data , setData] : any = useState({Page_x0020_Content : '', FileLeafRef : '' , ItemRank : '', Page_x002d_Title : '' });
const [updateId , setUpdateId] : any = useState(0);






const getData=async ()=>{
  const currentUrl = window.location.href;
  const valueAfterLastSlash = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
  let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
  let taskUsers = [];
  
  let whereClause = `FileLeafRef eq '${'Permission-Management.aspx'}' and IsStatic eq 1`;
  
  try {
    taskUsers = await web.lists
      .getById("16839758-4688-49D5-A45F-CFCED9F80BA6")
      .items.select("ID", "Page_x0020_Content", "FileLeafRef", "Page_x002d_Title", "Title","ItemRank","Author/ID","Author/Title","Editor/Title","Editor/ID", "IsStatic").expand("Editor","Author").filter(whereClause)
      .get();
      setData(...taskUsers);
      setUpdateId(taskUsers[0]?.ID)
  } catch (error) {
    console.error("Error fetching items:", error);
  }
  }


  const postData=async ()=>{
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    
    try {
       await web.lists
        .getById("16839758-4688-49D5-A45F-CFCED9F80BA6")
        .items.getById(updateId).update({
        Page_x0020_Content: data?.Page_x0020_Content,
        FileLeafRef:  data?.FileLeafRef,
        ItemRank:  data?.ItemRank,
        Page_x002d_Title:  data?.Page_x002d_Title,
        // Add other properties as needed
      });
          setOpenEditPanel(false);
          getData();
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    }


  
useEffect(()=>{
    getData();
 },[])



const onRenderCustomCalculateSC = () => {
    return (
         <>
         <div className='subheading siteColor'>Edit Page</div>
         <div><Tooltip ComponentId="1126" /></div>
         </>
    )
  }


  const HtmlEditorStateChange=(event : any)=>{
    setData({...data, Page_x0020_Content : event})
  }



  const onChangeInput=(name : any , value : any)=>{
    if(name === 'FileLeafRef'){
      setData({...data, [name] : value + '.aspx'})
    }else{
      setData({...data, [name] : value})
    }
  }

  return (
    <>
    <a className="hreflink" onClick={()=>setOpenEditPanel(true)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" 
    d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" 
    fill="#333333"></path></svg>
    </a>
      

    <Panel
            onRenderHeader={onRenderCustomCalculateSC}
            type={PanelType.medium}
              isOpen={openEditPanel}
              isBlocking={false}
              onDismiss={()=>setOpenEditPanel(false)}
            >
                   
              <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <label>
                              Name
                        </label>
                        <div>
                            <input type='text'  value={data?.FileLeafRef.replace(/\.[^.]+$/, '')}  onChange={(e:any)=>onChangeInput("FileLeafRef" , e.target.value)}  /> <span>.aspx</span>
                        </div>
                    </div>
                   <div className='col'>
                   <label>
                              Title
                        </label>
                        <div>
                            <input type='text'  value={data?.Page_x002d_Title != undefined && data?.Page_x002d_Title != null ? data?.Page_x002d_Title : ''} onChange={(e:any)=>onChangeInput("Page_x002d_Title" , e.target.value)} /> 
                        </div>
                   </div>
                   <div className='col'>
                   <label>
                              Item Rank
                        </label>
                        <div>
                        <select  value={data?.ItemRank != undefined && data?.ItemRank != null ? data?.ItemRank : ''} onChange={(e:any)=>onChangeInput("ItemRank" , e.target.value)}>
                        <option value="0"></option>
                        <option value="0">(8) Top Highlights</option>
                        <option value="0">(7) Featured Item</option>
                        <option value="0">(6) Key Item</option>
                        <option value="0">(5) Relevant Item</option>
                        <option value="0">(4) Unsure</option>
                        <option value="0">(2) to be verified</option>
                        <option value="0">(1) Archive</option>
                        <option value="0">(0) No Show</option>
                
                 </select>
                        </div>
                   </div>
                </div>
                <HtmlEditorCard editorValue={data?.Page_x0020_Content != undefined && data?.Page_x0020_Content != null ? data?.Page_x0020_Content : ''} HtmlEditorStateChange={HtmlEditorStateChange}/>
              </div>
 
              <div className="mt-2">
                <footer className="mt-4 text-end">
                  <button className="me-2 btn btn-primary" onClick={postData}>Save</button>
                  <button className="me-2 btn btn-default" onClick={()=>setOpenEditPanel(false)} >Cancel</button>
                </footer>
               </div>
            </Panel>
    </>
  )
}

export default EditPage