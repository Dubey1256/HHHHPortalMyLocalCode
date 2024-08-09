import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import moment from 'moment';
import { Web } from 'sp-pnp-js';
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import ImageInformation from '../../EditPopupFiles/ImageInformation';
import ReadyMadeTable from '../../../globalComponents/RadimadeTable';
import GlobalTooltip from '../../../globalComponents/Tooltip';
let mastertaskdetails: any = []
let copyEditData: any = {}
let mydataa: any = [];
let myTaskData: any = []
let count = 0;
let componentDetailsDaata: any = [];
let tempmetadata: any = [];
var tempArray: any = [];
var selectedTasks: any = [];
var AllListId: any;


const EditDocumentpanel = (props: any) => {
  const [EditdocumentsData, setEditdocumentsData]: any = React.useState();
  const [isOpenImageTab, setisOpenImageTab] = React.useState(false);
  const [isopenTaskpopup, setisopenTaskpopup] = React.useState(false);
  const [TaskItem, setTaskItem] = React.useState("");
  const [TaskSearchKey, setTaskSearchKey] = React.useState("");
  const [isopencomonentservicepopup, setisopencomonentservicepopup] = React.useState(false);
  const [isopenprojectservicepopup, setisopenprojectservicepopup] = React.useState(false);
  const [projectdata, setProjectData] = React.useState([]);
  const [CMSToolComponentProjectpopup, setCMSToolComponentProjectpopup] = React.useState("");
  const [allProjectDaata, SetAllProjectDaata] = React.useState([]);
  const [allPortfolioDaata, SetAllPortfolioDaata] = React.useState([]);
  const [PortfolioData, setPortfolioData] = React.useState([]);
  const [ProjectSearchKey, setProjectSearchKey] = React.useState("");
  const [searchedProjectDaata, setSearchedProjectDaata] = React.useState([]);
  const [searchedPortfolioDaata, setSearchedPortfolioDaata] = React.useState([]);
  const [Metadata, setMetadata] = React.useState([]);
  const [allTaskData, SetAllTaskData] = React.useState([]);
  const [searchedTaskData, setSearchedTaskData] = React.useState([]);
  const [TaggedSitesTask, setTaggedSitesTask] = React.useState<any>([]);
  const [isOpenComponentServicePopup, setIsOpenComponentServicePopup] = React.useState(false);

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
  let Status: any = ["Select Status", "Draft", "Final", "Archived"]

  React.useEffect(() => {
    AllListId = props.AllListId
    if ('TaskTypeID' in AllListId && 'PortFolioTypeID' in AllListId) {

    } else {
      if (window.location.href.toLowerCase()?.indexOf('gmbh') > -1) {
        AllListId.TaskTypeID = "d255609f-7f22-4e40-a857-a3ffd2c57101";
        AllListId.PortFolioTypeID = "63031812-949e-46a0-a6f5-dc6be912a193";
      }
      else {
        AllListId.TaskTypeID = "21b55c7b-5748-483a-905a-62ef663972dc";
        AllListId.PortFolioTypeID = "c21ab0e4-4984-4ef7-81b5-805efaa3752e";
      }
    }
    AllListId.Context = props.AllListId?.context
    if (props?.editData != undefined) {
      LoadMasterTaskList().then((smartData: any) => {
        loadSelectedDocuments()
      }).catch((error: any) => {
        console.log(error)
      })
    }
    getMasterTaskListTasksData()
    LoadSmartmetadata()
  }, [props?.editData != undefined])


  const LoadSmartmetadata = async () => {
    let siteConfigSites: any = [];
    let web = new Web(props?.AllListId?.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      .getById(props?.AllListId?.SmartMetadataListID)
      .items.select(
        "Id",
        "Title",
        "IsVisible",
        "ParentID",
        "SmartSuggestions",
        "TaxType",
        "Description1",
        "Configurations",
        "Item_x005F_x0020_Cover",
        "listId",
        "siteName",
        "siteUrl",
        "SortOrder",
        "SmartFilters",
        "Selectable",
        "Color_x0020_Tag",
        "Parent/Id",
        "Parent/Title"
      )
      .filter("TaxType eq 'Documentquery'")
      .top(4999)
      .expand("Parent")
      .get();

    tempmetadata = JSON.parse(smartmetaDetails[0].Configurations)
    setMetadata(smartmetaDetails);
  };

  const loadSelectedDocuments = async () => {
    let AllTasks: any = []
    tempArray = []
    let tempArraycopy = [];
    const web = new Web(tempmetadata[0]?.siteUrl);
    try {
      await web.lists.getById(tempmetadata[0]?.listId)
        .items.getById(props?.editData?.Id)
        .select(tempmetadata[0]?.query)
        .get()
        .then((Data) => {
          let Title: any = " "
          Data.docTitle = getUploadedFileName(Data?.FileLeafRef);
          Title = Data?.docTitle;
          Data.Title = (Data?.Title != undefined && Data?.Title != '' && Data?.Title != null) ? Data.Title : Title;
          if (Data?.Title.includes(Data?.File_x0020_Type)) {
            Data.Title = getUploadedFileName(Data?.Title);
          }
          Data.siteType = tempmetadata[0]?.siteType;
          // Data.docTitle = getUploadedFileName(Data?.FileLeafRef);
          Data.Item_x002d_Image = Data?.Item_x0020_Cover
          let portfolioData: any = []
          let projectData: any = []
          let projectDataforsuggestion: any = []
          let portfoliosDataforsuggestion: any = []

          try {
            tempmetadata[0].taskSites.map((site: any) => {
              if (Data[site]?.length > 0) {
                let temp: any = {
                  Title: `${site}Id`,
                  Task: [],
                  TaskIds: []
                };

                tempArraycopy = Data[site].map((item: any) => {
                  temp.Task.push(item);
                  item.siteType = site;

                  if (temp.Title.toLowerCase().indexOf(site.toLowerCase()) > -1) {
                    temp.TaskIds.push(item.Id);
                  }

                  AllTasks.push(item);
                  return temp;
                });

                tempArray.push(temp);
              }
            });

            setTaggedSitesTask(AllTasks);

          }
          catch (e) {
            console.log(e)
          }

          if (mastertaskdetails != undefined && mastertaskdetails != null && mastertaskdetails?.length > 0) {
              mastertaskdetails.map((mastertask: any) => {
              if (mastertask?.Item_x0020_Type == "Project" || mastertask?.Item_x0020_Type == "Sprint") {
                projectDataforsuggestion.push(mastertask)
              }
              if (mastertask?.Item_x0020_Type !== "Project" && mastertask?.Item_x0020_Type !== "Sprint") {
                portfoliosDataforsuggestion.push(mastertask)
              }
            });
            if (Data?.Portfolios != null && Data?.Portfolios != undefined) {
              Data.Portfolios?.map((portfolio: any) => {
                mastertaskdetails?.map((mastertask: any) => {
                  if (mastertask?.Id == portfolio?.Id && mastertask?.Item_x0020_Type != "Project" && mastertask.Item_x0020_Type != "Sprint") {
                  portfolioData.push(mastertask);
                }
                  if (mastertask?.Id == portfolio?.Id && (mastertask?.Item_x0020_Type == "Project" || mastertask.Item_x0020_Type == "Sprint")) {
                  projectData.push(mastertask);
                }
                });
              })
            }

            Data.projectData = projectData
            Data.Portfolios  = portfolioData
            setProjectData(projectData)
            setPortfolioData(portfolioData)
            SetAllProjectDaata(projectDataforsuggestion)
            SetAllPortfolioDaata(portfoliosDataforsuggestion)
          }
          setTimeout(() => {
            const panelMain: any = document.querySelector('.ms-Panel-main');
            if (panelMain && portfolioData[0]?.PortfolioType?.Color) {
              $('.ms-Panel-main').css('--SiteBlue', portfolioData[0]?.PortfolioType?.Color); // Set the desired color value here
            }
          }, 1000)
          console.log("document data", Data);
          setEditdocumentsData(Data);
        });

    } catch (e: any) {
      console.log(e);
    }
  }; 

  async function updateMultiLookup(
    itemIds: number[],
    lookupIds: number[],
    AllListId: any
  ) {
    try {
      if (itemIds?.length == 0) {
        getMasterTaskListTasksData();
      } else {
        let web = new Web(AllListId?.siteUrl);
        for (const itemId of itemIds) {
          // Update the multi-lookup field for each item
          await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.getById(itemId)
            .update({
              PortfoliosId: {
                results:
                  lookupIds !== undefined && lookupIds?.length > 0
                    ? lookupIds
                    : [],
              }
            })
            .then((res: any) => {
              getMasterTaskListTasksData();
              count++;
              console.log(res);
            });
        }
      }
    } catch (error) {
      console.error("Error updating multi-lookup field:", error);
    }
  }

  let getMasterTaskListTasksData = async function () {
    try {
      let web = new Web(props?.AllListId?.siteUrl);

      componentDetailsDaata = await web.lists
        .getById(props?.AllListId?.MasterTaskListID)
        .items.select(
          "Item_x0020_Type",
          "Title",
          "PortfolioType/Title",
          "PortfolioStructureID",
          "Id",
          "PercentComplete",
          "Portfolios/Id",
          "Portfolios/Title"
        )
      .expand("Portfolios","PortfolioType")
      .filter("(Item_x0020_Type eq 'Project' or Item_x0020_Type eq 'Sprint' or PortfolioType/Title eq 'Component') and Portfolios/Id eq " + props?.editData?.Id)
        .top(4000)
      .getAll()

      // Project Data for HHHH Project Management
        if (componentDetailsDaata.length > 0) {
          let PxData = componentDetailsDaata?.filter((items:any)=>items.Item_x0020_Type =="Project" || items.Item_x0020_Type =="Sprint")
          let PortfolioData = componentDetailsDaata?.filter((items:any)=>items?.PortfolioType?.Title == "Component")

          setProjectData(PxData)
          setPortfolioData(PortfolioData)
    }

      console.log("data show on componentdetails", componentDetailsDaata);
    } catch (error) {
      console.log("error show", error);
    }
  };

  const LoadMasterTaskList = () => {
    return new Promise(function (resolve, reject) {
      let web = new Web(props.AllListId?.siteUrl);
      web.lists
        .getById(props?.AllListId.MasterTaskListID).items
        .select(
          "Id",
          "Title",
          "Mileage",
          "TaskListId",
          "Item_x0020_Type",
          "TaskListName",
          "PortfolioType/Id",
          "PortfolioType/Title",
          "PortfolioType/Color",
        ).expand("PortfolioType").top(4999).get()
        .then((dataserviccomponent: any) => {
          console.log(dataserviccomponent)
          mastertaskdetails = dataserviccomponent;
          resolve(dataserviccomponent)

        }).catch((error: any) => {
          console.log(error)
          reject(error)
        })
    })
  }
  const handleClosedoc = () => {
    mastertaskdetails = []
    props.callbackeditpopup();
  }

  const deleteDocumentsData = async (DeletItemId: any) => {
    console.log(DeletItemId);
    const web = new Web(props?.AllListId?.siteUrl);
    var text: any = "Are you sure want to Delete ?";
    if (confirm(text) == true) {
      await web.lists.getById(props?.AllListId?.DocumentsListID)
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
    var RelevantProjectIdRemove = "";
    var RelevantProjectIds = "";
    if (PortfolioData != undefined && PortfolioData?.length > 0) {
      PortfolioData?.map((portfolioId: any) => {
        componetServicetagData.push(portfolioId?.Id)
      })
    }

    if (projectdata != undefined && projectdata?.length > 0) {
      projectdata?.map((com: any) => {
        if (projectdata != undefined && projectdata?.length >= 0) {
          $.each(projectdata, function (index: any, smart: any) {
            RelevantProjectIds = smart.Id;
            componetServicetagData.push(smart.Id);
          });
        }
      });
    }

    if (projectdata != null && projectdata.length >= 0) {
      projectdata.filter((com: any) => {
        RelevantProjectIdRemove = com.Id;
        componetServicetagData.push(com.Id);
      });
    }
    const postData: any = {
      Title: EditdocumentsData?.Title,
      FileLeafRef: EditdocumentsData?.docTitle,
      ItemRank: EditdocumentsData?.ItemRank == 'Select Item Rank' ? null : EditdocumentsData?.ItemRank,
      Year: EditdocumentsData.Year,
      ItemType: EditdocumentsData.ItemType,
      Status: EditdocumentsData.Status,
      PortfoliosId: { "results": componetServicetagData.length > 0 ? componetServicetagData : [] },
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
      }

    }
    tempArray?.map((item: any) => {
      postData[item.Title] = { results: item.TaskIds }
    })

    const web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(props?.AllListId?.DocumentsListID)
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
        mastertaskdetails = []
        getMasterTaskListTasksData()

      }).catch(async (err: any) => {
        console.log(err)
        if (err.message.includes('423')) {
          const sp = spfi().using(spSPFx(props?.Context));;
          const user = await sp.web.getFolderByServerRelativePath(EditdocumentsData?.FileDirRef).files.getByUrl(EditdocumentsData?.FileLeafRef).getLockedByUser();
          let name= user?.Title + ' - (' + user?.Email + ')'
          console.log(user)
          alert(`Document you are trying to update/tag is locked by ${name}. Please ask them to close it and try again.`)
        }
      })
  }

  // {
  //   (EditdocumentsData?.recipients) ?
  //     (JSON.parse(EditdocumentsData?.recipients)?.map((item: any) => {
  //       if (item.recipType == "to") {
  //         if (item.email.length > 1) {
  //           ReceiverId += item.email + "; ";
  //         }
  //         recipientLabel = `To: ${ReceiverId}`;
  //         return {
  //           recipientLabel
  //         }
  //       }
  //       let lastSemicolonIndex = recipientLabel.lastIndexOf(';');
  //       if (lastSemicolonIndex !== -1) {
  //         // Remove the last semicolon using substrings
  //         recipientLabel = recipientLabel.substring(0, lastSemicolonIndex) + recipientLabel.substring(lastSemicolonIndex + 1);
  //       }
  //       if (item.recipType == "cc") {
  //         ReceiverCC += item.email + "; ";
  //         recipientLabelCC = `CC: ${ReceiverCC}`;
  //         return {
  //           recipientLabelCC
  //         }
  //       }
  //       // let lastSemicolonIndexCC = recipientLabelCC.lastIndexOf(';');
  //       // if (lastSemicolonIndexCC !== -1) {
  //       //   // Remove the last semicolon using substrings
  //       //   recipientLabelCC = recipientLabelCC.substring(0, lastSemicolonIndexCC) + recipientLabelCC.substring(lastSemicolonIndexCC + 1);
  //       // }
  //     })) :
  //     ""
  // }
  // let lastSemicolonIndexCC = recipientLabelCC.lastIndexOf(';');
  // if (lastSemicolonIndexCC !== -1) {
  //   // Remove the last semicolon using substrings
  //   recipientLabelCC = recipientLabelCC.substring(0, lastSemicolonIndexCC) + recipientLabelCC.substring(lastSemicolonIndexCC + 1);
  // }

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
          {true ? `Edit Document Metadata - ${EditdocumentsData?.Title != undefined ? EditdocumentsData.Title : EditdocumentsData?.docTitle}` : null}
        </div>
        <Tooltip ComponentId={'942'} />
      </>
    );
  };
  const customRadimadeTable = () => {
    return (
      <>
        <div className='subheading' >
          Select Task
        </div>
        <GlobalTooltip ComponentId='843' />
      </>
    )
  }
  const imageta = (e: any) => {
    if (e) {
      setisOpenImageTab(true)
    }
  }

  const ComponentServicePopupCallBack = React.useCallback(
    (DataItem: any, Type: any, functionType: any) => {
      if (functionType === "Save") {
        if (Type === "Multi") {
          let copyPortfoliosData = EditdocumentsData?.Portfolios?.length > 0 ? EditdocumentsData?.Portfolios : []
          copyPortfoliosData = DataItem
            .filter((item: { Id: null }) => item.Id !== null)
            .map((item: { Id: any }) => item.Id);
          setEditdocumentsData({ ...EditdocumentsData, Portfolios: copyPortfoliosData })
          setisopencomonentservicepopup(false)
    }
      } else {
      setisopencomonentservicepopup(false);
    }
      console.log("EditdocumentsData:", EditdocumentsData);
    },
    []
  );



  // -----For project
  const autoSuggestionForProject = (e: any) => {
    let searchedKey: any = e.target.value;
    setProjectSearchKey(e.target.value);
    let tempArray: any = [];
    if (searchedKey?.length > 0) {
      allProjectDaata?.map((itemData: any) => {
        if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
          tempArray.push(itemData);
        }
      });
      setSearchedProjectDaata(tempArray);
    } else {
      setSearchedProjectDaata([]);
    }
  };
  const autoSuggestionForTask = (e: any) => {
    let searchedKey: any = e.target.value;
    setTaskSearchKey(e.target.value);
    let tempArray: any = [];
    if (searchedKey?.length > 0) {
      allTaskData?.map((itemData: any) => {
        if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
          tempArray.push(itemData);
        }
      });
      setSearchedTaskData(tempArray);
    } else {
      setSearchedTaskData([]);
    }
  };

  const autoSuggestionForPortfolio = (e: any) => {
    let searchedData: any = e.target.value;
    setProjectSearchKey(e.target.value);
    let tempArray: any = [];
    if (searchedData?.length > 0) {
      allPortfolioDaata?.map((itemData: any) => {
        if (itemData?.Title?.length > 0) {
          if (itemData?.Title.toLowerCase().includes(searchedData.toLowerCase())) {
            tempArray.push(itemData);
          }
        }
      });
      setSearchedPortfolioDaata(tempArray);
    } else {
      setSearchedPortfolioDaata([]);
    }
  };
  
  const handleSuggestionforTask = (suggestion: any) => {
    // allProjectDaata?.map((items: any) => {
    //   if (items?.Id === suggestion?.Id) {
    //     callServiceComponents([items], "Multi", "Save");
    //   }
    // });
    setSearchedTaskData([]);
  };
  const handleSuggestionforProject = (suggestion: any) => {
    allProjectDaata?.map((items: any) => {
      if (items?.Id === suggestion?.Id) {
        callServiceComponents([items], "Multi", "Save");
      }
    });
    setSearchedProjectDaata([]);
  };

  const handleSuggestionforPortfolio = (suggestion: any) => {
    allPortfolioDaata?.map((items: any) => {
      if (items?.Id === suggestion?.Id) {
        // callComponents([items], "Multi", "Save");
        callServiceComponents([items], "Multi", "Save")
      }
    });
    setSearchedPortfolioDaata([]);
  };

  // ------end----

  const getUploadedFileName = (fileName: any) => {
    const indexOfLastDot = fileName?.lastIndexOf('.');
    if (indexOfLastDot !== -1) {
      const extractedPart = fileName?.substring(0, indexOfLastDot);
      return extractedPart;
    } else {
      return fileName
    }
  }

  const DeleteTagPortfolios = async(titleToRemove: any) => {

    // setEditdocumentsData((prev: any) => {
    //   return {
    //     ...prev, Portfolios: prev.Portfolios?.filter((portfolio: any) => portfolio?.Id != deletePortfolioId)
    //   }
    // })
    try {
      let web = new Web(props?.AllListId?.siteUrl);

      // Update the multi-lookup field for each item
      titleToRemove.length > 0 &&
        (await web.lists
          .getById(props?.AllListId?.MasterTaskListID)
          .items.getById(titleToRemove[0])
          .update({
            PortfoliosId: {
              results: titleToRemove !== undefined ? titleToRemove : [],
            },
          })
          .then((res: any) => {
            console.log(res);
          })
          .catch((error) => {
            console.log("error", error);
          }));

      let updatedComponentDaata: any = [];
      updatedComponentDaata = PortfolioData.filter(
        (itemmm: any) => itemmm.Id !== titleToRemove[0]
      );
      console.log("remove data", updatedComponentDaata);
      setPortfolioData(updatedComponentDaata);
    } catch (error) {
      console.log(error);
    }

  }

  const openProjectPopup = (itemm: any) => {
    setisopenprojectservicepopup(true);
    mydataa.push(props?.editData?.Id);
    setCMSToolComponentProjectpopup(itemm);
  };
  const openTaskPopup = (itemm: any) => {
    setisopenTaskpopup(true);
    myTaskData.push(props?.editData);
    setTaskItem(itemm);
  };

  const opencomonentservicepopup = () => {
    // setIsOpenComponentServicePopup(true);
    // mydataa.push(props?.editData?.Id);
    // setCMSToolComponentProjectpopup(itemm);
    copyEditData = []
    copyEditData = EditdocumentsData
    setisopencomonentservicepopup(true)
  };

  const callServiceComponents = React.useCallback(
    (item1: any, type: any, functionType: any) => {
      if (functionType === "Close") {
        if (type === "Multi") {
          setisopenprojectservicepopup(false);
          setisopencomonentservicepopup(false);

        } else {
          setisopenprojectservicepopup(false);
          setisopencomonentservicepopup(false);

        }
      } else {
        if (type === "Multi" || type === "Single") {
          let mydataid: any = [props?.editData?.Id];
          let filteredIds = item1
            .filter((item: { Id: null }) => item.Id !== null)
            .map((item: { Id: any }) => item.Id);

          updateMultiLookup(filteredIds, mydataid, props?.AllListId);
          setisopenprojectservicepopup(false);
          setisopencomonentservicepopup(false);

        }
      }
    },
    []
  );

  const DeleteCrossIconDataForTask = async (titleToRemove: any,site:any) => {
    var selectedTasks1 = TaggedSitesTask.filter(
      (itemmm: any) => itemmm.Id !== titleToRemove
    );
    selectedTasks = selectedTasks1
    tempArray.map((item: any) => {
        item.Task = item?.Task?.filter(
          (itemmm: any) => itemmm.Id !== titleToRemove
        );
      item?.TaskIds?.map((id: any, index: any) => {
        if (id == titleToRemove)
          item?.TaskIds?.splice(index, 1)
      })
         
    })
    console.log("remove data", selectedTasks1);
    setTaggedSitesTask(selectedTasks1);
  };

  const DeleteCrossIconDataForProject = async (titleToRemove: any) => {
    try {
      let web = new Web(props?.AllListId?.siteUrl);

      // Update the multi-lookup field for each item
      titleToRemove.length > 0 &&
        (await web.lists
          .getById(props?.AllListId?.MasterTaskListID)
          .items.getById(titleToRemove[0])
          .update({
            PortfoliosId: {
              results: titleToRemove !== undefined ? titleToRemove : [],
            },
          })
          .then((res: any) => {
            console.log(res);
          })
          .catch((error) => {
            console.log("error", error);
          }));

      let updatedComponentDaata: any = [];
      updatedComponentDaata = projectdata.filter(
        (itemmm: any) => itemmm.Id !== titleToRemove[0]
      );
      console.log("remove data", updatedComponentDaata);
      setProjectData(updatedComponentDaata);
    } catch (error) {
      console.log(error);
    }
  };
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
  // const TaskCallback = async (value: any) => {   
  //   selectedTasks = TaggedSitesTask
  //   value?.map((item: any) => {
  //     if (!IsitemExists(selectedTasks, item?.original))
  //       selectedTasks.push(item?.original)
  //   })
  //   if (selectedTasks?.length > 0) {
  //     let temp: any = {}
  //     temp.Task = []
  //     temp.TaskIds = []
  //     tempArray = selectedTasks.map((item: any) => {
  //       temp.Title = `${item?.siteType}Id`
  //       temp.Task.push(item)

  //       if (temp?.Title?.toLowerCase()?.indexOf(item.siteType.toLowerCase()) > -1) {
  //         temp.TaskIds.push(item.Id);
  //       }
  //       return temp;
  //     });     
  //   }
  //   setTaggedSitesTask(selectedTasks);
  // }

  const TaskCallback = async (value: any) => {
    let selectedTasks = TaggedSitesTask;

    value?.forEach((item: any) => {
      if (!IsitemExists(selectedTasks, item?.original)) {
        selectedTasks.push(item?.original);
      }
    });

    if (selectedTasks?.length > 0) {
      const groupedTasks: any = {};

      selectedTasks.forEach((item: any) => {
        const siteTypeKey = `${item.siteType}Id`;

        if (!groupedTasks[siteTypeKey]) {
          groupedTasks[siteTypeKey] = {
            Title: siteTypeKey,
            Task: [],
            TaskIds: []
          };
        }

        groupedTasks[siteTypeKey].Task.push(item);

        if (groupedTasks[siteTypeKey].Title.toLowerCase().indexOf(item.siteType.toLowerCase()) > -1) {
          groupedTasks[siteTypeKey].TaskIds.push(item.Id);
        }
      });

      // Convert the grouped tasks object to an array if needed
      tempArray = Object.keys(groupedTasks).map(key => groupedTasks[key]);
    }

    setTaggedSitesTask(selectedTasks);
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
  //////// folora editor function end///////////
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
                        <option key={i}
                          selected={EditdocumentsData?.Status == h}
                          value={h} >{h}</option>
                      )
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
                <div className="col-sm-6 mb-3">
                  <div className='input-group'>
                    <label className="full-width ">Title </label>
                    <input type="text" className="form-control" value={EditdocumentsData?.Title}
                      onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Title: e.target.value })}
                    />
                  </div>
                </div>
                {/* -------For Task--- */}
                <div className="col-sm-6 mb-3">
                  <div className="input-group">
                    <label className="full_width">Task</label>
                    {TaggedSitesTask != undefined && TaggedSitesTask.length == 1 ? (
                      <div className="w-100">
                        {TaggedSitesTask?.map((items: any, Index: any) => (
                          <div className="full-width replaceInput alignCenter" key={Index}>
                            <a href={`${props?.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items.Id}&Site=${items.siteType}`} className="textDotted hreflink" data-interception="off" target="_blank">
                              {items?.Title}
                            </a>
                            <span className="input-group-text" placeholder="Task" >
                              <span className="bg-dark svg__icon--cross svg__iconbox" onClick={() => DeleteCrossIconDataForTask(items?.Id, items.siteType)}></span>
                              <span title="Task" onClick={(e) => openTaskPopup("Task")} className="svg__iconbox svg__icon--editBox" ></span>
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (<>
                      <input type="text" className="form-control" placeholder="Search Task Here" onChange={(e) => autoSuggestionForTask(e)} />
                      <span className="input-group-text" placeholder="Task">
                        <span title="Task" onClick={(e) => openTaskPopup("Task")} className="svg__iconbox svg__icon--editBox" ></span>
                      </span>
                    </>
                    )}

                    {searchedTaskData?.length > 0 && (
                      <div className="SmartTableOnTaskPopup">
                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                          {searchedTaskData.map(
                            (suggestion: any, index: any) => (
                              <li
                                className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                key={index}
                                onClick={() =>
                                  handleSuggestionforTask(suggestion)
                                }
                              >
                                {suggestion?.Title}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="col-sm-12  inner-tabb">
                      {TaggedSitesTask != undefined && TaggedSitesTask.length > 1 ? (
                        <div className="w=100">
                          {TaggedSitesTask?.map((items: any, Index: any) => (
                            <div className="block d-flex justify-content-between mb-1" key={Index} >
                              <a href={`${props?.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items.Id}&Site=${items.siteType}`} className="wid-90 light" data-interception="off" target="_blank" >
                                {items?.Title}
                              </a>
                              <a className="text-end">
                                {" "}
                                <span className="bg-light svg__icon--cross svg__iconbox" onClick={() => DeleteCrossIconDataForTask(items?.Id, items.siteType)} ></span>
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>     
                  {/* -------For Project--- */}
                <div className="col-sm-6 mb-3">
                  <div className="input-group">
                    <label className="full_width">Project</label>

                    {projectdata != undefined && projectdata.length == 1 ? (
                      <div className="w-100">
                        {projectdata?.map((items: any, Index: any) => (
                          <div
                            className="full-width replaceInput alignCenter"
                            key={Index}
                          >
                            <a
                              href={`${props?.AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${items.Id}`}

                              className="textDotted hreflink"
                              data-interception="off"
                              target="_blank"
                            >
                              {items?.Title}
                            </a>
                            <span
                              className="input-group-text"
                              placeholder="Project"
                            >
                              <span
                                className="bg-dark svg__icon--cross svg__iconbox"
                                onClick={() =>
                                  DeleteCrossIconDataForProject([items?.Id])

                                }
                              ></span>
                              <span
                                title="Project"
                                onClick={(e) =>
                                  openProjectPopup("Project")
                                }
                                className="svg__iconbox svg__icon--editBox"
                              ></span>
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (<>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Project Here"
                        onChange={(e) => autoSuggestionForProject(e)}
                      />
                      <span className="input-group-text" placeholder="Project">
                        <span
                          title="Project"
                          onClick={(e) => openProjectPopup("Project")}
                          className="svg__iconbox svg__icon--editBox"
                        ></span>
                      </span>
                    </>
                    )}

                    {searchedProjectDaata?.length > 0 && (
                      <div className="SmartTableOnTaskPopup">
                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                          {searchedProjectDaata.map(
                            (suggestion: any, index: any) => (
                              <li
                                className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                key={index}
                                onClick={() =>
                                  handleSuggestionforProject(suggestion)
                                }
                              >
                                {suggestion?.Title}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="col-sm-12  inner-tabb">
                      {projectdata != undefined && projectdata.length > 1 ? (
                        <div className="w=100">
                          {projectdata?.map((items: any, Index: any) => (
                            <div
                              className="block d-flex justify-content-between mb-1"
                              key={Index}
                            >
                              <a
                                href={`${props?.AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${items.Id}`}
                                className="wid-90 light"
                                data-interception="off"
                                target="_blank"
                              >
                                {items?.Title}
                              </a>
                              <a className="text-end">
                                {" "}
                                <span
                                  className="bg-light svg__icon--cross svg__iconbox"
                                  onClick={() =>
                                    DeleteCrossIconDataForProject([items?.Id])
                                  }
                                ></span>
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>  
                {/* -------For Portfolio--- */}
                <div className="col-sm-6 mb-3">
                  <div className="input-group">
                    <label className="form-label full-width">
                      Portfolios
                    </label>
                    {PortfolioData != undefined && PortfolioData?.length == 1 ? (
                      PortfolioData?.map((portfolio: any, index: any) => {

                        return (
                          <div
                            className="full-width replaceInput alignCenter"
                            key={index}
                          >
                            <a
                              href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${portfolio.Id}`}
                              className="textDotted hreflink"
                              data-interception="off"
                              target="_blank"
                            >
                              {portfolio?.Title}
                            </a>
                            <span
                              className="input-group-text"
                              placeholder="Portfolio"
                            >
                              <span
                                className="bg-dark svg__icon--cross svg__iconbox"
                                onClick={() =>
                                  DeleteTagPortfolios([portfolio?.Id])
                                }
                              ></span>
                              <span
                                title="Portfolio"
                                onClick={(e) => opencomonentservicepopup()
                                }
                                className="svg__iconbox svg__icon--editBox"
                              ></span>
                            </span>
                          </div>
                        )
                      })
                    ) :
                      (<>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Portfolio Here"
                          onChange={(e) => autoSuggestionForPortfolio(e)}
                        />
                        <span className="input-group-text" placeholder="Portfolios">
                        <span
                            title="Portfolio"
                            onClick={(e) => opencomonentservicepopup()}
                            className="svg__iconbox svg__icon--editBox"
                          ></span>
                        </span>
                      </>
                      )


                    }

                    <div className="col-sm-12  inner-tabb">
                      {PortfolioData != undefined && PortfolioData?.length > 1 ? (
                        <div className="w=100">
                          {PortfolioData?.map((itemss: any, Index: any) => (
                            <div
                              className="block d-flex justify-content-between mb-1"
                              key={Index}
                            >
                              <a
                                href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${itemss.Id}`}
                                className="wid-90 light"
                                data-interception="off"
                                target="_blank"
                              >
                                {itemss?.Title}
                              </a>
                              <a className="text-end">
                                {" "}
                                <span
                                  className="bg-light svg__icon--cross svg__iconbox"
                                  onClick={() =>
                                    DeleteTagPortfolios([itemss?.Id])
                                  }
                                ></span>
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}

                      {searchedPortfolioDaata?.length > 0 && (
                        <div className="SmartTableOnTaskPopup">
                          <ul className="autosuggest-list maXh-200 scrollbar list-group">
                            {searchedPortfolioDaata.map(
                              (suggestions: any, index: any) => (
                                <li
                                  className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                  key={index}
                                  onClick={() =>
                                    handleSuggestionforPortfolio(suggestions)
                                  }
                                >
                                  {suggestions?.Title}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

              </div>


              {/* ------end project--- */}

              {EditdocumentsData?.File_x0020_Type === "msg" ?
                <>
                  <div className='mt-3'>
                    <label className="form-label full-width ">Recipients </label>
                    <div className="input-group gap-1">
                      <label className='form-label full-width'>To:</label>
                      {(EditdocumentsData?.recipients) ?
                        (JSON.parse(EditdocumentsData?.recipients)?.map((item: any) => {
                          if (item.recipType == "to") {
                            return (
                              <div className="col-sm-3">
                                <div className="full-width replaceInput pe-2 alignCenter" onChange={(e) =>
                                  setEditdocumentsData({
                                    ...EditdocumentsData,
                                    recipients: e.target,
                                  })}>
                                  <span className='textDotted'>{item.email}</span>
                                </div>
                              </div>
                            )
                          }
                        }))
                        :
                        <div className="col-sm-3"
                          onChange={(e) =>
                            setEditdocumentsData({
                              ...EditdocumentsData,
                              recipients: e.target,
                            })
                          }
                        >
                          <div className="full-width replaceInput pe-2 alignCenter"></div>
                        </div>

                      }
                      <div className='input-group gap-1'>
                        <label className="form-label full-width">CC:</label>
                        {(EditdocumentsData?.recipients !== null) ?
                          (JSON.parse(EditdocumentsData?.recipients)?.map((items: any) => {
                            if (items.recipType === "cc") {
                              return (
                                <div className="col-sm-3">
                                  <div className="full-width replaceInput pe-2 alignCenter" onChange={(e) =>
                                    setEditdocumentsData({
                                      ...EditdocumentsData,
                                      recipients: e.target,
                                    })}>
                                    <span className='textDotted'>{items.email}</span>
                                  </div></div>
                              )
                            }
                          }))
                          :
                          <div className="col-sm-3"
                            onChange={(e) =>
                              setEditdocumentsData({
                                ...EditdocumentsData,
                                recipients: e.target,
                              })
                            }
                          >
                            <div className="full-width replaceInput pe-2 alignCenter"></div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  <div className='d-flex gap-4 mt-2'>
                    <div className="input-group">
                      <label className="full-width">Sender</label>
                      <input type="text" className="form-control" value={EditdocumentsData?.senderEmail} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, senderEmail: e.target.value })} />

                    </div>
                    <div className="input-group"><label className=" full-width ">Creation Date & Time </label>
                      {EditdocumentsData?.creationTime ?
                        <input type="datetime" className="form-control" value={moment(EditdocumentsData?.creationTime).format("DD/MM/YYYY HH:mm")} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, creationTime: e.target.value })} />
                        :
                        (<input type="datetime" className="form-control" value={EditdocumentsData?.creationTime} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, creationTime: e.target.value })} />)

                      }
                    </div>
                  </div>
                </>
                : ""}
              {EditdocumentsData != undefined && <div className='mt-3'> <HtmlEditorCard editorValue={EditdocumentsData?.Body != undefined ? EditdocumentsData?.Body : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>}
            </div>
          </Tab>
          <Tab eventKey="IMAGEINFORMATION" title="IMAGE INFORMATION" className='p-0'  >
            <div className='border border-top-0 p-2'>

              {isOpenImageTab && <ImageInformation EditdocumentsData={EditdocumentsData} setData={setEditdocumentsData} AllListId={props.AllListId} Context={props.Context} callBack={imageTabCallBack} />}
              {/* {isOpenImageTab && <ImageTabComponenet EditdocumentsData={EditdocumentsData} AllListId={props.AllListId} Context={props.Context} callBack={imageTabCallBack} />} */}
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
              <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Documents/Forms/EditForm.aspx?ID=${EditdocumentsData?.Id != null ? EditdocumentsData?.Id : null}`}>Open out-of-the-box form</a></span>


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
      {isopencomonentservicepopup &&
        <ServiceComponentPortfolioPopup
          props={EditdocumentsData}
          Dynamic={props.AllListId}
          ComponentType={"Component"}
          selectionType={"Multi"}
          Call={(Call: any, type: any, functionType: any) => {
            callServiceComponents(Call, type, functionType);
          }}
        />
      }

      {isopenprojectservicepopup &&
        <ServiceComponentPortfolioPopup
          props={EditdocumentsData}
          Dynamic={props.AllListId}
          ComponentType={"Component"}
          selectionType={"Multi"}
          // Call={ComponentProjectPopupCallBack}
          Call={(Call: any, type: any, functionType: any) => {
            callServiceComponents(Call, type, functionType);
          }}
          showProject={isopenprojectservicepopup}
          updateMultiLookup={updateMultiLookup}

        />
      }

      <Panel isOpen={isopenTaskpopup} isBlocking={false} onDismiss={() => setisopenTaskpopup(false)} type={PanelType.large} onRenderHeader={customRadimadeTable} >
        <ReadyMadeTable AllListId={AllListId} configration={"AllAwt"} TaskFilter={"PercentComplete lt '0.90'"} usedFor={'editdocument'} callBack={TaskCallback} closepopup={() => setisopenTaskpopup(false)} />
      </Panel>

    </>
  )
}
export default EditDocumentpanel;
