import React from "react";
import CreateActivity from "../../../globalComponents/CreateActivity"
const HHHHQuickPanel = ({props}: any) => {
  const params = new URLSearchParams(window.location.search);
  let compID = params.get("Component");
  let compTitle = params.get("ComponentTitle");
  let CompleteUrl = window.location.href;
  let siteUrlData = CompleteUrl?.split("Siteurl")[1];
  siteUrlData = siteUrlData?.slice(1, siteUrlData?.length);
  let paramSiteUrl = siteUrlData;

  let allListId = {
    siteUrl: props?.siteUrl,
    MasterTaskListID: props?.MasterTaskListID,
    TaskUsertListID: props?.TaskUsertListID,
    SmartMetadataListID: props?.SmartMetadataListID,
    SmartInformationListID: props?.SmartInformationListID,
    DocumentsListID: props?.DocumentsListID,
    TaskTimeSheetListID: props?.TaskTimeSheetListID,
    AdminConfigrationListID: props?.AdminConfigrationListID,
    TaskTypeID: props?.TaskTypeID,
    TimeEntry: false,
    SiteCompostion: false,
  };

  let selectedItem = {
    NoteCall: "Task",
    Id: compID,
    PageType: "QuickTask",
    siteUrl: props?.siteUrl,
  };
  return (
    <div>
      <CreateActivity
        selectedItem={selectedItem}
        pageName={"QuickTask"}
        fullWidth={true}
        Id={compID}
        Title={compTitle}
        AllListId={allListId}
        SiteUrl={paramSiteUrl}
      />
    </div>
  );
};

export default HHHHQuickPanel;
