import * as React from 'react';
import { Web } from 'sp-pnp-js';
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from "uuid";
import "./table.css"
let SmartId: any;
//LivingDocument
let tokenProfile = 'eyJraWQiOiIiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InB1YmxpYy1hcGk6cmVhZCBwdWJsaWMtYXBpOndyaXRlIHB1YmxpYy1hcGk6Y29uZmlnOnJlYWQgcHVibGljLWFwaTpjb25maWc6d3JpdGUgZGVzay1uZXQiLCJuYW1lIjoiU2FuZEJveFRva2VuIiwicHJvamVjdElkIjoyNjA2LCJjaGFubmVsSWQiOjI1NTQsInR5cGUiOiJjbGllbnQiLCJqdGkiOiIyNTNmNjhkMC03NzQ0LTRiZTUtYmMzOC04ODE1NDhjMzA2ZjkiLCJjb2RlIjoiMjUzZjY4ZDAtNzc0NC00YmU1LWJjMzgtODgxNTQ4YzMwNmY5IiwiaWF0IjoxNzE0NjMwNDc2fQ.qSlCxhe0azafcmQIiMPgEfQJocsWAcyX8xXtzHV_lGE'
export default function TestSmartPages(props: any) {
    const [articleData, setArticleData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [smartPageItem, setSmartPageItem]: any = React.useState([]);
    const [LoadedImages, setLoadedImages]: any = React.useState([]);
    const [dummyLoadedImages, setdummyLoadedImages]: any = React.useState([
        { Title: 'TestImage1', Url: 'https://as2.ftcdn.net/v2/jpg/07/90/16/45/1000_F_790164584_yN3i25J7kLF7h92VhIEUcJcOTyFBaDqv.jpg' },
        { Title: 'TestImage2', Url: 'https://as2.ftcdn.net/v2/jpg/04/58/15/97/1000_F_458159731_dUgcFzoF9qRXpXEnmkcGro6Zo5HRpqi2.jpg' },
        { Title: 'TestImage3', Url: 'https://as1.ftcdn.net/v2/jpg/04/58/15/96/1000_F_458159663_n2e8KFR4uOkmIicylHbORrvvPdvFDRHy.jpg' },
        { Title: 'TestImage4', Url: 'https://as1.ftcdn.net/v2/jpg/05/97/90/58/1000_F_597905851_uHqpQwa47WL9V6FJvxJb9hPFKaaBmGR6.jpg' },
        { Title: 'TestImage5', Url: 'https://as1.ftcdn.net/v2/jpg/05/97/90/58/1000_F_597905848_alZb9X75duCF1wDj8Nhi1jxgcqMM68KI.jpg' },
        { Title: 'TestImage6', Url: 'https://as1.ftcdn.net/v2/jpg/05/90/91/02/1000_F_590910244_ygBb9uvtn2XHKnPddSDNZsE3JKx36QiA.jpg' },
        { Title: 'TestImage7', Url: 'https://as2.ftcdn.net/v2/jpg/03/39/81/63/1000_F_339816341_48JxjVk3crE1rOXZnzOKDANk7xNAzFut.jpg' },

    ]);
    const [Showwebpart, setShowwebpart]: any = useState(false);
    const [profilePagedata, setprofilePagedata] = useState(null);

    React.useEffect(() => {
        getProfilePageListData();
        getAllImageData();
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

    const getAllImageData = async () => {
        let allImages: any;
        let webs = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/');
        await webs.getFolderByServerRelativeUrl(`/sites/HHHH/PublishingImages/TestImages`).files.get()
            .then(async (dataimage: any) => {
                try {
                    allImages = dataimage;
                    allImages.forEach((item: any) => {
                        item.Title = item.Name.split('.')[0]
                        item.Url = `https://hhhhteams.sharepoint.com${item.ServerRelativeUrl}`
                    })
                    setLoadedImages(dataimage)
                    console.log(dataimage)
                } catch (e) { console.log(e) }
            }).catch((err: any) => {
                console.log(err.message);
            });
    }


    const uploadImages = async (AllImages: any) => {
        let postdata: any[] = []; // Define an array to hold the objects

        AllImages.forEach((item: any, index: any) => {
            const unique_id = uuid();
            const small_id = index + unique_id.slice(0, 8);
            // Create a new object for each item and push it into the array
            postdata.push({
                url: `${item.Url}`,
                id: `${small_id}test`,
                fileName: `${item.Title}${small_id}test`,
                mediaType: 'image',
                metadata: {
                    title: `${item.Title}`,
                    description: `${item.Title}description`,
                    credit: `${item.Title}credit`,
                    note: `${item.Title}note`,
                },

            });
        });


        setLoading(true)
        const unique_id = uuid();
        //const small_id = page.Id + unique_id.slice(0, 8);
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
                images: [...postdata],
            };

            const imgresponse = await axios.post(apiUrlImage, imageData, { headers });
        } catch (error) {
            console.error('Error posting image to Livingdocs:', error);
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
                <div className='container'>
                    <div className='row'>
                        <div className='col'>
                            <h3 className='sync-header'>Sync Tool</h3>
                        </div>
                        <div className='col'>
                            <button className='btn btn-primary sync-button' onClick={() => uploadImages(LoadedImages)}>Sync All</button>
                        </div>
                    </div>
                    <div className='row'>
                        {LoadedImages && LoadedImages.map((image: any) => {
                            return (
                                <div className="col" key={image.Id}>
                                    <div className='image-container'>
                                        <h6>{image.Title}</h6>
                                        <img className='img-fluid' src={image.Url} alt={image.Title} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </section>

        </>
    );
}