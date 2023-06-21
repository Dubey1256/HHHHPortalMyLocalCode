import * as React from 'react';
import TeamConfigurationCard from '../TeamConfiguration/TeamConfiguration';
import { useState } from 'react'
import TimeEntryPopup from './TimeEntryComponent';

const NewTameSheetComponent = (props: any) => {
    const TeamConfigInfo = props?.props?.Items;
    const AllListIdData = props?.AllListId
    const [TeamConfig, setTeamConfig] = useState()
    const DDComponentCallBack = (dt: any) => {
        setTeamConfig(dt)
        console.log(TeamConfig)
        console.log(TeamConfig)
        props?.TeamConfigDataCallBack(dt);
    }
    const ComponentCallBack = (dt: any) => {
        props?.TeamConfigDataCallBack(dt);
    }
    // var itemInfo = {
    //     siteURL: TeamConfigInfo?.siteUrl,
    //     listName: TeamConfigInfo?.listName,
    //     itemID: TeamConfigInfo?.Id
    // }
    return (
        <div>
            <div>
                <TeamConfigurationCard ItemInfo={TeamConfigInfo} parentCallback={DDComponentCallBack} AllListId={AllListIdData}>
                </TeamConfigurationCard>
            </div>
            <div>
                {AllListIdData.isShowTimeEntry ? <TimeEntryPopup props={TeamConfigInfo} Context={props.props.context} parentCallback={ComponentCallBack}/> : null}
            </div>
        </div>
    )
}
export default NewTameSheetComponent;