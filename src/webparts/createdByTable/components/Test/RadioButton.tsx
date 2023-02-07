import * as React from "react";

const RadioButton = () => {
  const [radioCheck, setRadioCheck]: any = React.useState("One");

  const radioChange = (e: any) => {
    if (e === "One") {
      setRadioCheck(e);
    } else if (e === "Two") {
      setRadioCheck(e);
    } else if (e === "Three") {
      setRadioCheck(e);
    } else {
      setRadioCheck(e);
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
          type={"radio"}
          value={radioCheck}
          onChange={() => radioChange("One")}
          checked={radioCheck==="One" ? true : false}
        />
        <label>One</label>
        <br />
        <input
          type={"radio"}
          value={radioCheck}
          onChange={() => radioChange("Two")}
          checked={radioCheck==="Two" ? true : false}
        />
        <label>Two</label>
        <br />
        <input
          type={"radio"}
          value={radioCheck}
          onChange={() => radioChange("Three")}
          checked={radioCheck==="Three" ? true : false}
        />
        <label>Three</label>
        <br />
      </div>
    </div>
  );
};
export default RadioButton;
