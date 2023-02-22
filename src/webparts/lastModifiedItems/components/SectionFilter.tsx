import { Checkbox, SearchBox } from "@fluentui/react";
import * as React from "react";

export interface ISectionFilterProps {
    SearchText: string;
    FilterByComponents: boolean;
    FilterByService: boolean;
    OnSearchTextChange: (ev: any, searchText: string) => void;
    OnComponentsCheck: (ev: any, compChecked: boolean) => void;
    OnServiceCheck: (ev: any, serviceChecked: boolean) => void;
}

const controlStyles = {
    root: {
        margin: '10px 5px 20px 0px',
        maxWidth: '300px'
    }
};

const SectionFilter: React.FC<ISectionFilterProps> = (props) => {
    return (
        <div>
            <div className="ms-Grid-col ms-sm8 ms-md-8 ms-lg8">
                <SearchBox value={props.SearchText} onChange={props.OnSearchTextChange} styles={controlStyles} />
            </div>
            <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                <Checkbox checked={props.FilterByComponents} onChange={props.OnComponentsCheck} label="Components" styles={controlStyles} />
            </div>
            <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                <Checkbox checked={props.FilterByService} onChange={props.OnServiceCheck} label="Service" styles={controlStyles} />
            </div>
        </div>
    );
};

export default SectionFilter;