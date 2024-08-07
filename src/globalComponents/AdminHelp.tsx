import {useState, useEffect, useContext} from 'react'
import { Web } from 'sp-pnp-js'
import { Panel, PanelType } from '@fluentui/react'
import { myContextValue } from './globalCommon'
import HtmlEditorCard from './HtmlEditor/HtmlEditor'
import Tooltip from './Tooltip'
import React from 'react'
var MyContextdata: any
let PostQuestionDescription: any
let ID: any;

const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP")

const AdminHelp = (props: any) => {
    MyContextdata = useContext(myContextValue)
    const [componentData, setComponentData]: any = useState(props?.Item)
    const [IsOpenAddQuestion, setIsOpenAddQuestion] = useState(false)
    const [question, setQuestion] = useState('')
    const [smartHelpData, setSmartHelpData] = useState([])
    const [editQuestionPopup, setEditQuestionPopup] = useState(false)
    const [dataUpdate, setDataUpdate] = useState<any>({})

    useEffect(() => {
        GetSmartHelpDetails();
    }, [])

    const closePanel = () => {
        MyContextdata.closeadminHelpCallBack()
    }

    const GetSmartHelpDetails = async () => {
        let smartHelpDetails = await web.lists.getByTitle("SmartHelp").items.select("Title, Id, Body, Permission, ItemType, Components/Id, Components/Title").expand("Components").getAll();
        setSmartHelpData(smartHelpDetails)
    }

    const closeAddQuestionPopup = () => {
        setIsOpenAddQuestion(false)
        PostQuestionDescription = ""
        componentData.QuestionDescription = ""
        setQuestion("")
    }

    const closeEditQuestionPopup = () => {
        setEditQuestionPopup(false)
        setQuestion("")
    }

    const editQuestionHandler = (ques: any) => {
        setEditQuestionPopup(true)
        setDataUpdate(ques)
        ID = ques.Id
    }

    const QuestionDescriptionEditorCallBack = React.useCallback(
        (Editorvalue: any) => {
            let message: any = Editorvalue;
            componentData.QuestionDescription = message;
            PostQuestionDescription = componentData?.QuestionDescription;
            console.log("Editor Data call back ====", Editorvalue);
        },
        []
    );

    const AddQuestionFunc = async () => {
        try {
            let componentId = componentData?.Id;
            const newItem = {
                ItemType: "Question",
                Title: question,
                ComponentsId: { "results": [componentId] },
                Body: PostQuestionDescription || (componentData?.PostQuestionDescription || ""),
            };
            await web.lists.getByTitle("SmartHelp").items.add(newItem);

            // Update the state with the newly added item
            setIsOpenAddQuestion(false);
            let smartHelpDetails = await web.lists.getByTitle("SmartHelp").items.select("Title, Id, Body, Permission, ItemType, Components/Id, Components/Title").expand("Components").getAll();
            setSmartHelpData(smartHelpDetails)
            setQuestion("")
            PostQuestionDescription = "";

        } catch (error) {
            console.log(error);
        }
    }

    const deleteHandler = async (Id: any) => {
      if(confirm("Are you sure you want to delete this Question?")){
        await web.lists.getByTitle("SmartHelp").items.getById(Id).delete()
        .then((i: any) => {
            console.log(i);
            smartHelpData.map((catId: any, index: any) => {
                if (Id == catId.Id) {
                    smartHelpData.splice(index, 1);
                }
            })
        })
        setSmartHelpData((SmartHelpDetails: any) => [...SmartHelpDetails]);
      }    
    }

    const updateDetails = async () => {
        try {
            await web.lists.getByTitle("SmartHelp").items.getById(ID).update({
                Title: question ? question : dataUpdate?.Title,
                Body: PostQuestionDescription ? PostQuestionDescription || (componentData?.PostQuestionDescription || "") : dataUpdate?.Body,
            }).then(async (i: any) => {
                console.log(i);
                const updatedSmartHelpDetails = await web.lists.getByTitle("SmartHelp").items.select("Title, Id, Body, Permission, ItemType, Components/Id, Components/Title").expand("Components").getAll();
                setSmartHelpData(updatedSmartHelpDetails);
                setQuestion("");
                PostQuestionDescription = "";
                setEditQuestionPopup(false);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        {`Admin Help - ${componentData?.Title}`}
                    </span>
                </div>
            </div>
        );
    };
    const onRenderCustomHeaderQuestion = () => {
        return (
            <>
                <div className="subheading siteColor">Add Question</div>
                <Tooltip ComponentId="1626" />
            </>
        );
    };

    const onRenderHeaderQuestionEdit = () => {
        return (
            <>
                <div className="subheading siteColor">Edit Question</div>
                <Tooltip ComponentId="1626" />
            </>
        );
    };


return (
  <>
    <Panel
      type={PanelType.large}
      isOpen={true}
      isBlocking={false}
      onDismiss={() => {
        closePanel();
      }}
      onRenderHeader={onRenderCustomHeader}
      closeButtonAriaLabel="Close"
    >
      <span className="alignCentre">
        {componentData?.Short_x0020_Description_x0020_On.replace("<p>", "").replace("</p>", "")}
      </span>
      <div className="col-sm-12 mb-10">
        <a
          className="hreflink pull-right"
          target="_blank"
          data-interception="off"
          href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/HHHHPortfolioDescriptionForm.aspx?taskId=${componentData?.Id}`}
        >
          Manage Content
        </a>
        <span className="mx-2 pull-right"> | </span>
        <a
          className="pull-right"
          target="_blank"
          data-interception="off"
          href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Question-Management.aspx?taskId=${componentData?.Id}`}
        >
          Manage Questions
        </a>
      </div>
      <div className="col-sm-12 form-group">
        <fieldset className="fieldsett">
          <legend>FAQs</legend>
          <div className="col-sm-12 mb-10">
            <div className="col-sm-12">
              <span
                className="pull-right hreflink siteColor"
                onClick={() => setIsOpenAddQuestion(true)}
              >
                Ask Questions
              </span>
            </div>
          </div>
          <div className="col-sm-12">
            {smartHelpData
              ?.filter((elem: any) => elem?.ComponentsId != undefined)
              .map((item: any) =>
                componentData?.Id === item.ComponentsId?.results[0]
                  ? item.ItemType === "Question" && (
                      <div key={item.Id}>
                        <details open>
                          <summary>
                            <label className="toggler full_width alignCenter">
                              <span className="pull-left">{item.Title}</span>

                              <div className="ml-auto alignCenter">
                                <span
                                  className="svg__iconbox svg__icon--edit"
                                  onClick={() => editQuestionHandler(item)}
                                >
                                  Edit
                                </span>
                                <span
                                  className="svg__iconbox svg__icon--cross"
                                  onClick={() => deleteHandler(item.Id)}
                                >
                                  Delete
                                </span>
                              </div>
                            </label>
                          </summary>
                          <div className="border border-top-0 p-2">
                            {item.Body?.replace(/<[^>]*>/g, "")}
                          </div>
                        </details>
                      </div>
                    )
                  : null
              )}

            {smartHelpData
              ?.filter((elem: any) => elem.ComponentsId === undefined)
              .map((filteredItem: any) =>
                filteredItem?.Components != undefined &&
                componentData?.Id === filteredItem?.Components[0]?.Id
                  ? filteredItem.ItemType === "Question" && (
                      <div key={filteredItem.Id}>
                        <details open>
                          <summary>
                            <label className="toggler full_width alignCenter">
                              <span className="pull-left">
                                {filteredItem.Title}
                              </span>

                              <div className="ml-auto alignCenter">
                                <span
                                  className="svg__iconbox svg__icon--edit hreflink"
                                  onClick={() =>
                                    editQuestionHandler(filteredItem)
                                  }
                                >
                                  Edit
                                </span>
                                <span
                                  className="svg__iconbox svg__icon--cross hreflink"
                                  onClick={() => deleteHandler(filteredItem.Id)}
                                >
                                  Delete
                                </span>
                              </div>
                            </label>
                          </summary>
                          <div className="border border-top-0 p-2">
                            {filteredItem.Body?.replace(/<[^>]*>/g, "")}
                          </div>
                        </details>
                      </div>
                    )
                  : null
              )}
          </div>
        </fieldset>
      </div>
    </Panel>

    <Panel
      onRenderHeader={onRenderCustomHeaderQuestion}
      isOpen={IsOpenAddQuestion}
      isBlocking={false}
      onDismiss={() => closeAddQuestionPopup()}
      closeButtonAriaLabel="Close"
      type={PanelType.medium}
    >
      <div className="modal-body clearfix">
        <div className="input-group mb-2">
          <label className="form-label full-width">Title</label>
          <input
            type="text"
            className="form-control"
            defaultValue={`${componentData?.Title} - ${question}`}
            onChange={(e) => setQuestion(e.target.value)}
          ></input>
        </div>
        <div className="mb-2">
          <label className="form-label">Description</label>
          <div>
            <HtmlEditorCard
              editorValue={
                PostQuestionDescription != undefined
                  ? PostQuestionDescription
                  : ""
              }
              HtmlEditorStateChange={QuestionDescriptionEditorCallBack}
            ></HtmlEditorCard>
          </div>
        </div>
      </div>
      <footer className="footer-right">
        <div className="">
          <button className="btn btn-primary" onClick={() => AddQuestionFunc()}>
            Save
          </button>
          <button
            className="btn btn-default ms-1"
            onClick={() => closeAddQuestionPopup()}
          >
            Cancel
          </button>
        </div>
      </footer>
    </Panel>

    <Panel
      isOpen={editQuestionPopup}
      isBlocking={false}
      onDismiss={() => closeEditQuestionPopup()}
      closeButtonAriaLabel="Close"
      onRenderHeader={onRenderHeaderQuestionEdit}
      type={PanelType.medium}
    >
      <div className="modal-body clearfix">
        <div className="input-group mb-2">
          <label className="form-label full-width">Title</label>
          <input
            className="form-control"
            type="text"
            defaultValue={dataUpdate?.Title}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          ></input>
        </div>
        <div className="mb-2">
          <label className="form-label full-width">
            Description
          </label>
          <div>
            <HtmlEditorCard
              editorValue={
                componentData?.QuestionDescription 
                  ? componentData?.QuestionDescription
                  : dataUpdate?.Body
              }
              HtmlEditorStateChange={QuestionDescriptionEditorCallBack}
            ></HtmlEditorCard>
          </div>
        </div>
      </div>
      <footer className="footer-right">
        <div className="align-items-center d-flex justify-content-between">
          <div className="">
            <button
              className="me-1 btn btn-primary"
              onClick={() => updateDetails()}
            >
              Save
            </button>
            <button
              className="btn btn-default"
              onClick={() => closeEditQuestionPopup()}
            >
              Cancel
            </button>
          </div>
        </div>
      </footer>
    </Panel>
  </>
);
}

export default AdminHelp;
