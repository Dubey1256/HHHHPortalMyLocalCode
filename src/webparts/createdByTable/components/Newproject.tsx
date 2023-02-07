import * as React from "react";
import { INewprojectProps } from "./INewprojectProps";
//import Components from "./MasterTask/Components";
import Tables from "./mui/Tables";
// import Components from "./MasterTask/Components";

// import CheckboxButton from "./Test/CheckboxButton";

// import RadioButton from "./Test/RadioButton";
// import Table from "./Test/Table";

export default class Newproject extends React.Component<INewprojectProps, {}> {
  public render(): React.ReactElement<INewprojectProps> {
    return (
      <section>
        {/* <Table/> */}
        {/* <RadioButton/> */}
        {/* <CheckboxButton/> */}
        {/* <Components/> */}
        <Tables />
       
      </section>
    );
  }
}
