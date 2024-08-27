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
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    let context = props?.props?.Context;
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

            // Extract years from the event dates
            const years = data.reduce((acc: number[], item: any) => {
                const eventYear = new Date(item.EventDate).getFullYear();
                if (acc.indexOf(eventYear) === -1) {
                    acc.push(eventYear);
                }
                return acc;
            }, []);

            // Sort years in descending order and set available years
            const sortedYears = years.sort((a:any, b:any) => b - a);
            setAvailableYears(sortedYears);
            setSelectedYear(sortedYears[0]);

            // Format and set events data
            const formattedEvents = data.map((item: any) => {
                item.StartDate = moment(item.EventDate).format('DD MMM YYYY');
               item.EndDates = moment(item.EndDate || item.EventDate).format('DD MMM YYYY');
                item.FirstDate = moment(item.EventDate).format('YYYY-MM-DD');
                item.LastDate = moment(item.LastDate).format('YYYY-MM-DD');
                item.Locations = item.Location != null ? (item.Location) : "";
                return item;
            });

            setFindEvents(formattedEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEventsByYear = (year: number) => {
        return findEvents.filter((item: any) => {
            const eventYear = new Date(item.EventDate).getFullYear();
            return eventYear === year && item.Event_x002d_Type === "Event" && (item.Title !== null && item.Title !== undefined);
        });
    };

    const EditItem = (itemId: any) => {
        setisEditModalOpen(true);
        setSelectedItem(itemId);
    };

    const closeEditPopup = () => {
        setisEditModalOpen(false);
        LoadEvents();
    };

    const changeHeader = (items: any) => {
        setchangeHeader(items);
    };

    const sanitizeHtml = (html: any) => {
        return html.replace(/<[^>]*(class="[^"]*"|style="[^"]*")[^>]*>|<[^>]*>/g, '');
    };

    const handleYearButtonClick = (year: number) => {
        setSelectedYear(year);
    };

    return (
        <>
            <div className='event_home'>
                <h2 className='heading siteColor'>Events Home
                   <span>{<EditPage context={context} changeHeader={changeHeader} />}</span> 
                </h2>

                <div id='tabs' className='exTab3  mt-15'>
                    <ul className="nav nav-tabs" id="eventTab" role='tablist'>
                        {availableYears.map((year) => (
                            <button 
                                key={year}
                                className={`nav-link${selectedYear === year ? ' active' : ''}`} 
                                type='button' 
                                role='tab' 
                                aria-selected={selectedYear === year} 
                                onClick={() => handleYearButtonClick(year)}
                            >
                                {year}
                            </button>
                        ))}
                        <span className='ml-auto mt-2 siteColor'>
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
                    <div className='col-lg-12 px-3 py-3 clearfix'>
                    {selectedYear && filterEventsByYear(selectedYear).map((item: any, index: any) => {
                        const startDateParts = item.StartDate.split(' ');
                        const startDateWithoutYear = startDateParts.slice(0, 2).join(' ');
                        return (
                            <div key={index} className="publicationItem has-shadow">
                                <div className="entry-meta">
                                    <IoCalendarOutline />
                                    <strong>
                                        {item.StartDate === item.EndDates || item.Title.includes("Company Holiday") || item.Title.includes("National Holiday") ? (
                                            item.Location != null ? <span>{`${item.StartDate} in ${item.Locations}`}</span> : <span>{item.StartDate}</span>
                                        ) : (
                                            item.Location != null ? <span>{`${startDateWithoutYear} to ${item.EndDates} in ${item.Locations}`}</span> : <span>{`${startDateWithoutYear} to ${item.EndDates}`}</span>
                                        )}
                                    </strong>
                                    <span title="Edit" onClick={() => EditItem(item)} className="alignIcon svg__icon--edit svg__iconbox ml-auto"></span>
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
                                    {item.Description != null && (!item.Description.includes("html") ? (<div dangerouslySetInnerHTML={{ __html: item.Description }}></div>) : null)}
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>

            {isEditModalOpen && 
                <EventEditPopup callBack={closeEditPopup} EditEventData={selectedItemId} AllListId={props?.props} Context={context} editdocpanel={isEditModalOpen} />
            }
        </>
    );
}

export default EventHome;
