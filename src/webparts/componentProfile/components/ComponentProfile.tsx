import React, { useEffect, useState } from 'react';
import { IComponentProfileProps } from './IComponentProfileProps';
import Portfolio from './Portfoliop';
import { Web } from 'sp-pnp-js';

function ComponentProfile(props: IComponentProfileProps) {
  const {
    Context,
    dropdownvalue,
    MasterTaskListID,
    TaskUserListID,
    SmartMetadataListID,
  } = props;

  const [AllTaskuser, setAllTaskuser] = useState([]);

  useEffect(() => {
    const getTaskUsers = async () => {
      try {
        let web = new Web(props.siteUrl);
        let taskUsers = await web.lists
          .getById(props.TaskUserListID)
          .items.select(
            "Id",
            "Email",
            "Suffix",
            "Title",
            "Item_x0020_Cover",
            "AssingedToUser/Title",
            "AssingedToUser/Id",
            "AssingedToUser/Name",
            "UserGroup/Id",
            "ItemType"
          )
          .expand("AssingedToUser", "UserGroup")
          .get();
        setAllTaskuser(taskUsers);
      } catch (error) {
        console.log(error);
      }
    };

    getTaskUsers();
  }, [props.siteUrl, props.TaskUserListID]);

  return (
    <div>
      <Portfolio SelectedProp={props} TaskUser={AllTaskuser?.length > 0 ? AllTaskuser : []} />
    </div>
  );
}

export default ComponentProfile;
