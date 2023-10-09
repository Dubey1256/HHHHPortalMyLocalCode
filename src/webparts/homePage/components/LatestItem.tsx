import React, { useEffect, useState } from 'react'
import { Web } from "sp-pnp-js";
import moment from "moment";
import Tooltip from '../../../globalComponents/Tooltip';

const LatestItems = (props: any) => {
    var baseUrl=props.props.context._pageContext._web.absoluteUrl;
    const [Announcements, setListData] = useState([])
    const [LatestEventItems, setLatestEventItemsData] = useState([])
    const [Events, setEventsListData] = useState([])
    const [Documents, setDocumentsListData] = useState([])
    const [FeaturedNews, setNewsItemsData] = useState([])
   

        const getLastestNewsItem = () => {
            let web = new Web(baseUrl);
            web.lists.getById(props.props.AnnouncementsListId).items.select("Id", "Title", "ItemRank", "Body", "SortOrder", "Created", "Modified").orderBy('Created',false).getAll().then((response: any) => {
                response.map((item: any) => {
                    if (item.Created != undefined) {
                        item.CreatedDate = moment(item.Created).format("DD MMM YYYY");
                    }
                })
                let finalData:any = response?.reverse();
                setListData(finalData);


            }).catch((error: any) => {
                console.error(error);
            });

        }
        const getLastestEventsItem = () => {
            let web = new Web(baseUrl);
            web.lists.getById(props.props.EventsListId).items.select("Id", "Title", "Item_x0020_Cover", "ItemRank", "EventDescription", "EventDate", "EndDate","Location","Created", "Modified").filter('ItemRank eq 7').orderBy('Created',true).getAll().then((data: any) => {
                data.map((item: any) => {
                    if (item.Created != undefined) {
                        item.CreatedDate = moment(item.Created).format("DD MMM YYYY");
                        item.EventDate = moment(item.EventDate).format("DD MMM YYYY");
                        item.EndDate = moment(item.EndDate).format("DD MMM YYYY");
                    }
                })
                let finalEventData:any = data?.reverse();
                setLatestEventItemsData(finalEventData);


            }).catch((error: any) => {
                console.error(error);
            });

        }
        const loadNews = () => {
            let web = new Web(baseUrl);
            web.lists.getById(props.props.AnnouncementsListId).items.select("Id", "Title", "Item_x0020_Cover", "ItemRank", "Body", "SortOrder", "Created", "Modified").filter('ItemRank eq 7').orderBy('Created',true).getAll().then((data: any) => {
                data.map((item: any) => {
                    item.ItemType = 'News';
                    if (item.ItemRank != undefined && item.ItemRank >= 7) {
                        item.Item_x0020_Cover = item.Item_x0020_Cover;
                        item.Title = item.Title;   
                        item.Body = item.Body;                     
                        item.CreatedDate = moment(item.Created).format("DD MMM YYYY");
                    }
                })
                let finalLoadNews:any = data?.reverse();
                setNewsItemsData(finalLoadNews);

            }).catch((error: any) => {
                console.error(error);
            });

        }
        const loadEventsItems = () => {
            let web = new Web(baseUrl);
            web.lists.getById(props.props.EventsListId).items.select("Id", "Title", "Item_x0020_Cover", "ItemRank", "EventDescription", "EventDate", "EndDate","Location","Created", "Modified").filter('ItemRank eq 7').orderBy('Created',true).getAll().then((data: any) => {
                data.map((item: any) => {
                    item.ItemType = 'Events';
                    if (item.ItemRank != undefined && item.ItemRank >= 7) {
                        item.Item_x0020_Cover = item.Item_x0020_Cover;
                        item.Title = item.Title;   
                        item.EventDescription = item.EventDescription;                  
                        item.CreatedDate = moment(item.Created).format("DD MMM YYYY");
                        item.EventDate = moment(item.EventDate).format("DD MMM YYYY");
                        item.EndDate = moment(item.EndDate).format("DD MMM YYYY");
                    }
                })
                let finalLoadEvents:any = data?.reverse();
                setEventsListData(finalLoadEvents);

            }).catch((error: any) => {
                console.error(error);
            });

        }
        const loadDocumentsItems = () => {
            let web = new Web(baseUrl);
            web.lists.getById(props.props.DocumentsListId).items.select("Id", "Title", "Item_x0020_Cover", "ItemRank", "Body","Created", "Modified").filter('ItemRank eq 7').orderBy('Created',true).getAll().then((data: any) => {
                data.map((item: any) => {
                    item.ItemType = 'Documents'; 
                    if (item.ItemRank != undefined && item.ItemRank >= 7) {                  
                        item.Item_x0020_Cover = item.Item_x0020_Cover;
                        item.Title = item.Title;                              
                        item.Body = item.Body;                       
                        item.CreatedDate = moment(item.Created).format("DD MMM YYYY");
                    }
                })
                let finalLoadDocuments:any = data?.reverse();
                setDocumentsListData(finalLoadDocuments);

            }).catch((error: any) => {
                console.error(error);
            });

        }

        const LoadAllItems = () => {
            loadNews();
            loadEventsItems();
            loadDocumentsItems();
        }
        useEffect(() => {
            try {
                //LoadFeaturedItems();
                getLastestNewsItem();
                getLastestEventsItem();
                LoadAllItems();
            } catch (e) {
                console.log(e);
            }
        }, []);
        return (
            <>
                <section className='row'>
                    <div className='col-sm-8 mb-3'>
                        <div className='card commentsection'>
                            <div className="card-header">
                                <div className="h5 py-2 d-flex justify-content-between align-items-center  mb-0 card-title"> Featured Items<span></span>
                                <Tooltip ComponentId={1024}/>
                                 </div>
                            </div>
                            <div className='col-sm-12 p-1'>
                                {FeaturedNews && FeaturedNews.map((NewsItems: any) => {
                                    return <div className='p-1 mb-1 border'>
                                    <div className='d-flex align-content-center mb-1'>
                                        <span className="svg__iconbox svg__icon--news" title="News"></span>
                                        <span className='ms-2'> {NewsItems?.CreatedDate}</span>
                                    </div>
                                    <div>{NewsItems?.Title}</div>    
                                    <div dangerouslySetInnerHTML={{__html:NewsItems.Body}}/>        
                                                                 
                                </div>                                 
                                })}
                            </div>
                            <div className='col-sm-12 p-1'>
                                {Events && Events.map((EventItems: any) => {
                                   return <div className='p-1 mb-1 border'>
                                    <div className='d-flex align-content-center mb-1'>
                                        <span className="svg__iconbox svg__icon--calendar" title="Events"></span>
                                        <span className='ms-2'>{EventItems?.EventDate}</span> <span className='ms-2'>to</span>
                                        <span className='ms-2'>{EventItems?.EndDate}</span>
                                    </div>
                                    <div>{EventItems?.Title}</div>
                                    <div dangerouslySetInnerHTML={{__html:EventItems.EventDescription}}/>          
                                                                
                                </div>                                   
                                })}
                            </div>
                            <div className='col-sm-12 p-1'>
                                {Documents && Documents.map((DocumentItems: any) => {
                                    return <div className='p-1 mb-1 border'>
                                        <div className='d-flex align-content-center mb-1'>
                                            <span className="svg__iconbox svg__icon--docx" title="docx"></span>
                                            <span className='ms-2'> {DocumentItems?.CreatedDate}</span>
                                        </div>
                                        <div>{DocumentItems?.Title}</div> 
                                        <div>{DocumentItems?.FileSize}</div> 
                                        
                                        <div dangerouslySetInnerHTML={{__html:DocumentItems.Body}}/>                                        
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4 '>
                        <div className='card commentsection mb-3 w-100'>
                            <div className="card-header">
                                <div className="h5 py-2 d-flex justify-content-between align-items-center  mb-0 card-title">What's New<span></span>
                                <Tooltip ComponentId={1026}/>
                                </div>
                                
                            </div>
                            <div className='col-sm-12 p-1'>
                                {Announcements && Announcements.map((item: any) => {
                                    return <div className='py-1 border-bottom'>
                                        <span className='me-2'>{item?.CreatedDate}</span>
                                        <span className='mx-1'>{item?.Title}</span>
                                    </div>
                                })}
                              
                            </div>
                        </div>
                        {LatestEventItems.length>0 && (
                        <div className='card commentsection mb-3 w-100'>
                            <div className="card-header">
                                <div className="h5 py-2 d-flex justify-content-between align-items-center  mb-0 card-title">Upcoming Events<span></span>
                                <Tooltip ComponentId={1025}/>
                                </div>
                                
                            </div>
                            <div className='col-sm-12 p-1'>
                                {LatestEventItems && LatestEventItems.map((item: any) => {
                                    return <div className='py-1 border-bottom'>
                                        <span className='me-2'>{item?.EventDate}</span>
                                        <span className='mx-1'>{item?.Title}</span>
                                    </div>
                                })}
                              
                            </div>
                        </div>)}
                    </div>
                </section>
            </>
        )
    }
    export default LatestItems;

