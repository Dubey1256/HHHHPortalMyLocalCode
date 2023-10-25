import * as React from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import pnp, { Web } from "sp-pnp-js";
import SiteCompositionComponent from "../webparts/EditPopupFiles/PortfolioSiteCompsition";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../globalComponents/Tooltip'
var myarray4: any = [];
let ClientTimeArray: any[] = [];
var SiteTypeBackupArray: any = [];



export default function Sitecomposition(datas: any) {
  const [isDirectPopup, setIsDirectPopup] = React.useState(false);
  const [show, setshows] = React.useState(false);
  const [EditSiteCompositionStatus, setEditSiteCompositionStatus] = React.useState(false);
  const [showComposition, setshowComposition] = React.useState(true);
  const [smartMetaDataIcon, setsmartMetaDataIcon] = React.useState([]);
  const [selectedClientCategory, setselectedClientCategory] = React.useState([]);
  const [AllSitesData, setAllSitesData] = React.useState([]);
  const [renderCount, setRenderCount] = React.useState(0);
  const [key, setKey] = React.useState(0); // Add a key state
  const Callback: any = datas.callback;


  let BackupSiteTaggingData: any = [];
  let BackupClientCategory: any = [];
  let siteUrl: any = datas?.sitedata?.siteUrl;
  const ServicesTaskCheck: any = false;
  React.useEffect(() => {
    getsmartmetadataIcon();
    if (datas?.props.Sitestagging != undefined) {
      if (datas?.props?.ClientCategory?.length > 0) {
        GetSmartMetaData(datas?.props?.ClientCategory, datas?.props?.Sitestagging);
      } else if (datas?.props?.ClientCategory?.results?.length > 0) {
        GetSmartMetaData(datas?.props?.ClientCategory?.results, datas?.props?.Sitestagging);
      } else {
        GetSmartMetaData(datas?.props?.ClientCategory?.results, datas?.props?.Sitestagging);
      }
    }
    // if (datas?.props?.ClientCategory?.results?.length > 0) {
    //   setselectedClientCategory(datas.props.ClientCategory.results);
    // }
    if (datas?.props?.Sitestagging != undefined) {
      if (typeof datas.props.Sitestagging != "object") {
        datas.props.siteCompositionData = JSON.parse(datas?.props.Sitestagging);
      } else {
        datas.props.siteCompositionData = datas.props.Sitestagging;
      }

    } else {
      datas.props.siteCompositionData = [];
    }

  }, [])
  React.useEffect(() => {
    if (datas?.isDirectPopup == true) {
      setIsDirectPopup(true)
      setEditSiteCompositionStatus(true)
    }
  }, [datas?.isDirectPopup])
  const GetSmartMetaData = async (ClientCategory: any, ClientTime: any) => {
    const array2: any[] = [];
    let ClientTime2: any[] = [];
    if (ClientTime != null && typeof ClientTime != "object") {
      ClientTime2 = JSON.parse(ClientTime);
    } else {
      ClientTime2 = ClientTime;
    }
    ClientTimeArray = ClientTime2.filter((item: any) => item?.Title != "Gender")
    const web = new Web(datas?.sitedata?.siteUrl);
    const smartMetaData = await web.lists
      .getById(datas?.sitedata?.SmartMetadataListID)
      .items.select('Id', 'Title', 'IsVisible', 'TaxType', 'Parent/Id', 'Parent/Title', 'siteName', 'siteUrl', 'SmartSuggestions', 'SmartFilters')
      .expand('Parent')
      .filter("TaxType eq 'Client Category'")
      .top(4000)
      .get();

    ClientCategory?.forEach((item: any) => {
      smartMetaData?.forEach((metaDataItem: any) => {
        if (item?.Id == metaDataItem?.Id) {
          item.siteName = metaDataItem?.siteName;
          array2.push(item);
        }
      });
    });
    setselectedClientCategory(array2)
    console.log(ClientCategory);

    if (ClientTimeArray != undefined && ClientTimeArray != null) {
      ClientTimeArray?.forEach((timeItem: any) => {
        array2?.forEach((item: any) => {
          if (timeItem?.Title == item?.siteName) {
            if (timeItem.ClientCategory == undefined) {
              timeItem.ClientCategory = [];
              timeItem.ClientCategory.push(item);
            } else {
              timeItem.ClientCategory.push(item);
            }
          }
        });
      });
    }
    setshows(true)
  };

  // Get meta data
  const getsmartmetadataIcon = async () => {
    let tempArray: any = [];
    let web = new Web(datas?.sitedata?.siteUrl);
    await web.lists
      .getById(datas?.sitedata?.SmartMetadataListID)
      .items
      .select('Id', 'Title', 'Item_x0020_Cover', 'TaxType',"SortOrder", 'siteName', 'siteUrl', 'Item_x005F_x0020_Cover', 'listId', 'Configurations')
      .filter("TaxType eq 'Sites'").top(4000)
      .get().then((data: any) => {
        let ShortedData: any = getSmartMetadataItemsByTaxType(data, "Sites");
        // getSmartMetadataItemsByTaxType(data, "Sites");
        setsmartMetaDataIcon(data);
        ShortedData?.map((site: any) => {
          if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== "SDC Sites") {
            site.BtnStatus = false;
            site.isSelected = false;
            if (site.Configurations?.length > 5) {
              site.ConfigurationsData = JSON.parse(site.Configurations);
              let tempArray: any = JSON.parse(site.Configurations);
              if (tempArray?.length > 0) {
                tempArray?.map((SiteCompoData: any) => {
                  let TodayDate = new Date();
                  let StartDate = SiteCompoData.StartDate?.split('/').reverse().join('-');
                  let EndDate = SiteCompoData.EndDate?.split('/').reverse().join('-');
                  if (new Date(StartDate) >= TodayDate || new Date(EndDate) <= TodayDate) {
                    site.StartEndDateValidation = true;
                  } else {
                    site.StartEndDateValidation = false;
                  }
                })
              }
            } else {
              site.ConfigurationsData = []
            }
            tempArray.push(site);
          }
        })
      }).catch((error: any) => {
        console.log(error)
      });
    if (tempArray?.length > 0) {
      setAllSitesData(tempArray)
    }
    tempArray?.map((tempData: any) => {
      SiteTypeBackupArray.push(tempData);
    })
  }

  var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
    var Items: any = [];
    metadataItems.map((taxItem: any) => {
      if (taxItem.TaxType === taxType)
        Items.push(taxItem);
    });
    Items.sort((a: any, b: any) => {
      return a.SortOrder - b.SortOrder;
    });
    return Items;
  }


  const GetSiteIcon = (listName: string) => {
    if (listName != undefined) {
      let siteicon = '';
      smartMetaDataIcon?.map((icondata: any) => {
        if (icondata.Title != undefined) {
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x0020_Cover != undefined) {
            siteicon = icondata.Item_x0020_Cover.Url
          }
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x005F_x0020_Cover != undefined) {
            siteicon = icondata.Item_x005F_x0020_Cover.Url
          }
        }
      })
      return siteicon;
    }
  }
  // Open close 
  const showhideComposition = () => {
    if (showComposition) {
      setshowComposition(false)
    } else {
      setshowComposition(true)
    }
  }

  // ************************** This is for the Edit Site COmposition Panle All functions and Callbacks  ***********

  const onRenderCustomCalculateSC = () => {
    return (
      <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
        <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
          <span className="siteColor">
            Edit Site Composition
          </span>
        </div>
        <Tooltip ComponentId="1268" />
      </div>
    )
  }

  const ClosePopupCallBack = React.useCallback(() => {
    setEditSiteCompositionStatus(false);
    Callback();
  }, [])

  // const SiteCompositionCallBack = React.useCallback((Data: any, Type: any) => {
  //   datas.props.Sitestagging = Data.ClientTime?.length > 0 ? JSON.stringify(Data.ClientTime) : [];
  //   datas.props.ClientCategory.results = Data.selectedClientCategory;
  //   // if (datas?.props.Sitestagging != undefined) {
  //   //   if (datas?.props?.ClientCategory?.length > 0 || datas?.props.Sitestagging != undefined) {
  //   //     GetSmartMetaData(datas?.props?.ClientCategory, datas?.props?.Sitestagging);
  //   //   } else if (datas?.props?.ClientCategory?.results?.length > 0 || datas?.props.Sitestagging != undefined)
  //   //     GetSmartMetaData(datas?.props?.ClientCategory?.results, datas?.props?.Sitestagging);
  //   // }
  //   setKey((prevKey) => prevKey + 1);
  // }, [])
  return (
    <>
      {!isDirectPopup && (<dl key={key} className="Sitecomposition PortfioP">
        <details open>
          <summary className="alignCenter">
            <label className="toggler full_width">
              <a className="pull-left">
                Site Composition
              </a>
              <p className="input-group-text mb-0 pb-0" title="Edit Site Composition" onClick={() => setEditSiteCompositionStatus(true)}>
                <span className="svg__iconbox svg__icon--editBox"></span>
              </p>
            </label>
          </summary>
          <div className="border border-top-0 p-2">
            <ul className="p-0 m-0">
              {ClientTimeArray?.map((cltime: any, i: any) => {
                if (cltime.Title != "CompositionHistoryArray") {
                  return (
                    <li className="Sitelist">
                      <span>
                        <img style={{ width: "22px" }} src={`${GetSiteIcon(cltime?.Title)}`} />
                      </span>
                      {cltime?.ClienTimeDescription != undefined &&
                        <span>
                          {Number(cltime?.ClienTimeDescription).toFixed(2)}%
                        </span>
                      }
                      <span className="d-inline">
                        {cltime.ClientCategory != undefined && cltime.ClientCategory.length > 0 ? cltime.ClientCategory?.map((clientcat: any, Index: any) => {
                          return (
                            <p className={Index == cltime.ClientCategory?.length - 1 ? "mb-0" : "mb-0 border-bottom"}>{clientcat.Title}</p>
                          )
                        }) : null}
                      </span>
                    </li>
                  )
                }
              })}
            </ul>
          </div>
        </details>
      </dl>
      )}

      <Panel
        onRenderHeader={onRenderCustomCalculateSC}
        isOpen={EditSiteCompositionStatus}
        onDismiss={() => ClosePopupCallBack()}
        isBlocking={EditSiteCompositionStatus}
        type={PanelType.custom}
        customWidth="900px"
      >
        <div className={ServicesTaskCheck ? "serviepannelgreena pt-3" : "pt-3"}>
          {EditSiteCompositionStatus && AllSitesData?.length > 0 ? <SiteCompositionComponent
            AllListId={datas?.sitedata}
            ItemId={datas?.props?.Id}
            siteUrls={siteUrl}
            SiteTypes={AllSitesData}
            ClientTime={datas?.props?.siteCompositionData != undefined ? datas.props.siteCompositionData : []}
            SiteCompositionSettings={datas?.props?.SiteCompositionSettings}
            selectedComponent={datas?.props}
            // callBack={SiteCompositionCallBack}
            isServiceTask={datas?.props?.Portfolio_x0020_Type == "Service" ? true : false}
            usedFor={"Component-Profile"}
            closePopupCallBack={ClosePopupCallBack}
            SelectedClientCategory={selectedClientCategory}
          /> : null}
        </div>
      </Panel>
    </>
  );
}

