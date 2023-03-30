import * as React from 'react';
import TeamConfigurationCard from '../TeamConfiguration/TeamConfiguration';
import { useState } from 'react'
import TimeEntryPopup from './TimeEntryComponent';

const NewTameSheetComponent = (props: any) => {
    const TeamConfigInfo = props?.props?.Items;
    const [TeamConfig, setTeamConfig] = useState()
    const DDComponentCallBack = (dt: any) => {
        setTeamConfig(dt)
        console.log(TeamConfig)
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
                <TeamConfigurationCard ItemInfo={TeamConfigInfo} parentCallback={DDComponentCallBack}>
                </TeamConfigurationCard>
            </div>
            <div>
                <TimeEntryPopup props={TeamConfigInfo} />
            </div>
        </div>
    )
}
export default NewTameSheetComponent;