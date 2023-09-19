import * as React from 'react';
import { Modal } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from '../TeamConfiguration/TeamConfiguration';
import { arraysEqual, Panel, PanelType } from 'office-ui-fabric-react';

export interface IAddActivityTaskProps {
    CreatOpen:(item:any)=>void;
    Close:()=>void;
    SelectedItem:any;
}
  
export interface IAddActivityTaskState {  
    isModalOpen : boolean;
    AllFilteredAvailableComoponent : any;
    //Portfolio_x0020_Type : string;
    textTitle : string;
    IsComponentPopup : boolean;
    Item_x0020_Type : string;
    SelectedItem : any;
    TeamConfig : any;
    OpenModal: string;
    ChildItemTitle : any;
}

export class AddActivityTaskCard extends React.Component<IAddActivityTaskProps, IAddActivityTaskState> {
    constructor(props:IAddActivityTaskProps){
        super(props);
        this.state ={
            isModalOpen : false,
            AllFilteredAvailableComoponent : [],
            //Portfolio_x0020_Type : 'Component',
            textTitle : '',
            IsComponentPopup : false,
            Item_x0020_Type : 'SubComponent',
            SelectedItem : this.props.SelectedItem,
            TeamConfig : [],
            OpenModal : '',
            ChildItemTitle : []
        }
        
        //this.Load()
    }

    public render(): React.ReactElement<IAddActivityTaskProps> {
        return (
            <>
            </>
    );
      }
}

export default AddActivityTaskCard;