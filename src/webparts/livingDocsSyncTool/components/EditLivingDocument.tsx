import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import moment from 'moment';
import { Web } from 'sp-pnp-js';
import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'

import ImageInformation from '../../EditPopupFiles/ImageInformation';
import Picker from '../../../globalComponents/EditTaskPopup/SmartMetaDataPicker';

var AllListId: any;
var taggingtype: any = '';
var tempShareWebTypeData: any = [];
var EditDataBackup: any;
var tempCategoryData: any = "";
const EditLivingDocumentpanel = (props: any) => {
  const [EditdocumentsData, setEditdocumentsData]: any = React.useState();
  const [isOpenImageTab, setisOpenImageTab] = React.useState(false);
  const [allContactData, setallContactData] = React.useState([]);
  const [searchedNameData, setSearchedDataName] = React.useState([])
  const [listIsVisible, setListIsVisible] = React.useState(false);
  const [ShareWebTypeTopicData, setShareWebTypeTopicData] = React.useState([]);
  const [TopicSearchKey, setTopicSearchKey] = React.useState("");
  const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
  const [SearchedTopicData, setSearchedTopicData] = React.useState([]);
  const [ShareWebTypePagesData, setShareWebTypePagesData] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState({
    Title: '',
    FirstName: '',
  });
  // const [selectedTasks, setselectedTasks] = React.useState([]);
  let Status: any = ["selectStatus", "Draft", "Final", "Archived"]
  let ItemRank = [
    { rankTitle: 'Select Item Rank', rank: null },
    { rankTitle: '(8) Top Highlights', rank: 8 },
    { rankTitle: '(7) Featured Item', rank: 7 },
    { rankTitle: '(6) Key Item', rank: 6 },
    { rankTitle: '(5) Relevant Item', rank: 5 },
    { rankTitle: '(4) Background Item', rank: 4 },
    { rankTitle: '(2) to be verified', rank: 2 },
    { rankTitle: '(1) Archive', rank: 1 },
    { rankTitle: '(0) No Show', rank: 0 }
  ]

  React.useEffect(() => {
    AllListId = props.AllListId
    AllListId.Context = props.AllListId?.context
    if (props?.editData != undefined) {
      getAllContact()
      loadSelectedDocuments()
    }
  }, [props?.editData != undefined])


  const getAllContact = async () => {
    let web = new Web(props?.AllListId?.siteUrl);
    try {
      let data = await web.lists.getById("45d6a95e-22ad-45d4-b1eb-b0abea83575d").items.select("WorkCity,Id,SmartActivitiesId,SmartCategories/Id,SmartCategories/Title,WorkCountry,ItemType,Email,FullName,ItemCover,Attachments,Categories,Company,JobTitle,FirstName,Title,Suffix,WebPage,IM,WorkPhone,CellPhone,HomePhone,WorkZip,Office,Comments,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title").expand("Author,Editor,SmartCategories").orderBy("Created desc").getAll();
      data.map((item: any) => {
        item.Selected = false
        item.LastName = item.Title
        item.Title = item.FirstName + ' ' + item.LastName
      })
      setallContactData(data)
    } catch (error: any) {
      console.error(error);
    };
  };
  const loadSelectedDocuments = async () => {
    const web = new Web(props?.AllListId?.siteUrl);
    try {
      await web.lists.getById(props?.AllListId?.SharewebDocument)
        .items.getById(props?.editData?.Id)
        .select('Id', 'Title', 'PriorityRank', "Responsible/Id", "SmartTopics/Id", "SmartTopics/Title", "Responsible/Title", "Responsible/FullName", 'Year', 'Status', 'Body', 'recipients', 'senderEmail', 'creationTime', 'Item_x0020_Cover', 'File_x0020_Type', 'FileLeafRef', 'FileDirRef', 'ItemRank', 'ItemType', 'Url', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title', 'EncodedAbsUrl')
        .expand('Author,Editor,Responsible ,SmartTopics')
        .get()
        .then((Data) => {

          Data.docTitle = getUploadedFileName(Data?.FileLeafRef);
          Data.siteType = 'LivingDocs';
          Data.Item_x002d_Image = Data?.Item_x0020_Cover
          let portfolioData: any = []
          setTimeout(() => {
            const panelMain: any = document.querySelector('.ms-Panel-main');
            if (panelMain && portfolioData[0]?.PortfolioType?.Color) {
              $('.ms-Panel-main').css('--SiteBlue', portfolioData[0]?.PortfolioType?.Color); // Set the desired color value here
            }
          }, 1000)
          console.log("document data", Data);
          setShareWebTypeTopicData(Data?.SmartTopics)
          setEditdocumentsData(Data);
          // setShareWebTypeTopicData(Data?.SmartTopics)
        });

    } catch (e: any) {
      console.log(e);
    }
  };

  const handleClosedoc = () => {
  
    props.callbackeditpopup();
  }

  const deleteDocumentsData = async (DeletItemId: any) => {
    console.log(DeletItemId);
    const web = new Web(props?.AllListId?.siteUrl);
    var text: any = "Are you sure want to Delete ?";
    if (confirm(text) == true) {
      await web.lists.getById(props?.AllListId?.SharewebDocument)
        .items.getById(DeletItemId).recycle()
        .then((res: any) => {
          console.log(res);

          if (props.Keydoc) {
            props.callbackeditpopup("delete");
          } else {
            props.callbackeditpopup();
          }

        })
        .catch((err) => {
          console.log(err.message);
        });
    }

  };
  const updateDocumentsData = async () => {
    let componetServicetagData: any = [];
    if (EditdocumentsData?.Portfolios?.length > 0) {
      EditdocumentsData?.Portfolios?.forEach((portfolioId: any) => {
        componetServicetagData.push(portfolioId?.Id);
      });
    }
    const postData: any = {
      Title: EditdocumentsData?.Title,
      FileLeafRef: EditdocumentsData?.docTitle,
      ItemRank: EditdocumentsData?.ItemRank == 'Select Item Rank' ? null : EditdocumentsData?.ItemRank,
      Year: EditdocumentsData.Year,
      ItemType: EditdocumentsData.ItemType,
      Status: EditdocumentsData.Status == 'selectStatus' ? '' : EditdocumentsData.Status,
      Body: EditdocumentsData?.Body,
      Item_x0020_Cover: {
        "__metadata": { type: 'SP.FieldUrlValue' },
        'Description': EditdocumentsData?.Item_x002d_Image?.Url != "" ? EditdocumentsData?.UrItem_x002d_Imagel?.Url : "",
        'Url': EditdocumentsData?.Item_x002d_Image?.Url ? EditdocumentsData?.Item_x002d_Image?.Url : "",
      },
      Url: {
        "__metadata": { type: 'SP.FieldUrlValue' },
        'Description': EditdocumentsData?.Url?.Url != "" ? EditdocumentsData?.Url?.Url : "",
        'Url': EditdocumentsData?.Url?.Url ? EditdocumentsData?.Url?.Url : "",
      },
      ResponsibleId: EditdocumentsData?.Responsible != undefined ? EditdocumentsData?.Responsible?.Id : null

    }
    const web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(props?.AllListId?.SharewebDocument)
      .items.getById(EditdocumentsData.Id).update(postData).then((updatedItem: any) => {
        console.log(updatedItem)
        if (EditdocumentsData?.Url != undefined) {
          alert(" Link update successfully");
        } else {
          alert("Document(s) update successfully");
        }

        if (props?.Keydoc) {
          props.callbackeditpopup(EditdocumentsData);
        } else {
          props.callbackeditpopup();
        }
     
        // getMasterTaskListTasksData()

      }).catch((err: any) => {
        console.log(err)
        if (err.message.includes('423')) {
          alert("Document you are trying to update/tag is open somewhere else. Please close it and try again.")
        }
      })
  }

  const imageTabCallBack = React.useCallback((data: any) => {
    console.log(EditdocumentsData);
    console.log(data)
    if (data != undefined) {
      setEditdocumentsData(data);
    }
  }, [])

  const onRenderCustomHeaderDocuments = () => {
    return (
      <>
        <div className='subheading'>
          {true ? `Edit Document Metadata - ${EditdocumentsData?.Title != undefined ? EditdocumentsData.Title : EditdocumentsData?.Title}` : null}
        </div>
        <Tooltip ComponentId={'942'} />
      </>
    );
  };
  const imageta = (e: any) => {
    if (e) {
      setisOpenImageTab(true)
    }
  }

  const getUploadedFileName = (fileName: any) => {
    const indexOfLastDot = fileName?.lastIndexOf('.');
    if (indexOfLastDot !== -1) {
      const extractedPart = fileName?.substring(0, indexOfLastDot);
      return extractedPart;
    } else {
      return fileName
    }
  }


  const IsitemExists = function (array: any, Item: any) {
    var isExists = false;
    array.map((item: any) => {
      if (item.Id === Item.Id && item.siteType === Item.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  }

  /////////folara editor function start//////////
  const HtmlEditorCallBack = (items: any) => {
    console.log(items);
    var description = ""
    if (items == '<p></p>\n') {
      description = ""
    } else {
      description = items
    }
    let copyData = { ...EditdocumentsData }
    copyData.Body = description
    setEditdocumentsData(copyData)
  }
  const SetResponsibledata = (item: any) => {
    setEditdocumentsData({ ...EditdocumentsData, Responsible: item })
    setListIsVisible(false);

  }
  const searchedName = async (e: any) => {
    setListIsVisible(true);
    let res: any = {}
    let Key: any = e.target.value;
    res.FullName = Key;
    let subString = Key.split(" ");
    setSearchKey({ ...searchKey, Title: subString[0] + " " + subString[1] })
    setSearchKey({ ...searchKey, FirstName: subString })
    const data: any = {
      nodes: allContactData.filter((items: any) =>
        items.FullName?.toLowerCase().includes(Key.toLowerCase())
      ),
    };
    setSearchedDataName(data.nodes);
    setEditdocumentsData({ ...EditdocumentsData, Responsible: res })

    if (Key.length == 0) {
      setSearchedDataName(allContactData);
      setListIsVisible(false);
    }
  }
  //////// folora editor function end///////////

  // =============smartTopic function============
  const setSelectedTopicData = (selectCategoryData: any, usedFor: any) => {
    setIsComponentPicker(false);
    let uniqueIds: any = {};
    if (usedFor == "For-Panel") {
      let TempArrya: any = [];
      selectCategoryData?.map((selectedData: any) => {
        TempArrya.push(selectedData);
      })
      tempShareWebTypeData = TempArrya;
    } else {
      selectCategoryData.forEach((existingData: any) => {
        tempShareWebTypeData.push(existingData);
      });
    }
    const result: any = tempShareWebTypeData.filter((item: any) => {
      if (!uniqueIds[item.Id]) {
        uniqueIds[item.Id] = true;
        return true;
      }
      return false;
    });
    tempShareWebTypeData = result;
    let updatedItem = {
      ...EditDataBackup,
      TaskCategories: tempShareWebTypeData,
    };
    setEditdocumentsData(updatedItem);
    EditDataBackup = updatedItem;
    if (usedFor === "For-Panel" || usedFor === "For-Auto-Search") {
      setShareWebTypeTopicData(result);
      if (usedFor === "For-Auto-Search") {
        setSearchedTopicData([]);

      }
    }
  };
  const removeCategoryItem = (TypeCategory: any, TypeId: any) => {
    let tempString: any;
    let tempArray2: any = [];
    tempShareWebTypeData = [];

    if (TypeCategory === 'Topics') {
      ShareWebTypeTopicData?.map((dataType: any) => {
        if (dataType.Id != TypeId) {
          tempArray2.push(dataType);
          tempShareWebTypeData.push(dataType);
        }
      });
    }
    else if (TypeCategory === 'Pages') {
      ShareWebTypePagesData?.map((dataType: any) => {
        if (dataType.Id != TypeId) {
          tempArray2.push(dataType);
          tempShareWebTypeData.push(dataType);
        }
      });
    }
    if (tempArray2 != undefined && tempArray2.length > 0) {
      tempArray2.map((itemData: any) => {
        tempString =
          tempString != undefined
            ? tempString + ";" + itemData.Title
            : itemData.Title;
      });
    }

    if (TypeCategory === 'Topics') {
      setShareWebTypeTopicData(tempArray2);
    }

  };
  const EditComponentPicker = (arr: any, type: any) => {
    setIsComponentPicker(true);
    taggingtype = type;
    if (taggingtype === 'Topics')
      tempCategoryData = ShareWebTypeTopicData

  }
  const SelectCategoryCallBack = React.useCallback(
    (selectCategoryDataCallBack: any) => {
      if (taggingtype === 'Topics')
        setSelectedTopicData(selectCategoryDataCallBack, "For-Panel");

    }, []
  );
  const smartCategoryPopup = React.useCallback(() => {
    setIsComponentPicker(false);
  }, []);
  //==========smart tpic page function end============
  return (
    <>
      <Panel onRenderHeader={onRenderCustomHeaderDocuments}
        isOpen={true}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClosedoc}
        isBlocking={false}
      >
        <Tabs
          defaultActiveKey="BASICINFORMATION"
          transition={false}
          id="noanim-tab-example"
          className="rounded-0"
          onSelect={imageta}
        >

          <Tab eventKey="BASICINFORMATION" title="BASIC INFORMATION" className='p-0'>

            <div className='border border-top-0 p-2'>
              {EditdocumentsData?.Url?.Url && <div className='d-flex'>
                <div className='input-group'><label className='form-label full-width'>URL</label>
                  <input type='text' className="from-control w-75" value={EditdocumentsData?.Url?.Url} onChange={(e => setEditdocumentsData({ ...EditdocumentsData, Url: { ...EditdocumentsData.Url, Url: e.target.value } }))}></input>
                </div>
              </div>}

              <div className='d-flex'>
                <div className="input-group"><label className=" full-width ">Name </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.docTitle} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, docTitle: e.target.value })} />.{EditdocumentsData?.File_x0020_Type}
                </div>

                <div className="input-group mx-4"><label className="full-width ">Year </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Year} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Year: e.target.value })} />
                </div>
                <div className="input-group mx-4">
                  <label className="full-width">Status</label>
                  <select className="form-select" defaultValue={EditdocumentsData?.Status} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Status: e.target.value })}>
                    {Status.map(function (h: any, i: any) {
                      return (
                        <option key={i} selected={EditdocumentsData?.Status == h} value={h} > {h}</option>)
                    })}
                  </select>
                </div>

                <div className="input-group">
                  <label className="full-width">Item Rank</label>
                  <select className="form-select" defaultValue={EditdocumentsData?.ItemRank} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, ItemRank: e.target.value })}>
                    {ItemRank.map(function (h: any, i: any) {
                      return (
                        <option key={i}
                          selected={EditdocumentsData?.ItemRank == h?.rank}
                          value={h?.rank} >{h?.rankTitle}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='input-group'>
                  <label className="full-width ">Title </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Title}
                    onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Title: e.target.value })}
                  />
                </div>
                <div className="col">
                  <div className='input-group'>
                    <label htmlFor="Responsible" className='full-width form-label boldClable '>Responsible</label>
                    <input type='text' placeholder="Enter Contacts Name" value={EditdocumentsData?.Responsible?.FullName || ''} onChange={(e) => searchedName(e)} className="form-control" />
                    {listIsVisible ? <div className="col-12 mt-1 rounded-0">
                      <ul className="list-group">
                        {searchedNameData?.map((item: any) => {
                          return (
                            <li className="list-group-item" onClick={() => SetResponsibledata(item)}><a>{item.FullName}</a></li>
                          )
                        })}
                      </ul>
                    </div>
                      : null}
                  </div>
                </div>
                <div className="col mt-2">
                  <div className='input-group'>
                    <label className="form-label full-width">Main Topic</label>
                    {/* <CustomToolTip Description={'Tag the available Topics'} /> */}
                    {ShareWebTypeTopicData?.length > 1 ? <>
                      <input
                        type="text"
                        className="form-control"
                        id="txtCategories"
                        placeholder="Main Topic"
                        value={TopicSearchKey}
                      // onChange={(e) => autoSuggestionsForTopic(e)}
                      />
                      {SearchedTopicData?.length > 0 ? (
                        <div className="SmartTableOnTaskPopup">
                          <ul className="autosuggest-list maXh-200 scrollbar list-group">
                            {SearchedTopicData.map((item: any) => {
                              return (
                                <li className="list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedTopicData([item], "For-Auto-Search")}>
                                  <a>{item.Newlabel}</a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                      {ShareWebTypeTopicData?.map(
                        (type: any, index: number) => {
                          return (
                            <div className="block w-100">
                              <a style={{ color: "#fff !important" }} className="textDotted">
                                {type.Title}
                              </a>
                              <span onClick={() => removeCategoryItem('Topics', type.Id)} className="bg-light ml-auto svg__icon--cross svg__iconbox"></span>
                            </div>
                          );
                        }
                      )}</> :
                      <>
                        {ShareWebTypeTopicData?.length == 1 ?

                          <div className="full-width">
                            {ShareWebTypeTopicData?.map((CategoryItem: any) => {
                              return (
                                <div className="full-width replaceInput alignCenter">
                                  <a
                                    title={CategoryItem.Title}
                                    target="_blank"
                                    data-interception="off"
                                    className="textDotted"
                                  >
                                    {CategoryItem.Title}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                          :
                          <>
                            <input
                              type="text"
                              className="form-control"
                              id="txtCategories"
                              placeholder="Main Topic"
                              value={TopicSearchKey}
                            // onChange={(e) => autoSuggestionsForTopic(e)}
                            />
                            {SearchedTopicData?.length > 0 ? (
                              <div className="SmartTableOnTaskPopup">
                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                  {SearchedTopicData.map((item: any) => {
                                    return (
                                      <li
                                        className="list-group-item p-1 rounded-0 list-group-item-action"
                                        key={item.id}
                                        onClick={() =>
                                          setSelectedTopicData(
                                            [item],
                                            "For-Auto-Search"
                                          )
                                        }
                                      >
                                        <a>{item.Newlabel}</a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ) : null}
                          </>
                        }

                      </>
                    }
                    <span className="input-group-text" title="Smart Category Popup" onClick={(e) => EditComponentPicker(EditdocumentsData, "Topics")}>
                      <span className="alignIcon svg__iconbox svg__icon--editBox"></span>
                    </span>
                  </div>
                </div>
              </div>


              {/* ------end project--- */}


              {EditdocumentsData != undefined && <div className='mt-3'> <HtmlEditorCard editorValue={EditdocumentsData?.Body != undefined ? EditdocumentsData?.Body : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>}
            </div>
          </Tab>

        </Tabs>
        <footer className='text-end mt-2'>
          <div className='col-sm-12 row m-0'>


            <div className="col-sm-6 ps-0 text-lg-start">
              <div>
                {console.log("footerdiv")}
                <div><span className='pe-2'>Created</span><span className='pe-2'>{EditdocumentsData?.Created !== null ? moment(EditdocumentsData?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{EditdocumentsData?.Modified !== null ? moment(EditdocumentsData?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Editor?.Title}</a></span></div>
                <div onClick={() => deleteDocumentsData(EditdocumentsData?.Id)} className="hreflink"><span style={{ marginLeft: '-4px' }} className="alignIcon hreflink svg__icon--trash svg__iconbox"></span>Delete this item</div>
              </div>
            </div>

            <div className='col-sm-6 mt-2 p-0'>
              <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.AllListId?.siteUrl}/SharewebDocument/Forms/EditForm.aspx?ID=${EditdocumentsData?.Id != null ? EditdocumentsData?.Id : null}`}>Open out-of-the-box form</a></span>


              <button type='button' className='btn btn-primary mx-2'
                onClick={updateDocumentsData}
              >
                Save
              </button>
              <button type='button' className='btn btn-default' onClick={() => handleClosedoc()}>
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </Panel>
      {IsComponentPicker && (
        <Picker
          props={EditdocumentsData}
          selectedCategoryData={tempCategoryData}
          siteUrls={props?.AllListId?.siteUrl}
          AllListId={props?.AllListId}
          CallBack={SelectCategoryCallBack}
          closePopupCallBack={smartCategoryPopup}
          usedFor={taggingtype}
        />
      )}
    </>
  )
}
export default EditLivingDocumentpanel;

