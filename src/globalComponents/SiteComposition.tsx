import * as React from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import pnp, { Web } from "sp-pnp-js";
import SiteCompositionComponent from "../webparts/EditPopupFiles/PortfolioSiteCompsition";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../globalComponents/Tooltip'
var myarray4: any = [];
let ClientTimeArray: any[] = [];
var SiteTypeBackupArray: any = [];
import * as Moment from 'moment';


export default function Sitecomposition(datas: any) {
  const [show, setshows] = React.useState(false);
  const [EditSiteCompositionStatus, setEditSiteCompositionStatus] = React.useState(false);
  const [showComposition, setshowComposition] = React.useState(true);
  const [smartMetaDataIcon, setsmartMetaDataIcon] = React.useState([]);
  const [selectedClientCategory, setselectedClientCategory] = React.useState([]);
  const [AllSitesData, setAllSitesData] = React.useState([]);
  const [renderCount, setRenderCount] = React.useState(0);
  let BackupSiteTaggingData: any = [];
  let BackupClientCategory: any = [];
  let siteUrl: any = datas?.sitedata?.siteUrl;
  const ServicesTaskCheck: any = false;
  React.useEffect(() => {
    getsmartmetadataIcon();
    if (datas?.props?.ClientCategory?.results?.length > 0 || datas?.props.Sitestagging != undefined) {
      GetSmartMetaData(datas?.props?.ClientCategory?.results, datas?.props?.Sitestagging);
    }
    // if (datas?.props?.ClientCategory?.results?.length > 0) {
    //   setselectedClientCategory(datas.props.ClientCategory.results);
    // }
    if (datas?.props.Sitestagging != undefined) {
      datas.props.siteCompositionData = JSON.parse(datas?.props.Sitestagging);
    } else {
      datas.props.siteCompositionData = [];
    }

  }, [])
  const GetSmartMetaData = async (ClientCategory: any, ClientTime: any) => {
    const array2: any[] = [];
    let ClientTime2: any[] = [];
    if (ClientTime != null) {
      ClientTime2 = JSON.parse(ClientTime);
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
      .select('Id', 'Title', 'Item_x0020_Cover', 'TaxType', 'siteName', 'siteUrl', 'Item_x005F_x0020_Cover', 'listId', 'Configurations')
      .filter("TaxType eq 'Sites'").top(4000)
      .get().then((data: any) => {
        setsmartMetaDataIcon(data);
        data?.map((site: any) => {
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
        <Tooltip ComponentId="1626" />
      </div>
    )
  }

  const ClosePopupCallBack = React.useCallback(() => {
    setEditSiteCompositionStatus(false);
    if (datas?.props?.ClientCategory?.results?.length > 0 || datas?.props.Sitestagging != undefined) {
      GetSmartMetaData(datas?.props?.ClientCategory?.results, datas?.props?.Sitestagging);
    }
    // setRenderCount(renderCount + 1)
  }, [])

  const SiteCompositionCallBack = React.useCallback((Data: any, Type: any) => {
    datas.props.Sitestagging = Data.ClientTime?.length > 0 ? JSON.stringify(Data.ClientTime) :[];
    datas.props.ClientCategory.results = Data.selectedClientCategory;
  }, [])
  return (
    <>
      <dl className="Sitecomposition">
        <div className='dropdown'>
          <a className="sitebutton bg-fxdark d-flex "
          >
            <span onClick={() => showhideComposition()} >
              {showComposition ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
            </span>
            <div className="d-flex justify-content-between full-width">
              <p className="pb-0 mb-0">Site Composition</p>
              <p className="input-group-text mb-0 pb-0" title="Edit Site Composition" onClick={() => setEditSiteCompositionStatus(true)}>
                <span className="svg__iconbox svg__icon--editBox"></span>
              </p>
            </div>
          </a>
          <div className="spxdropdown-menu"
            style={{ display: showComposition ? 'block' : 'none' }}
          >
            <ul>
              {ClientTimeArray?.map((cltime: any, i: any) => {
                return <li className="Sitelist">
                  <span>
                    <img style={{ width: "22px" }} src={`${GetSiteIcon(cltime?.Title)}`} />
                  </span>
                  {cltime?.ClienTimeDescription != undefined &&
                    <span>
                      {Number(cltime?.ClienTimeDescription).toFixed(2)}%
                    </span>
                  }
                  {cltime.ClientCategory != undefined && cltime.ClientCategory.length > 0 ? cltime.ClientCategory?.map((clientcat: any) => {
                    return (
                      <span>{clientcat.Title}</span>
                    )
                  }) : null}
                </li>
              })}
            </ul>
          </div>
        </div>
      </dl>
      <Panel
        onRenderHeader={onRenderCustomCalculateSC}
        isOpen={EditSiteCompositionStatus}
        onDismiss={() => setEditSiteCompositionStatus(false)}
        isBlocking={EditSiteCompositionStatus}
        type={PanelType.custom}
        customWidth="1024px"
      >
        <div className={ServicesTaskCheck ? "serviepannelgreena pt-3" : "pt-3"}>
          {EditSiteCompositionStatus ? <SiteCompositionComponent
            AllListId={datas?.sitedata}
            ItemId={datas?.props?.Id}
            siteUrls={siteUrl}
            SiteTypes={AllSitesData}
            ClientTime={datas?.props?.siteCompositionData != undefined ? datas.props.siteCompositionData : []}
            SiteCompositionSettings={datas?.props?.SiteCompositionSettings}
            // currentListName={EditData.siteType}
            callBack={SiteCompositionCallBack}
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

