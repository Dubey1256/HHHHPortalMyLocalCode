import * as React from 'react';
import { Web } from 'sp-pnp-js';
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from "uuid";
import "./table.css"
let SmartId: any;
let tokenProfile = 'eyJraWQiOiIiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InB1YmxpYy1hcGk6cmVhZCBwdWJsaWMtYXBpOndyaXRlIHB1YmxpYy1hcGk6Y29uZmlnOnJlYWQgcHVibGljLWFwaTpjb25maWc6d3JpdGUgZGVzay1uZXQiLCJuYW1lIjoiU2FuZEJveFRva2VuIiwicHJvamVjdElkIjoyNjA2LCJjaGFubmVsSWQiOjI1NTQsInR5cGUiOiJjbGllbnQiLCJqdGkiOiIyNTNmNjhkMC03NzQ0LTRiZTUtYmMzOC04ODE1NDhjMzA2ZjkiLCJjb2RlIjoiMjUzZjY4ZDAtNzc0NC00YmU1LWJjMzgtODgxNTQ4YzMwNmY5IiwiaWF0IjoxNzE0NjMwNDc2fQ.qSlCxhe0azafcmQIiMPgEfQJocsWAcyX8xXtzHV_lGE'
export default function GrueneSmartPages(props: any) {
    const [articleData, setArticleData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [smartPageItem, setSmartPageItem]: any = React.useState([]);
    const [Showwebpart, setShowwebpart]: any = useState(false);
    const [profilePagedata, setprofilePagedata] = useState(null);
    React.useEffect(() => {
        getProfilePageListData();
    }, [])
    const getParameterByName = (name: any) => {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        const results = regex.exec(window.location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    const getProfilePageListData = async () => {
        SmartId = getParameterByName('SmartId').trim();
        let Pagedata: any;
        let webs = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        try {
            let data = await webs.lists.getById("10BE94C1-78C8-432E-86EA-FF55113B67AB").items.filter(`Id eq ${SmartId}`).getAll();
            Pagedata = data;
            setprofilePagedata(Pagedata)
        } catch (error: any) {
            console.error(error);
        };
    };


    const uploadImages = async (page: any) => {
        setLoading(true)
        const unique_id = uuid();
        const small_id = page.Id + unique_id.slice(0, 8);
        try {         
            const apiUrlImage = 'https://server.livingdocs.io/api/v1/import/images'; // Replace with the actual API endpoint

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenProfile}`,
            };

            const imageData = {
                systemName: 'identifier-for-your-system',
                webhook: 'https://my-domain.com/webhooks/image-import',
                context: {
                    myIdentifier: 'some-identifier-sent-to-the-webhook',
                },
                images: [
                    {
                        url: `${page.ItemCover.Url}`,
                        id: `${small_id}`,
                        fileName: `${page.Title}${small_id}`,
                        mediaType: 'image',
                        metadata: {
                            title: `${page.Title}`,
                        },
                    },
                ],
            };

            const imgresponse = await axios.post(apiUrlImage, imageData, { headers });
            setTimeout(() => {
                getImageData(imgresponse.data, page);
            }, 3000); // Adjust the delay time (in milliseconds) as needed
        } catch (error) {
            console.error('Error posting image to Livingdocs:', error);
        }
    };
    const getImageData = async (imageid: any, page: any) => {
        try {     
            await new Promise(resolve => setTimeout(resolve, 3000));
            const imgUrlresponse = await axios.get(`https://server.livingdocs.io/api/v1/import/images/status?id=${imageid.id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenProfile}`
                }
            });
            console.log(imgUrlresponse.data)
            setTimeout(() => {
                sendProfilePageData(imgUrlresponse.data, page); // Log the response data if needed
            }, 3000); // Adjust the delay time (in milliseconds) as needed

        } catch (error) {
            console.error('Error:', error);
        }
    };
    const sendProfilePageData = async (imgurl: any, page: any) => {
        // Get first 8 characters using slice
        const todayDate = new Date();
        let livingImageUrls;
        if (imgurl?.images != undefined && imgurl?.images?.length > 0)
            livingImageUrls = imgurl?.images[0]?.image
        console.log(imgurl)
        const unique_id = uuid();
        const small_id = page.Id + unique_id.slice(0, 8);
        try {
            const data = {
                systemName: "p:2606:2554.article-container",
                webhook: "https://my-domain.com/webhooks/document-import",
                context: {
                    myIdentifier: "p:2606:2554.article-container"
                },
                documents: [
                    {
                        id: `${small_id}`,
                        title: `${small_id}${page.Title}`,
                        contentType: "regular",
                        checksum: "xyz456",
                        publicationDate: `${todayDate}`,
                        livingdoc: {
                            content: [
                                {
                                    identifier: "p:2606:2554.article-container",
                                    id: "doc-1cdmu2hll0",
                                    containers: {
                                        main: [
                                            // {
                                            //     "identifier": "p:2606:2554.image",
                                            //     "id": "doc-1cdmu2hll2",
                                            //     "content": {
                                            //         "image": {
                                            //             "url": `${livingImageUrls?.url}`,
                                            //             "width": 1500,
                                            //             "height": 1000,
                                            //             "mimeType": "image/png",
                                            //             "imageService": "imgix",
                                            //             "originalUrl": `${livingImageUrls?.originalUrl}`
                                            //         },
                                            //         "caption": "Editing with Livingdocs is as easy as working with building blocks."
                                            //     },
                                            //     "data": {
                                            //         "title": `${page.Title}`
                                            //     },
                                            //     "component": "image"
                                            // },

                                            // {
                                            //     "identifier": "p:2606:2554.paragraph",
                                            //     "id": "doc-1cdmuevar0",
                                            //     "content": {
                                            //         "text": `${page.Description}`
                                            //     },
                                            //     "component": "paragraph"
                                            // },
                                            {
                                                "identifier": "p:2606:2554.free-html",
                                                "id": "doc-1ht6810840",
                                                "content": {
                                                  "free-html": {
                                                    "html": `${page.PageContent}`
                                                  }
                                                },
                                                "data": {
                                                  "_free-htmlDirective": {}
                                                },
                                                "component": "free-html"
                                              }

                                        ],
                                        "sidebar-ads-top": [
                                          {
                                            "identifier": "p:2606:2554.free-html",
                                            "id": "doc-1ht6a9lr30",
                                            "content": {
                                              "free-html": {
                                                "html": `${page.SidePageContent}`
                                              }
                                            },
                                            "data": {
                                              "_free-htmlDirective": {}
                                            },
                                            "component": "free-html"
                                          }
                                        ],
                                    },
                                    component: "article-container"
                                }
                            ],
                            design: {
                                name: "p:2606:2554",
                                version: "1.0.0"
                            }
                        },
                        metadata: {
                            title: `${small_id}${page.Title}`,
                            description: "This document explains to you the basics of editing with Livingdocs. Scroll down and follow the hands-on tasks.This document explains to you the basics of editing with Livingdocs. Scroll down and follow the hands-on tasks This document explains to you the basics of editing with Livingdocs. Scroll down and follow the hands-on tasksThis document explains to you the basics of editing with Livingdocs. Scroll down and follow the hands-on tasksThis document explains to you the basics of editing with Livingdocs. Scroll down and follow the hands-on tasksThis document explains to you the basics of editing with Livingdocs. Scroll down and follow the hands-on tasksThis document explains to you the basics of editing with Livingdocs. Scroll down and follow the hands-on tasks"
                        },
                        translations: [
                            {
                                locale: "fr",
                                metadata: {
                                    description: "foo FR"
                                }
                            }
                        ],
                        flags: {
                            autoPublish: true
                        }
                    }
                ]
            };
            const response = await axios.post('https://server.livingdocs.io/api/v1/import/documents', data, {
                headers: {
                    Authorization: `Bearer ${tokenProfile}`
                }
            });
            console.log(response.data); // Log the response data if needed
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
            alert('content synced successfully!') // Set loading state to false when syncing completes
        }
    };

    return (
        <>
            <section className='container'>
                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                )}
                <div className='row'>
                    {profilePagedata && profilePagedata.map((page: any) => {
                        return (
                            <><div key={page.id} className="col-12">
                                <section className="container">
                                    <h4>{page.Title}</h4>
                                    <button onClick={() => uploadImages(page)}>Sync
                                    </button>
                                    <img className='image' style={{ maxWidth: '100%', height: 'auto' }} src={page.ItemCover.Url} alt={page.Title} />
                                    <div>{page.Description}</div>
                                </section>
                            </div>
                                {/* <div className="col-3">
                                    <div className="SharewebRightNavigatorBarAccordion mt-20">
                                        <details className="has-sub" id="myDetails0" open>
                                            <summary>
                                                <a className="text-dark ng-binding" target="_blank" href="/site/ei/Private-Sector-Development">PSD</a>
                                            </summary>
                                            <details className="has-Nosub">
                                                <summary>
                                                    <a className="text-dark ng-binding" target="_blank" href="/site/EI/Local-Economic-Development">Local Economic Development</a>
                                                </summary>
                                            </details>
                                            <details className="has-Nosub">
                                                <summary>
                                                    <a className="text-dark ng-binding" target="_blank" href="/site/ei/Womens-economic-empowerment-%28WEE%29">Women's economic empowerment (WEE)</a>
                                                </summary>
                                            </details>
                                            <details className="has-Nosub">
                                                <summary>
                                                    <a className="text-dark ng-binding" target="_blank" href="/site/ei/Market-System-Development-MSD">Market System Development MSD</a>
                                                </summary>
                                            </details>
                                            <details className="has-Nosub">
                                                <summary>
                                                    <a className="text-dark ng-binding" target="_blank" href="/site/EI/topics/value-chain-development">Value Chain Development</a>
                                                </summary>
                                            </details>
                                        </details>
                                    </div>
                                </div> */}
                            </>
                        )
                    })}
                </div>
            </section>

        </>
    );
}