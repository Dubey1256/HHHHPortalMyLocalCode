import * as React from "react";
import { arraysEqual, Modal } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";

function ComponentPortPolioPopup(item: any) {
    // React.useEffect(() => {
    //     var initLoading = function () {
    //         taskDetails = await web.lists
    //   .getByTitle(this.state.listName)
    //   .items
    //   .getById(this.state.itemID)
    //   .select("ID","Title","Comments")
    //   .get()

    // console.log(taskDetails);

    //         }
    //     }
    //     initLoading();

    // },
    //     []);
    React.useEffect(() => {
    },
        []);
    const GetResult = async () => {
        let web = new Web("");
        let taskDetails = [];
        taskDetails = await web.lists
            .getByTitle(this.state.listName)
            .items
            .getById(this.state.itemID)
            .select("ID", "Title", "Comments")
            .get()
        console.log(taskDetails);
        await this.GetTaskUsers();

        this.currentUser = this.GetUserObject(this.props.userDisplayName);

        let tempTask = {
            ID: 'T' + taskDetails["ID"],
            Title: taskDetails["Title"],
            Comments: JSON.parse(taskDetails["Comments"])
        };

        console.log(tempTask);

        this.setState({
            Result: tempTask
        });
    }

} export default ComponentPortPolioPopup;

