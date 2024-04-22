import * as React from 'react';
import { Web } from 'sp-pnp-js';
import SmartMetadataEditPopup from '../../hhhhSmartMetadataPortfolio/components/SmartMetadataEditPopup';
import GrueneWeltweitForm from "./GrueneWeltweitForm"
import WahlWeltweit from './WahlWeltweit';
import Briefwahl2021 from './Briefwahl2021';
let AllMetaDataItems: any = [];
let SmartId: any;
export default function GrueneSmartPages(props: any) {
    const [smartPageItem, setSmartPageItem]: any = React.useState([]);
    const [SmartMetadataEditPopupOpen, setSmartMetadataEditPopupOpen]: any = React.useState(false);
    React.useEffect(() => {
        loadSmartpage();
    }, [])
    const getParameterByName = (name: any) => {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        const results = regex.exec(window.location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    const loadSmartpage = async () => {
        try {
            SmartId = getParameterByName('SmartId').trim();
            let web = new Web(props?.AllList?.SitesListUrl);
            AllMetaDataItems = await web.lists.getById(props?.AllList?.SmartMetadataListID).items.select("*,Author/Title,Editor/Title,Parent/Id,Parent/Title&$expand=Parent,Author,Editor&$orderby=Title").filter(`Id eq ${SmartId}`).getAll();
            AllMetaDataItems?.map((item: any) => {
                const tempElement = document.createElement('div');
                const textarea = document.createElement('textarea');
                if (item?.PageContent !== null) {
                    textarea.innerHTML = item?.PageContent;
                    textarea.value;
                    tempElement.innerHTML = textarea.value;
                    removeExternalClass(tempElement);
                    item.PageContent = tempElement.innerHTML
                }
                if (item?.ShortDescription !== null) {
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
    return (
        <>
            {smartPageItem[0]?.Title != "Warum aus dem Ausland wählen?" && smartPageItem[0]?.Title != "Europawahl-2024 - Briefwahl Suchmaschine" ? (
                <><section id="page-title" className="page-title-parallax page-title-dark skrollable skrollable-between SmartPages" style={{
                    backgroundImage: `url("https://www.gruene-washington.de/PhotoGallery/SiteCollectionImages/default_coverImg.jpg")`,
                    backgroundPosition: `0px -117.949px`
                }}
                    data-bottom-top="background-position:0px 300px;"
                    data-top-bottom="background-position:0px -300px;"
                >
                    <div className="container text-center clearfix">
                        <h1 className="nott mb-3" style={{ fontSize: '54px' }}>
                            {smartPageItem[0]?.Title}
                            {(<a> <i className="ms-Icon ms-Icon--WindowEdit ms-auto light" aria-hidden="true" title="Edit" onClick={EditSmartMetadataPopup}></i>
                            </a>)}
                        </h1>
                        <section className="container section SmartPages">
                            <div dangerouslySetInnerHTML={{ __html: smartPageItem[0]?.ShortDescription }}></div>
                        </section>
                    </div>
                </section><section className="container section SmartPages">
                        <div dangerouslySetInnerHTML={{ __html: smartPageItem[0]?.PageContent }}></div>
                    </section></>
            ) : (smartPageItem[0]?.Title != "Europawahl-2024 - Briefwahl Suchmaschine" && <WahlWeltweit />
            )}
            {smartPageItem[0]?.Title == "Grüne Weltweit" ? <GrueneWeltweitForm AllList={props.AllList} /> : ''}
            {smartPageItem[0]?.Title == "Europawahl-2024 - Briefwahl Suchmaschine" ? <Briefwahl2021/> : ''}
            {SmartMetadataEditPopupOpen ? <SmartMetadataEditPopup AllList={props.AllList} CloseEditSmartMetaPopup={CloseEditSmartMetaPopup} modalInstance={smartPageItem[0]} AllMetadata={AllMetaDataItems} /> : ''}
            {/* <RelevantNews AllList={props.AllList}/> */}
        </>
    );
}