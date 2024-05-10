import * as React from 'react';
import { Web } from 'sp-pnp-js';
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from "uuid";
import "./table.css"
let SmartId: any;
//LivingDocument
let tokenProfile = 'eyJraWQiOiIiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InB1YmxpYy1hcGk6cmVhZCBwdWJsaWMtYXBpOndyaXRlIHB1YmxpYy1hcGk6Y29uZmlnOnJlYWQgcHVibGljLWFwaTpjb25maWc6d3JpdGUgZGVzay1uZXQiLCJuYW1lIjoiU2FuZEJveFRva2VuIiwicHJvamVjdElkIjoyNjA2LCJjaGFubmVsSWQiOjI1NTQsInR5cGUiOiJjbGllbnQiLCJqdGkiOiIyNTNmNjhkMC03NzQ0LTRiZTUtYmMzOC04ODE1NDhjMzA2ZjkiLCJjb2RlIjoiMjUzZjY4ZDAtNzc0NC00YmU1LWJjMzgtODgxNTQ4YzMwNmY5IiwiaWF0IjoxNzE0NjMwNDc2fQ.qSlCxhe0azafcmQIiMPgEfQJocsWAcyX8xXtzHV_lGE'
export default function TestSmartPagesComponent(props: any) {
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
                        url: `https://farm2.staticflickr.com/1533/26541536141_41abe98db3_z_d.jpg`,
                        id: `${small_id}`,
                        fileName: `${page.Title}${small_id}`,
                        mediaType: 'image',
                        metadata: {
                            title: `image1`,
                            description:`image1description`,
                            credit:`creditdescription`,
                            note:`notedescription`,
                        },
                    },
                    {
                        url: `https://www.gstatic.com/webp/gallery3/1.png`,
                        id: `${small_id}ee`,
                        fileName: `${page.Title}${small_id}ee`,
                        mediaType: 'image',
                        metadata: {
                            title: `image2`,
                            description:`image2description`,
                            credit:`credit1description`,
                            note:`note1description`,
                        },
                    },
                ],
            };

            const imgresponse = await axios.post(apiUrlImage, imageData, { headers });      
        } catch (error) {
            console.error('Error posting image to Livingdocs:', error);
        }finally {
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