import * as React from 'react';
import { Web } from 'sp-pnp-js';
import SmartMetadataEditPopup from '../../hhhhSmartMetadataPortfolio/components/SmartMetadataEditPopup';
import { RelevantWebPart } from '../../../globalComponents/RelevantWebPart';
import ILFnSPAnCTool from '../../../globalComponents/ILFnSPAnCTool';
//import GrueneWeltweitForm from '../../smartpages/components/GrueneWeltweitForm';
let AllMetaDataItems: any = [];
export default function SPProfilePages(props: any) {
    const [smartPageItem, setSmartPageItem]: any = React.useState([]);
    const [backgroundimage, setbackgroundimage] = React.useState('');
    const [SmartMetadataEditPopupOpen, setSmartMetadataEditPopupOpen]: any = React.useState(false);
    React.useEffect(() => {
        loadProfilePages();
    }, [])
    const siteName = props?.AllList?.siteName;
    const getParameterByName = (name: any) => {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        const results = regex.exec(window.location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    const loadProfilePages = async () => {
        try {
            const SmartID = getParameterByName('SmartID').trim();
            let web = new Web(props?.AllList?.SitesListUrl);
            AllMetaDataItems = await web.lists.getById(props?.AllList?.SmartMetadataListID).items.select("*,Author/Title,Editor/Title,Parent/Id,Parent/Title&$expand=Parent,Author,Editor&$orderby=Title").filter(`Id eq ${SmartID}`).getAll();
            AllMetaDataItems?.map((item: any) => {
                const tempElement = document.createElement('div');
                const textarea = document.createElement('textarea');
                if (item?.Item_x0020_Cover?.Url === undefined || item?.Item_x0020_Cover?.Url === null) {
                    setbackgroundimage('');
                }
                else {
                    if (item?.Item_x0020_Cover?.Url !== undefined) {
                        const baseUrl = item?.Item_x0020_Cover?.Url.split('/PublishingImages/')[0] + '/PublishingImages/';
                        const dynamicPart = item?.Item_x0020_Cover?.Url?.split('/PublishingImages/')[1];
                        const encodedDynamicPart = encodeURIComponent(dynamicPart).replace(/\(/g, '%28').replace(/\)/g, '%29');
                        const fullUrl = `${baseUrl}${encodedDynamicPart}`;
                        setbackgroundimage(fullUrl);
                    }
                }
                if (item?.PageContent !== null && item?.PageContent !== undefined) {
                    textarea.innerHTML = item?.PageContent;
                    textarea.value;
                    tempElement.innerHTML = textarea.value;
                    removeExternalClass(tempElement);
                    item.PageContent = tempElement.innerHTML
                }
                if (item?.ShortDescription !== null && item?.ShortDescription !== undefined) {
                    textarea.innerHTML = item?.ShortDescription;
                    textarea.value;
                    tempElement.innerHTML = textarea.value;
                    removeExternalClass(tempElement);
                    item.ShortDescription = tempElement.innerHTML
                }
            })
            setSmartPageItem(AllMetaDataItems);
        } catch (error) {
            console.error(error);
        }
    }
    // Functionality Implemented and Developed by GCDP with collaboration with VA,AT.
    function removeExternalClass(element: any) {
        if (element?.nodeType === 1 && element?.tagName?.toLowerCase() === 'div') {
            if (element?.className?.includes('ExternalClass')) {
                {
                    element?.removeAttribute('class');
                }
            }
            for (let i = 0; i < element?.childNodes?.length; i++) {
                removeExternalClass(element?.childNodes[i]);
            }
        }
    }
    const EditSmartMetadataPopup = () => {
        setSmartMetadataEditPopupOpen(true);
    };
    const CloseEditSmartMetaPopup = () => {
        setSmartMetadataEditPopupOpen(false);
    };
    const Header_image = {
        backgroundImage: `url(${backgroundimage})`,
        backgroundPosition: `0px -117.949px`
    }
    const AncCallback = React.useCallback(() => {

    }, []);
    return (
        <>
            <>
                <section id="page-title" className="page-title-parallax page-title-dark skrollable skrollable-between SmartPages" style={Header_image}
                    data-bottom-top="background-position:0px 300px;" data-top-bottom="background-position:0px -300px;">
                    <span className="hover-text  SmartPages-editIcon" title='Edit Page Content'>
                        <i onClick={EditSmartMetadataPopup} className="ms-Icon light ms-Icon--WindowEdit" aria-hidden="true"></i>
                    </span>
                    <div className="container text-center clearfix">
                        <h1 className="nott mb-3" style={{ fontSize: '54px' }}>
                            {smartPageItem[0]?.Title}
                        </h1>
                        <section className="container section SmartPages">
                            <div dangerouslySetInnerHTML={{ __html: smartPageItem[0]?.ShortDescription }}></div>
                        </section>
                    </div>
                </section>
                <div className='mt-2 row'>
                    <div className='col-sm-9'>
                        <section className="container section SmartPages">
                            {smartPageItem[0]?.ItemCover?.Url != undefined &&
                                <img style={{ width: '270px', marginRight: '10px' }} className="pull-left" src={smartPageItem[0]?.ItemCover?.Url} />}
                            <p dangerouslySetInnerHTML={{ __html: smartPageItem[0]?.PageContent }}>
                            </p>
                        </section>
                        {smartPageItem[0]?.Id != undefined &&
                            props.AllList != undefined && (
                                <RelevantWebPart
                                    webpartId={"SmartTopicProfileAnCToolWebpartId"}
                                    KeyDoc={true}
                                    usedFor={"Documents"}
                                    AllListId={props.AllList}
                                    callBack={AncCallback}
                                    Item={smartPageItem[0]}
                                />
                            )}
                    </div>
                    <div className='col-sm-3'>
                        <section className="section">
                            {smartPageItem[0]?.Id != undefined &&
                                props.AllList != undefined && (
                                    <ILFnSPAnCTool
                                        webpartId={"SmartTopicProfileAnCToolWebpartId"}
                                        defaultFolder={"SmartTopic"}
                                        AllListId={props.AllList}
                                        callBack={AncCallback}
                                        Item={smartPageItem[0]}
                                    />
                                )}
                            {smartPageItem[0]?.Id != undefined && props.AllList != undefined && <RelevantWebPart webpartId={"SmartTopicProfileAnCToolWebpartId"} usedFor={'Documents'} AllListId={props.AllList} callBack={AncCallback} Item={smartPageItem[0]} />}
                            {smartPageItem[0]?.Id != undefined && props.AllList != undefined && <RelevantWebPart webpartId={"SmartTopicProfileAnCToolWebpartId"} usedFor={'Announcements'} AllListId={props.AllList} callBack={AncCallback} Item={smartPageItem[0]} />}
                            {smartPageItem[0]?.Id != undefined && props.AllList != undefined && <RelevantWebPart webpartId={"SmartTopicProfileAnCToolWebpartId"} usedFor={'Events'} AllListId={props.AllList} callBack={AncCallback} Item={smartPageItem[0]} />}
                        </section>
                    </div>
                </div>
            </>

            {SmartMetadataEditPopupOpen ? <SmartMetadataEditPopup AllList={props?.AllList} CloseEditSmartMetaPopup={CloseEditSmartMetaPopup} modalInstance={smartPageItem[0]} AllMetadata={AllMetaDataItems} /> : ''}
        </>
    );
}