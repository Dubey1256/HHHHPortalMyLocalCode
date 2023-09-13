import * as React from 'react'
import { Web } from 'sp-pnp-js';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react';

const EditMetaData = (props: any) => {
    const [name, setname] = React.useState<any>({ 'Title': '', 'ItemRank': '', 'bekf': '', 'Location': '' })
    const closeMetadataPopup = () => {
        props.closeEditMetadataPopup()
    };
    const UpdateMetaDataItem = () => {
        const updateMetaDataItemValue = {
            RankItem: name.ItemRank,
            Title: name.Title,
            bekf: name.bekf,
            Location: name.Location,
        };
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP/')
        web.lists.getByTitle("SmalsusLeaveCalendar").items.getById(props.item.Id).update(updateMetaDataItemValue).then((response: any) => {
            alert("Update successful")
            props.closeEditMetadataPopup()
        }).catch((error: any) => {
            console.error(error);
        });
    }
    return (
        <div>
            <Panel
                title="popup-title"
                isOpen={true}
                onDismiss={closeMetadataPopup}
                type={PanelType.medium}
                isBlocking={false}  >
                <div className="ms-modalExample-header">
                    <h3 id="popup-title">Edit Item</h3>
                </div>
                <div className="ms-modalExample-body">
                    <label>ItemRank</label>
                    <input type="text" defaultValue={props.item.RankItem} onChange={(e) => setname({ ...name, ItemRank: e.target.value })}></input>
                    <label> Title</label>
                    <input type="text" defaultValue={props.item.Title} onChange={(e) => setname({ ...name, Title: e.target.value })}></input>
                    <label>Department</label>
                    <input type="text" defaultValue={props.item.bekf} onChange={(e) => setname({ ...name, bekf: e.target.value })}></input>
                    <label>Loaction</label>
                    <input type="text" defaultValue={props.item.Location} onChange={(e) => setname({ ...name, Location: e.target.value })}></input>
                </div>
                <div className="ms-modalExample-footer">
                    <PrimaryButton onClick={closeMetadataPopup} text="Close" />
                    <PrimaryButton onClick={UpdateMetaDataItem} text="Update" />
                </div>
            </Panel>
        </div>
    )

}

export default EditMetaData