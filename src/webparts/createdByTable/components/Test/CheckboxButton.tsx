import * as React from "react";
let a: any = [];
const CheckboxButton = () => {
  const [radioCheck, setRadioCheck]: any = React.useState();
  
  const radioChange = (e: any) => {
    let b: any = "";
    if (e === "One") {
      b = e;
      setRadioCheck("");
    } else if (e === "Two") {
      b = e;
      setRadioCheck("");
    } else if (e === "Three") {
      b = e;
      setRadioCheck("");
    } else {
      b = e;
      setRadioCheck("");
    }

    if(b==="One" || b==="Two" || b==="Three"){
        a.push(b);
        console.log(a);
        setRadioCheck(a);
    }
    
  };
  return (
    <div
      style={{
        flex: 1,
        height: "100vh",
        width: "100%",
      }}
    >
      {console.log(radioCheck)}
      <div>
        <input
          type={"text"}
          value={radioCheck}
          onChange={(e) => radioChange(e.target.value)}
        />
        <br />
        <input
          type={"checkbox"}
          value={radioCheck}
          onChange={() => radioChange("One")}
          checked={radioCheck === "One" ? true : false}
        />
        <label>One</label>
        <br />
        <input
          type={"checkbox"}
          value={radioCheck}
          onChange={() => radioChange("Two")}
          checked={radioCheck === "Two" ? true : false}
        />
        <label>Two</label>
        <br />
        <input
          type={"checkbox"}
          value={radioCheck}
          onChange={() => radioChange("Three")}
          checked={radioCheck === "Three" ? true : false}
        />
        <label>Three</label>
        <br />
      </div>
    </div>
  );
};
export default CheckboxButton;
