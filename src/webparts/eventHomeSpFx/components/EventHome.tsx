import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Web } from 'sp-pnp-js';
import EditPage from '../../../globalComponents/EditPanelPage/EditPage';
import EventEditPopup from './EventEditPopup';
import { IoCalendarOutline } from 'react-icons/io5';

const EventHome = (props: any) => {
    const [findEvents, setFindEvents]: any = useState([]);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
    const [selectedItemId, setSelectedItem] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [Header, setchangeHeader]: any = useState([]);

    let findDataYear: any
    let context = props?.props?.Context
    context.siteUrl = context?.pageContext?.web?.absoluteUrl;
    context.SitePagesList = props?.props?.SitePagesList;

    useEffect(() => {
        LoadEvents();
    }, []);
    const LoadEvents = async () => {
        setLoading(true); 
        let web = new Web(props?.props?.siteUrl);
        try {
            const data: any = await web.lists.getById(props?.props?.EventsListID).items.select("Id,Title,EndTime,EndDate,EventDate,Event_x002d_Type,Location,ItemRank,Description,Author/Id,Author/Title,Editor/Id,Editor/Title,Event_x002d_Type,EventDescription").expand("Author,Editor").getAll();

            // Filter events based on the selected year
            const filteredEvents = data.filter((item: any) => {
                const eventYear = new Date(item.EventDate).getFullYear();
                let yearlydata: any = 2024;
                if (findDataYear === undefined) {
                    return (
                        eventYear === yearlydata &&
                        item.Event_x002d_Type === "Event" &&
                        (item.Title !== null && item.Title !== undefined)
                    );
                } else {
                    return (
                        eventYear === findDataYear &&
                        item.Event_x002d_Type === "Event" &&
                        (item.Title !== null && item.Title !== undefined)
                    );
                }
            });

            filteredEvents.forEach((item: any) => {
                item.StartDate = moment(item.EventDate).format('DD MMM YYYY');
                item.EndDates = moment(item.EndDate).format('DD MMM YYYY');
                item.FirstDate = moment(item.EventDate).format('YYYY-MM-DD');
                item.LastDate = moment(item.LastDate).format('YYYY-MM-DD');
                item.Locations = item.Location != null ? (item.Location) : "";
            });

            setFindEvents(filteredEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false); // Set loading state to false after fetching data
        }
    };

    const EditItem = (itemId: any) => {
        setisEditModalOpen(true)
        setSelectedItem(itemId)
    }

    const closeEditPopup = () => {
        setisEditModalOpen(false)
        LoadEvents();
    }
    const changeHeader = (items: any) => {
        setchangeHeader(items)
    }

    const sanitizeHtml = (html: any) => {
        // Remove HTML tags and inline CSS styles
        return html.replace(/<[^>]*(class="[^"]*"|style="[^"]*")[^>]*>|<[^>]*>/g, '');
    };


    const handleYearButtonClick = (year: number) => {
        if (findDataYear !== year) {
            findDataYear = year
            LoadEvents();
        }
    }

    return (
        <>
            <div>
                <span style={{ cursor: "pointer" }}>AdminIn preparationEventsHome</span>
            </div><br></br>
            <div className='event_home'>
                <span className='heading siteColor'>Events Home
                    {<EditPage context={context} changeHeader={changeHeader} />}
                </span>

                <div id='tabs' className='exTab3'>
                    <ul className="nav nav-tabs" id="eventTab" role='tablist'>
                        <button className={`nav-link${findDataYear === 2024 ? ' active' : ''}`} type='button' role='tab' aria-selected='true' onClick={() => handleYearButtonClick(2024)} >2024</button>
                        <button className={`nav-link${findDataYear === 2023 ? ' active' : ''}`} type='button' role='tab' aria-selected='true' onClick={() => handleYearButtonClick(2023)} >2023</button>
                        <button className={`nav-link${findDataYear === 2022 ? ' active' : ''}`} type='button' role='tab' aria-selected='true' onClick={() => handleYearButtonClick(2022)} >2022</button>
                        <button className={`nav-link${findDataYear === 2021 ? ' active' : ''}`} type='button' role='tab' aria-selected='true' onClick={() => handleYearButtonClick(2021)} >2021</button>
                        <span className='ml-auto mt-2 siteColor' >
                            <a
                                target="_blank"
                                data-interception="off"
                                href={`${props?.props?.siteUrl}/SitePages/EventTool.aspx`}
                            >
                                Create Event
                            </a>
                        </span>
                    </ul>
                    
                </div>
                <div className="tab-content border border-top-0">
                    {
                        findEvents.map((item: any, index: any) => {
                            const startDateParts = item.StartDate.split(' ');
                            const startDateWithoutYear = startDateParts.slice(0, 2).join(' ');
                            return (
                                <div className='col-lg-12 px-3 py-3 clearfix'>
                                    <div key={index} className="publicationItem has-shadow">
                                        <div className="entry-meta">
                                            <IoCalendarOutline />
                                            <strong>
                                                {item.StartDate === item.EndDates || (item.Title.includes("Company Holiday") || (item.Title.includes("National Holiday"))) ? (
                                                    (item.Location != null ? (<span>{`${item.StartDate} in ${item.Locations}`}</span>) : (<span>{item.StartDate}</span>))
                                                ) : (
                                                    item.Location != null ? (<span>{`${startDateWithoutYear} to ${item.EndDates}in ${item.Locations}`}</span>) : (<span>{`${startDateWithoutYear} to ${item.EndDates}`}</span>)
                                                )}
                                            </strong>
                                            <span title="Edit" onClick={() => EditItem(item)} className="alignIcon svg__icon--edit svg__iconbox ml-auto"
                                            ></span>
                                        </div>
                                        <div className="spotlighttitle valign-middle">
                                            <h4 className="f-600">
                                                <a
                                                    target="_blank"
                                                    data-interception="off"            
                                                    href={`${props?.props?.siteUrl}/SitePages/EventDetail.aspx?ItemId=${item.Id}&Site=${props?.props?.siteType}`}
                                                >
                                                    {item.Title}
                                                </a>
                                            </h4>

                                        </div>
                                        <div className="entry-content clearfix">
                                            {item.Description != null && (item.Description.includes("html") ? ("") : (<div dangerouslySetInnerHTML={{ __html: item.Description }}></div>))}

                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            );
                        }
                        )}
                </div>
            </div>

            {isEditModalOpen ?
                <EventEditPopup callBack={closeEditPopup} EditEventData={selectedItemId} AllListId={props?.props} Context={context} editdocpanel={isEditModalOpen} />
                :
                null
            }
        </>
    )
}

export default EventHome;