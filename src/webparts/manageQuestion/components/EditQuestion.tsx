import * as React from "react";
import { Web } from "sp-pnp-js";
import { Panel, PanelType } from "@fluentui/react";
import moment from "moment";
import HtmlEditorCard from "../../../globalComponents/HtmlEditor/HtmlEditor";

let PostQuestionDescription: any;
let AllListId: any;

const EditQuestion = (props: any) => {
  const [data, setData] = React.useState(props?.dataUpdate);
  const [question, setQuestion] = React.useState(props?.dataUpdate?.Title);
  const [components, setComponents] = React.useState(
    props?.dataUpdate?.Components
  );

  AllListId = {
    MasterTaskListID: props?.AllListId?.MasterTaskListID,
    SmartHelpListID: props?.AllListId?.SmartHelpListID,
    siteUrl: props?.AllListId?.siteUrl,
  };
  const web = new Web(AllListId?.siteUrl);

  React.useEffect(() => {
    loadQuestionDescription();
  },[data])

  const loadQuestionDescription = () => {
    PostQuestionDescription = data?.Body
  }
  const onRenderHeaderQuestionEdit = () => {
    return (
      <>
        <div className="subheading siteColor">Question</div>
      </>
    );
  };

  const clearDescription = () => {
    PostQuestionDescription = "";
  };

  const onRenderFooterQuestionEdit = () => {
    return (
      <>
        <div className="align-items-center d-flex justify-content-between">
          <div>
            <div className="text-left">
              Created
              <>
                {" "}
                {data?.Created != null && data?.Created != undefined
                  ? moment(data?.Created).format("DD/MM/YYYY")
                  : ""}{" "}
              </>{" "}
              by
              <span className="siteColor ms-1">{data?.Author?.Title}</span>
            </div>
            <div className="text-left">
              Last modified
              <span>
                {data?.Modified != null && data?.Modified != undefined
                  ? moment(data?.Modified).format("DD/MM/YYYY")
                  : ""}
              </span>{" "}
              by
              <span className="siteColor ms-1">{data?.Editor?.Title}</span>
            </div>
          </div>
          <div className="text-end">
            <a
              data-interception="off"
              target="_blank"
              href={`${AllListId?.siteUrl}/Lists/SmartHelp/EditForm.aspx?ID=${data?.Id}`}
            >
              Open out-of-the-box form
            </a>
            <button
              className="me-1 btn btn-primary btnCol"
              onClick={() => updateDetails()}
            >
              Submit
            </button>
            <button
              className="btn btn-default"
              onClick={() => {
                props?.closeEditQuestionPopup();
                clearDescription();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  };

  const removeComponent = (Id: any) => {
    let componentData = components;
    componentData = componentData.filter((item: any) => item.Id != Id)
    setComponents(componentData)
  }

  const QuestionDescriptionEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      PostQuestionDescription = message;
      data.QuestionDescription = message;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );

  const updateDetails = async () => {
    try {
      await web.lists
        .getById(AllListId?.SmartHelpListID)
        .items.getById(data?.Id)
        .update({
          Title: question ? question : "",
          Body: PostQuestionDescription ? PostQuestionDescription : data?.Body,
          ComponentsId: components
            ? { results: components.map((component: any) => component.Id) }
            : { results: [] },
        })
        .then(async (i: any) => {
          console.log(i);
          props.setQuestion();
          PostQuestionDescription = "";
          props?.closeEditQuestionPopup();
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Panel
        isOpen={true}
        isBlocking={false}
        onDismiss={() => {
          props?.closeEditQuestionPopup();
          clearDescription();
        }}
        closeButtonAriaLabel="Close"
        onRenderHeader={onRenderHeaderQuestionEdit}
        onRenderFooterContent={onRenderFooterQuestionEdit}
        type={PanelType.custom}
        customWidth="800px"
      >
        <div className="modal-body clearfix">
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Question</label>
            <div className="col-sm-10">{question}</div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Answer</label>
            <div className="col-sm-10">
              <HtmlEditorCard
                editorValue={data?.Body || data?.QuestionDescription}
                HtmlEditorStateChange={QuestionDescriptionEditorCallBack}
              ></HtmlEditorCard>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Component</label>
            <div className="col-sm-10">
            {components.map((item: any) => (
              <div key={item?.Id} className="block w-auto">
                <a
                  className="ms-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-interception="off"
                  href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${item?.Id}`}
                >
                  {item?.Title}
                </a>
                <span className="bg-light hreflink svg__icon--cross svg__iconbox" onClick={() => removeComponent(item.Id)}></span>
              </div>
            ))}
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
};
export default EditQuestion;
