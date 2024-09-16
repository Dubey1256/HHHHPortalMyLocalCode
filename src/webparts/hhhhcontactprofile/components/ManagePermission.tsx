import * as React from 'react'
import { Web, sp } from 'sp-pnp-js';
import "bootstrap/js/dist/tab.js";
import { Panel, PanelType } from "office-ui-fabric-react";
const ManagePermission = (props: any) => {

    const [tiles, setTiles]: any = React.useState([]);
    const [isexistUser, setisexistUser] = React.useState(false)
    const [isPermission, setisPermission] = React.useState(true);
    const [ManagePermissionPopup, setManagePermissionPopupOpen] = React.useState(true);

    const tilesData = async () => {
        let web = new Web(props?.context?.baseUrl);
        await web.lists
            .getById(props?.context?.TilesManagementListID)
            .items.getAll()
            .then((data: any) => {
                console.log(data);
                setTiles(data);
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    React.useEffect(() => {
        const loadData = async () => {
            await GetAllUsers();
            await tilesData();
        }
        loadData();
    }, [])





    // Function to fetch all users and process them
    const GetAllUsers = async () => {
        try {
            // Fetching users from the SharePoint site
            let web = new Web(props?.context?.baseUrl);
            const users = await web.siteUsers.get();

            console.log(users);

            // Loop through users to check for specific conditions
            users.map((user: any) => {
                if (props?.contactData?.Email?.toLowerCase() === user.Email?.toLowerCase()) {
                    setisexistUser(true);
                    setisPermission(false);
                    console.log(user.Id);
                }
            });
        } catch (error) {
            alert("An error occurred while fetching users");
            console.error("Error fetching users: ", error);
        }
    };


    const closeApproverPopup = () => {
        setManagePermissionPopupOpen(false);
        props?.closePopupCallBack()
    }


    const postUser = async (Id: any) => {
        const confirm = window.confirm("Do you want to add the user to this group?")
        if (confirm) {
            if (isPermission) {
                alert("Add User in the directory first")
            }
            else {
                const webUrl = props?.context?.baseUrl;

                try {
                    // Ensure the SPFx context is available
                    const web = new Web(webUrl);

                    // Make the HTTP POST request to add the user to the group
                    await web.siteGroups.getByName(Id).users.add(`i:0#.f|membership|${props?.contactData?.Email}`);

                    alert("User added successfully");
                } catch (error) {
                    console.error(error);

                    // Handle unauthorized/forbidden error
                    if (error.status === 403 || error.status === 401) {
                        alert("You do not have the necessary rights to access this section");
                    } else {
                        alert("An error occurred while adding the user");
                    }
                }
            }
        }
    };

    return (
        <>
            <Panel
                type={PanelType.large}
                isOpen={ManagePermissionPopup}
                onDismiss={() => closeApproverPopup()}
                closeButtonAriaLabel="Close"
                isBlocking={false}
            >
                <div>
                    {console.log("Edit panel component")}
                    {
                        tiles?.length > 0 && tiles.some((item: any) => item.Itemtype === 'Manage Permissions-ILF') &&
                        <div className="mb-3 card commentsection">
                            <div className="card-header">
                                <h2 className="align-items-center heading card-title d-flex h5 justify-content-between my-2">
                                    Manage Permissions - ILF
                                </h2>
                            </div>
                            <div className="card-body d-flex justify-content-around  my-3">
                                {
                                    tiles?.length > 0 &&
                                    tiles?.map((tilesItem: any) => tilesItem?.Itemtype == "Manage Permissions-ILF" &&
                                        <div
                                            className="card"
                                            style={{ width: "14rem" }}
                                            onClick={() => {
                                                postUser(tilesItem?.Title)
                                            }
                                            }
                                        >
                                            <div className="card-body bg-siteColor">
                                                <a className="d-flex flex-column align-items-center mt-2">
                                                    <h6 className="text-white">{tilesItem?.Title}</h6>
                                                    <img
                                                        className="m-3"
                                                        src="https://www.gruene-washington.de/PublishingImages/Icons/32/admin.png"
                                                    />
                                                    <span className="fw-bold text-white">{tilesItem?.Footer}</span>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    }
                    {
                        tiles?.length > 0 && tiles.some((item: any) => item.Itemtype === 'Manage Permissions-HUB') &&
                        <div className="mb-3 card commentsection">
                            <div className="card-header">
                                <h2 className="align-items-center heading card-title d-flex h5 justify-content-between my-2">
                                    Manage Permissions - HUB
                                </h2>
                            </div>
                            <div className="card-body d-flex justify-content-around  my-3">
                                {
                                    tiles?.length > 0 &&
                                    tiles?.map((tilesItem: any) => tilesItem?.Itemtype == "Manage Permissions-HUB" &&
                                        <div
                                            className="card"
                                            style={{ width: "14rem" }}
                                            onClick={() => {
                                                postUser(tilesItem?.Title)
                                            }}
                                        >
                                            <div className="card-body bg-siteColor">
                                                <a className="d-flex flex-column align-items-center mt-2">
                                                    <h6 className="text-white">{tilesItem?.Title}</h6>
                                                    <img
                                                        className="m-3"
                                                        src="https://www.gruene-washington.de/PublishingImages/Icons/32/admin.png"
                                                    />
                                                    <span className="fw-bold text-white">{tilesItem?.Footer}</span>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    }
                    {
                        tiles?.length > 0 && tiles.some((item: any) => item.Itemtype === 'Manage Permissions-Management') &&

                        <div className="mb-3 card commentsection">
                            <div className="card-header">
                                <h2 className="align-items-center heading card-title d-flex h5 justify-content-between my-2">
                                    Manage Permissions - Management
                                </h2>
                            </div>
                            <div className="card-body  d-flex justify-content-around  my-3">
                                {
                                    tiles?.length > 0 &&
                                    tiles?.map((tilesItem: any) => tilesItem?.Itemtype == "Manage Permissions-Management" &&
                                        <div
                                            className="card"
                                            style={{ width: "14rem" }}
                                            onClick={() => {
                                                postUser(tilesItem?.Title)
                                            }}
                                        >
                                            <div className="card-body bg-siteColor">
                                                <a className="d-flex flex-column align-items-center mt-2">
                                                    <h6 className="text-white">{tilesItem?.Title}</h6>
                                                    <img
                                                        className="m-3"
                                                        src="https://www.gruene-washington.de/PublishingImages/Icons/32/admin.png"
                                                    />
                                                    <span className="fw-bold text-white">{tilesItem?.Footer}</span>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    }

                    {
                        tiles?.length > 0 && tiles.some((item: any) => item.Itemtype === 'Manage Permissions-CreatorSpace') &&

                        <div className="mb-3 card commentsection">
                            <div className="card-header">
                                <h2 className="align-items-center heading card-title d-flex h5 justify-content-between my-2">
                                    Manage Permissions - CreatorSpace
                                </h2>
                            </div>
                            <div className="card-body  d-flex justify-content-around  my-3">
                                {
                                    tiles?.length > 0 &&
                                    tiles?.map((tilesItem: any) => tilesItem?.Itemtype == "Manage Permissions-CreatorSpace" &&
                                        <div
                                            className="card"
                                            style={{ width: "14rem" }}
                                            onClick={() => {
                                                postUser(tilesItem?.Title)
                                            }}
                                        >
                                            <div className="card-body bg-siteColor">
                                                <a className="d-flex flex-column align-items-center mt-2">
                                                    <h6 className="text-white">{tilesItem?.Title}</h6>
                                                    <img
                                                        className="m-3"
                                                        src="https://www.gruene-washington.de/PublishingImages/Icons/32/admin.png"
                                                    />
                                                    <span className="fw-bold text-white">{tilesItem?.Footer}</span>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    }


                </div>
            </Panel>
        </>

    )
}
export default ManagePermission
