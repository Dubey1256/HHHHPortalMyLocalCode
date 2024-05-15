import React, { useState, useEffect } from 'react';
import { v4 as uuid } from "uuid";
import "./table.css"
import { Web, sp } from "sp-pnp-js";
import axios from 'axios';
let backupprofilePagedata: any = []
const ArticleComponent = () => {
    const [articleData, setArticleData] = useState(null);
    const [profilePagedata, setprofilePagedata] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState('eyJraWQiOiIiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InB1YmxpYy1hcGk6cmVhZCBwdWJsaWMtYXBpOndyaXRlIHB1YmxpYy1hcGk6Y29uZmlnOnJlYWQgcHVibGljLWFwaTpjb25maWc6d3JpdGUgZGVzay1uZXQiLCJuYW1lIjoiUHJvZmlsZXBhZ2VzVG9rZW4iLCJwcm9qZWN0SWQiOjI1OTUsImNoYW5uZWxJZCI6MjU0MywidHlwZSI6ImNsaWVudCIsImp0aSI6IjA0YmQ2NmYyLTk2NWItNDVkZC1iZTNmLTExOTE3OTdiZTg0YiIsImNvZGUiOiIwNGJkNjZmMi05NjViLTQ1ZGQtYmUzZi0xMTkxNzk3YmU4NGIiLCJpYXQiOjE3MTUzMzc2MjZ9.OWICZpi40dhM9FTb2QQMax_EBtNAhI6TG0ULxHybiTE');

    const apiUrl = `https://server.livingdocs.io/api/v1/document-lists`;
    const ImageapiUrl = `https://server.livingdocs.io/api/v1/import/images`;

    useEffect(() => {
        fetchArticles();
        getProfilePageListData()
    }, [accessToken]);

    const getProfilePageListData = async () => {
        let Pagedata: any;
        let webs = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/LivingDocs');
        try {
            let data = await webs.lists.getById("59D8FE3B-3910-4586-8762-A9EBAB68B8AA").items.getAll()
            data.forEach((item) => {
                const regex = /(<([^>]+)>)/gi;
                const newString = item.Description.replace(regex, "");
                item.Description = newString;
            })
            backupprofilePagedata = data;
            setprofilePagedata(backupprofilePagedata)
        } catch (error: any) {
            console.error(error);
        };
    };

    const fetchArticles = async () => {
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setArticleData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    const postData = async (data: any) => {
        try {
            const response = await axios.post(apiUrl, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            // Handle response if needed
        } catch (error) {
            setError(error);
        }
    };
    const LivingdocsImport = async () => {
        const token = 'eyJraWQiOiIiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InB1YmxpYy1hcGk6cmVhZCBwdWJsaWMtYXBpOndyaXRlIHB1YmxpYy1hcGk6Y29uZmlnOnJlYWQgcHVibGljLWFwaTpjb25maWc6d3JpdGUgZGVzay1uZXQiLCJuYW1lIjoiU1BUb2tlbnMiLCJwcm9qZWN0SWQiOjI2MDcsImNoYW5uZWxJZCI6MjU1NSwidHlwZSI6ImNsaWVudCIsImp0aSI6IjIwYjQ4OWUyLTZmMDctNGRmYy05MzE1LWVjZGNiMTdlMjExMCIsImNvZGUiOiIyMGI0ODllMi02ZjA3LTRkZmMtOTMxNS1lY2RjYjE3ZTIxMTAiLCJpYXQiOjE3MTQ0NjMwMzJ9.lLtzNZ3slInABCf7Wp7p-2wFoPsaFMegQUj0msffPCo';
        const data = {
            mediaLibraryEntries: [
                {
                    id: 'custom-2',
                    systemName: 'externalSystem',
                    externalId: '396KF9HMSXLX',
                    mediaType: 'file',
                    asset: {
                        key: '2022/09/30/a1cb173d-e85f-498b-996e-5ce46058e9b9.pdf',
                        url: 'https://livingdocs-files-development.s3.amazonaws.com/2022/09/30/a1cb173d-e85f-498b-996e-5ce46058e9b9.pdf',
                        size: 3028,
                        filename: 'a-simple-pdf.pdf',
                        mimeType: 'application/pdf',
                    },
                    metadata: {
                        title: 'A simple PDF',
                    },
                    translations: [
                        {
                            locale: 'fr',
                            metadata: {
                                title: 'Un simple PDF',
                            },
                        },
                    ],
                },
            ],
        };

        try {
            const response = await axios.post('https://server.livingdocs.io/api/v1/import/mediaLibrary', data, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const importVideo = async () => {
        const token = 'eyJraWQiOiIiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InB1YmxpYy1hcGk6cmVhZCBwdWJsaWMtYXBpOndyaXRlIHB1YmxpYy1hcGk6Y29uZmlnOnJlYWQgcHVibGljLWFwaTpjb25maWc6d3JpdGUgZGVzay1uZXQiLCJuYW1lIjoiU1BUb2tlbnMiLCJwcm9qZWN0SWQiOjI2MDcsImNoYW5uZWxJZCI6MjU1NSwidHlwZSI6ImNsaWVudCIsImp0aSI6IjIwYjQ4OWUyLTZmMDctNGRmYy05MzE1LWVjZGNiMTdlMjExMCIsImNvZGUiOiIyMGI0ODllMi02ZjA3LTRkZmMtOTMxNS1lY2RjYjE3ZTIxMTAiLCJpYXQiOjE3MTQ0NjMwMzJ9.lLtzNZ3slInABCf7Wp7p-2wFoPsaFMegQUj0msffPCo';

        const data = {
            systemName: 'p:2607:2555.article-container',
            webhook: 'https://my-domain.com/webhooks/video-import',
            context: {
                myIdentifier: 'p:2607:2555.article-container'
            },
            videos: [
                {
                    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
                    id: '12556666665',
                    fileName: 'hhhhh',
                    metadata: {
                        title: 'sample videofhhh',
                        credit: 'LC'
                    }
                }
            ]
        };

        try {
            const response = await axios.post('https://server.livingdocs.io/api/v1/import/videos', data, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const UoloadAllContentImages = async () => {
        try {
            if (backupprofilePagedata.length > 0) {
                await uploadImages(backupprofilePagedata[0], 'bulkupdate');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };
    const uploadImages = async (page: any, ItemUpdate: any) => {
        setLoading(true)
        const unique_id = uuid();
        const small_id = page.Id + unique_id.slice(0, 8);
        try {
            const apiUrlImage = 'https://server.livingdocs.io/api/v1/import/images'; // Replace with the actual API endpoint

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            };

            const imageData = {
                systemName: 'identifier-for-your-system',
                webhook: 'https://my-domain.com/webhooks/image-import',
                context: {
                    myIdentifier: 'some-identifier-sent-to-the-webhook',
                },
                images: [
                    {
                        url: `${page.Item_x0020_Cover.Url}`,
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
            await getImageData(imgresponse.data, page, ItemUpdate);

        } catch (error) {
            console.error('Error posting image to Livingdocs:', error);
        }
    };
    const getImageData = async (imageid: any, page: any, ItemUpdate: any) => {
        try {
           
            await new Promise(resolve => setTimeout(resolve, 3000));
            const imgUrlresponse = await axios.get(`https://server.livingdocs.io/api/v1/import/images/status?id=${imageid.id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(imgUrlresponse.data)
            await sendProfilePageData(imgUrlresponse.data, page, ItemUpdate); // Log the response data if needed        
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const sendProfilePageData = async (imgurl: any, page: any, ItemUpdate: any) => {
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
                systemName: "p:2595:2543.article-container",
                webhook: "https://my-domain.com/webhooks/document-import",
                context: {
                    myIdentifier: "p:2595:2543.article-container"
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
                                    identifier: "p:2595:2543.article-container",
                                    id: "doc-1cdmu2hll0",
                                    containers: {
                                        header: [
                                            {
                                                identifier: "p:2595:2543.head",
                                                id: "doc-1cdmu2hll1",
                                                content: {
                                                    title: `${page.Title}`
                                                },
                                                component: "head"
                                            }
                                        ],
                                        main: [
                                            {
                                                "identifier": "p:2595:2543.image",
                                                "id": "doc-1cdmu2hll2",
                                                "content": {
                                                    "image": {
                                                        "url": `${livingImageUrls?.url}`,
                                                        "width": 1500,
                                                        "height": 1000,
                                                        "mimeType": "image/png",
                                                        "imageService": "imgix",
                                                        "originalUrl": `${livingImageUrls?.originalUrl}`
                                                    },
                                                    "caption": "Editing with Livingdocs is as easy as working with building blocks."
                                                },
                                                "data": {
                                                    "title": `${page.Title}`
                                                },
                                                "component": "image"
                                            },

                                            {
                                                "identifier": "p:2595:2543.paragraph",
                                                "id": "doc-1cdmuevar0",
                                                "content": {
                                                    "text": `${page.Description}`
                                                },
                                                "component": "paragraph"
                                            }

                                        ]
                                    },
                                    component: "article-container"
                                }
                            ],
                            design: {
                                name: "p:2595:2543",
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
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data); // Log the response data if needed
            if (ItemUpdate === 'bulkupdate') {
                // Efficiently remove items from backupprofilePagedata:
                const filteredData = backupprofilePagedata.filter((item: any) => item.Id !== page.Id);

                // Update backupprofilePagedata with the filtered data:
                backupprofilePagedata.length = 0; // Clear existing data
                backupprofilePagedata.push(...filteredData); // Add filtered elements

                // Load images only if filtered data has elements:
                if (filteredData.length > 0) {
                    UoloadAllContentImages();
                }
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            if (backupprofilePagedata.length == 0 && ItemUpdate == 'bulkupdate') {
                setLoading(false)
                alert('content synced successfully!') // Set loading state to false when syncing completes
            } else if (ItemUpdate == 'singleupdate') {
                setLoading(false)
                alert('content synced successfully!') // Set loading state to false when syncing completes
            }

        }
    };




    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!articleData) {
        return <div>Loading...</div>;
    }
    function truncateString(str: string, limit: number) {
        const words = str.split(' ');
        if (words.length > limit) {
            return words.slice(0, limit).join(' ') + '...';
        }
        return str;
    }

    return (
        <><div className="container">
             {loading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    )}
            <div className="mb-5 clearfix">
                <div className="clearfix mb-5">
                <h2 className="d-flex">
                    Profile Page Content
                    <button className='btn btn-primary ml-auto' onClick={() => UoloadAllContentImages()}>Sync All</button>
                </h2>
              
                </div>
              
                <div className="mb-5">
                    <table>
                        <tr><th>Image</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Sync to LivingDocs</th>
                        </tr>
                        {profilePagedata && profilePagedata.map((page: any) => {
                            // Truncate description to 50 words
                            const truncatedDescription = truncateString(page.Description, 50);
                            return (
                                <tr><td><img className='CoverImg' src={page.Item_x0020_Cover.Url} alt={page.Title} /></td>
                                    <td>{page.Title}</td>
                                    <td>{truncatedDescription}</td>
                                    <td  className="text-center">
                                        <button className='btn btn-sm btn-primary' onClick={() => uploadImages(page, 'singleupdate')}>Sync
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            </div>
        </div><div>
                {/* {articleData && articleData.map((item: any) => {
        return (
            <h1 key={item.id}>{item.name}</h1>
        )
    })}
    <button onClick={() => sendProfilePageData()}>Add Article</button>
    <button onClick={() => uploadImages()}>Upload Image</button>
    <button onClick={() => LivingdocsImport()}>Document Upload</button>
    <button onClick={() => importVideo()}>Video Upload</button> */}


            </div></>
    );
};

export default ArticleComponent;
