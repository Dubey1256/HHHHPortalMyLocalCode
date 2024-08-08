import { Panel, PanelType } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react'
 import Tooltip from '../Tooltip';
 import HtmlEditorCard from '../HtmlEditor/HtmlEditor';
import { Web } from 'sp-pnp-js';
import moment from 'moment';



const EditPage = (props: any) => {
  const [openEditPanel, setOpenEditPanel]: any = useState(false);
  const [data, setData]: any = useState({ Page_x0020_Content: '', FileLeafRef: '', ItemRank: '', Page_x002d_Title: '', ItemRank2: '' });
  const [updateId, setUpdateId]: any = useState(0);






  const getData = async () => {
    var checkValueAfterLastSlash: any;
    let web = new Web(props?.context?.siteUrl);

    const currentUrl = window.location.href;
    // Use a regular expression to extract the substring until ".aspx"
    var match = currentUrl.match(/\/([^/]+\.aspx)(\?.*)?$/);
    // Check if there's a match and extract the substring
    checkValueAfterLastSlash = match ? match[1] : null;
    let valueAfterLastSlash = props?.Title != undefined ? props?.Title : checkValueAfterLastSlash;

    // let whereClause = `FileLeafRef eq '${valueAfterLastSlash}'`;

    try {
      await web.lists
        .getById(props?.context?.SitePagesList)
        .items.select("ID", "Page_x0020_Content", "FileLeafRef", "Page_x002d_Title", "Title", "ItemRank", "Author/ID", "Author/Title", "Editor/Title", "Editor/ID", 'Created', 'Modified', "IsStatic").expand("Editor", "Author")
        .getAll().then((taskUsers2) => {
          // const matchingObjects = arrayOfObjects.filter(obj => obj.title.includes(searchString));
          const foundObject = taskUsers2.filter((obj: any) => obj.FileLeafRef.toUpperCase().includes(valueAfterLastSlash.toUpperCase()));
          let taskUsers: any = foundObject;

          taskUsers[0].ItemRank2 = taskUsers[0].ItemRank == 8 ? '(8) Top Highlights' : (taskUsers[0].ItemRank == 7 ? '(7) Featured Item' : (taskUsers[0].ItemRank == 6 ? '(6) Key Item' :
            (taskUsers[0].ItemRank == 5 ? '(5) Relevant Item' : (taskUsers[0].ItemRank == 4 ? '(4) Unsure' : (taskUsers[0].ItemRank == 2 ? '(2) to be verified' : (taskUsers[0].ItemRank == 1 ? '(1) Archive'
              : (taskUsers[0].ItemRank == 0 ? '(0) No Show' : null))))))),
            setData(...taskUsers);
          props.changeHeader(taskUsers[0]?.Page_x002d_Title)
          props?.changeDescription(taskUsers[0]?.Page_x0020_Content)
          setUpdateId(taskUsers[0]?.ID)

        }).catch((err: any) => {
          console.log(err);
        });

    } catch (error) {
      console.log("Error fetching items:", error);
    }

  }


  const postData = async () => {
    let web = new Web(props?.context?.siteUrl);

    try {
      await web.lists
        .getById(props?.context?.SitePagesList)
        .items.getById(updateId).update({
          Page_x0020_Content: data?.Page_x0020_Content,
          FileLeafRef: data?.FileLeafRef,
          ItemRank: data?.ItemRank2 == '(8) Top Highlights' ? 8 : (data?.ItemRank2 == '(7) Featured Item' ? 7 : (data?.ItemRank2 == '(6) Key Item' ? 6 :
            (data?.ItemRank2 == '(5) Relevant Item' ? 5 : (data?.ItemRank2 == '(4) Unsure' ? 4 : (data?.ItemRank2 == '(2) to be verified' ? 2 : (data?.ItemRank2 == '(1) Archive' ? 1
              : (data?.ItemRank2 == '(0) No Show' ? 0 : null))))))),
          Page_x002d_Title: data?.Page_x002d_Title,
          // Add other properties as needed
        });
      setOpenEditPanel(false);
      if (props?.Title != undefined) {
        props?.updatedWebpages();
      }
      getData()
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }


  const onRenderCustomCalculateSC = () => {
    return (
      <>
        <div className='subheading siteColor'>Edit Page</div>
        <div><Tooltip ComponentId={props?.tooltipId} /></div>
      </>
    )
  }


  const HtmlEditorStateChange = (event: any) => {
    setData({ ...data, Page_x0020_Content: event })
  }



  const onChangeInput = (name: any, value: any) => {
    if (name === 'FileLeafRef') {
      setData({ ...data, [name]: value + '.aspx' })
    } else {
      setData({ ...data, [name]: value })
    }
  }
  const openEditPopup = () => {
    getData()
    setOpenEditPanel(true);
  }

  return (
    <>
      <span onClick={() => openEditPopup()} title="Edit" className="alignIcon ms-1 svg__icon--edit svg__iconbox"></span>
      <Panel
        onRenderHeader={onRenderCustomCalculateSC}
        type={PanelType.medium}
        isOpen={openEditPanel}
        isBlocking={false}
        onDismiss={() => setOpenEditPanel(false)}
      >

        <div className=''>
          <div className='row mb-3'>
            <div className='col input-group'>
              <label className='form-label full-width'>
                Name
              </label>
              <div className='alignCenter input-group'>
                <input type='text' className='form-control' value={data?.FileLeafRef != undefined && data?.FileLeafRef != null ? data?.FileLeafRef.replace(/\.[^.]+$/, '') : ''} onChange={(e: any) => onChangeInput("FileLeafRef", e.target.value)} /> <span className='ms-1'>.aspx</span>
              </div>
            </div>
            <div className='col input-group'>
              <label className='form-label full-width'>
                Title
              </label>
              <input type='text' className='form-control' value={data?.Page_x002d_Title != undefined && data?.Page_x002d_Title != null ? data?.Page_x002d_Title : data?.Title != null && data?.Title != undefined ? data?.Title: ''} onChange={(e: any) => onChangeInput("Page_x002d_Title", e.target.value)} />

            </div>
            <div className='col input-group'>
              <label className='form-label full-width'>
                Item Rank
              </label>
              <select className='form-control' value={data?.ItemRank2 != undefined && data?.ItemRank2 != null ? data?.ItemRank2 : ''} onChange={(e: any) => onChangeInput("ItemRank2", e.target.value)}>
                <option value=""></option>
                <option value="(8) Top Highlights">(8) Top Highlights</option>
                <option value="(7) Featured Item">(7) Featured Item</option>
                <option value="(6) Key Item">(6) Key Item</option>
                <option value="(5) Relevant Item">(5) Relevant Item</option>
                <option value="(4) Unsure">(4) Unsure</option>
                <option value="(2) to be verified">(2) to be verified</option>
                <option value="(1) Archive">(1) Archive</option>
                <option value="(0) No Show">(0) No Show</option>
              </select>
            </div>
          </div>
          <HtmlEditorCard editorValue={data?.Page_x0020_Content ? data?.Page_x0020_Content : props?.GmbhHomePageDesc ? props?.GmbhHomePageDesc : ""} HtmlEditorStateChange={HtmlEditorStateChange}/>
        </div>

        <footer className="mt-4">



          <div className="align-items-center d-flex justify-content-between py-2">
            <div>
              <div className="text-left">
                Created
                <> {data?.Created != null && data?.Created != undefined ? moment(data?.Created).format('DD/MM/YYYY') : ''} </> by
                <span className="siteColor ms-1">
                  {data?.Author?.Title}
                </span>
              </div>
              <div className="text-left">
                Last modified
                <span>{data?.Modified != null && data?.Modified != undefined ? moment(data?.Modified).format('DD/MM/YYYY') : ''}</span> by
                <span className="siteColor ms-1">
                  {data?.Editor?.Title}
                </span>
              </div>
            </div>
            <div className="text-end">
              <a
                data-interception="off"
                target="_blank"
                href={`${props?.context?.siteUrl}/SitePages/Forms/EditForm.aspx?ID=${data?.Id}`}
              >
                Open out-of-the-box form
              </a>
              <button className="mx-2 btn btn-primary" onClick={postData}>Save</button>
              <button className="btn btn-default" onClick={() => setOpenEditPanel(false)} >Cancel</button>
            </div>
          </div>
        </footer>
      </Panel>
    </>
  )
}

export default EditPage
