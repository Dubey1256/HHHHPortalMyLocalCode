import moment from 'moment';
import React from 'react';
import { Web } from "sp-pnp-js";
import $ from "jquery";
import Editpopup from './EventEditPopup';
import { IoCalendarOutline } from 'react-icons/io5';

let AlleventsItem: any = [];
let EventlistId: any = '';
let SmartMetadataListID: any = '';
const EventDetailmain = (props: any) => {
    const propsValue = props?.props;
    const Url = window.location.search;
    const ItemId = Number(Url?.split("?ItemId=")[1]?.split('&Site=')[0]);
    const Site = Url?.split("?ItemId=")[1]?.split('&Site=')[1];
    const [SitesConfig, setSitesConfig] = React.useState<any>([]);
    const [EventItem, setEventItem] = React.useState([]);
    const [iseditOpen, setiseditOpen] = React.useState(false);
    const [AddEditEventvalue, setAddEditEventvalue] = React.useState<any>([]);
    var allListId: any = {};

    const IsItemExists = (arr: any, Itm: any) => {
        var isExists: any = false;
        arr.map((item: any) => {
            if (item.Id == Itm.Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const loadAllsiteEvents = () => {
        let eventitem: any = [];
        try {
            const web = new Web(propsValue?.siteUrl);
            web.lists.getById('860a08d5-9711-4d8e-bd26-93fe09362bd4').items
                .select('ID', 'Title', 'FileLeafRef', 'Created', 'Item_x0020_Cover', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Title', 'Editor/Id', 'Description', 'EventDate', 'EndDate', 'Location')
                .expand("Author", "Editor")
                .filter(`Id eq ${ItemId}`)
                .getAll()
                .then((results: any) => {
                    eventitem = results;
                    if (eventitem != undefined && eventitem?.length > 0) {
                        if (eventitem[0]?.EventDate != undefined)
                            eventitem[0].EventDate = moment(eventitem[0].EventDate).format("DD MMM YYYY");

                        if (eventitem[0]?.EndDate != undefined)
                            eventitem[0].EndDate = moment(eventitem[0].EndDate).format("DD MMM YYYY");

                        if (eventitem[0].Created !== undefined)
                            eventitem[0].Created = moment(eventitem[0].Created).format("DD MMM YYYY");

                        if (eventitem[0].Modified)
                            eventitem[0].Modified = moment(eventitem[0].Modified).format("DD MMM YYYY");

                        eventitem[0].EventDescription1 = '';
                        if (eventitem[0]?.Description !== undefined && eventitem[0]?.Description !== null && eventitem[0]?.Description !== '')
                            eventitem[0].EventDescription1 = $.parseHTML(eventitem[0].Description)[0].textContent;
                    }

                    setEventItem(eventitem);
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        catch (e) {
            console.log(e)
        }

    }
    const openEditEventPopup = (evntitem: any) => {
        setiseditOpen(true);
        setAddEditEventvalue(evntitem)
    }
    const callBack = () => {
        setiseditOpen(false);
        loadAllsiteEvents()
    }
    React.useEffect(() => {
        loadAllsiteEvents();
    }, []);

    return (
        <>

            <section>
                <div className="publicationItem has-shadow">
                    {EventItem.length > 0 && EventItem.map((Item: any) => {
                        return (<div className="col-sm-12 mt-10 mb-10" key={Item.Id}>
                            {/* <div className="alignCenter">
                                <span className='alignCenter gap-1 pull-left'>
                                    <span className="svg__iconbox svg__icon--calendar"></span>
                                    {Item?.EventDate != undefined && <span>{Item?.EventDate}</span>}
                                    <span className="svg__iconbox svg__icon--edit ml-5" onClick={() => openEditEventPopup(Item)}></span>
                                </span>
                                <a className="ml-auto" href={`${propsValue?.siteUrl}/SitePages/EventsHome.aspx`} target='_blank' data-interception="off">
                                    Back to all Events
                                </a>
                            </div> */}
                            <div className="entry-meta">
                                <IoCalendarOutline />
                                <strong>
                                    {Item?.EventDate != undefined && <span>{Item?.EventDate}</span>}
                                </strong>
                                <span title="Edit" onClick={() => openEditEventPopup(Item)} className="svg__icon--edit svg__iconbox"></span>
                                <a className="ml-auto" href={`${propsValue?.siteUrl}/SitePages/EventsHome.aspx`} target='_blank' data-interception="off">
                                    Back to all Events
                                </a>
                            </div>
                            <div className="spotlighttitle valign-middle">
                                <h4 className="f-600">
                                    <a className="hreflink">{Item?.Title}</a>
                                </h4>
                            </div>
                            <div className="entry-content clearfix">
                                {Item?.Item_x0020_Cover == undefined && <div className="col-sm-12 pad0">
                                        <div dangerouslySetInnerHTML={{ __html: Item?.Description }}></div>
                                </div>}
                                {Item?.Item_x0020_Cover != undefined && <div className="col-sm-12 pad0">
                                    <div className="col-sm-2" id="imagedetail">
                                        <img className="image" src={Item?.Item_x0020_Cover.Url} />
                                    </div>
                                    <div id="marg-p">
                                        <span dangerouslySetInnerHTML={{ __html: Item?.Description }}></span>
                                    </div>
                                </div>}
                            </div>
                            <div className="clearfix"></div>
                            <div className="col-md-12 ItemInfo" style={{ paddingTop: '15px' }}>
                                <div>
                                    Created <span>{Item?.Created}</span> by <span className="footerUsercolor">{Item?.Author?.Title}</span>
                                </div>
                                <div>
                                    Last modified <span>{Item?.Modified}</span> by <span className="footerUsercolor">{Item?.Editor?.Title}</span>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>

            </section>
            {iseditOpen && <Editpopup EditEventData={AddEditEventvalue} Context={propsValue?.Context} callBack={callBack} />}
        </>
    )
}
export default EventDetailmain;
