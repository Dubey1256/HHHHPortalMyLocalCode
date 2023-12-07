import React from 'react'
import CreateActivity from "../../../globalComponents/CreateActivity"
const HHHHQuickPanel = (props: any) => {
    
    const params = new URLSearchParams(window.location.search)
    let compID = params.get('Component')
    let compTitle = params.get('ComponentTitle')
    let compsiteUrl = params.get('Siteurl')

    let allListId = {
      siteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH/SP",
      MasterTaskListID: "ec34b38f-0669-480a-910c-f84e92e58adf",
      TaskUsertListID: "b318ba84-e21d-4876-8851-88b94b9dc300",
      SmartMetadataListID: "01a34938-8c7e-4ea6-a003-cee649e8c67a",
      SmartInformationListID: "edf0a6fb-f80e-4772-ab1e-666af03f7ccd",
      DocumentsListID: "d0f88b8f-d96d-4e12-b612-2706ba40fb08",
      TaskTimeSheetListID: "464fb776-e4b3-404c-8261-7d3c50ff343f",
      AdminConfigrationListID: "e968902a-3021-4af2-a30a-174ea95cf8fa",
      TaskTypeID:"21b55c7b-5748-483a-905a-62ef663972dc",
      TimeEntry: false,
      SiteCompostion: false,
  }

  let selectedItem = {
    NoteCall: 'Task',
    Id: compID,
    PageType: 'QuickTask'
  }
  return (
    <div>
      <CreateActivity selectedItem={selectedItem} pageName={'QuickTask'} fullWidth={true} Id={compID} Title={compTitle} AllListId={allListId} SiteUrl={compsiteUrl}/>
    </div>
  )
}

export default HHHHQuickPanel
