import * as React from 'react';
import 'setimmediate'; 
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, Modifier, ContentState, convertFromHTML } from 'draft-js';  
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html'; 

export interface IHtmlEditorProps {
    editorValue : any;
    HtmlEditorStateChange: (editorChangeValue:any) => void;   
  }
  
  export interface IHtmlEditorState {  
    editorState : EditorState;
  }

  export class HtmlEditorCard extends React.Component<IHtmlEditorProps, IHtmlEditorState> {
    constructor(props:IHtmlEditorProps){
      super(props);      
      this.state ={        
        editorState : EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML('<p>'+this.props.editorValue+'</p>').contentBlocks
            )
          ),
      }     
    }

    private onEditorStateChange = (editorState:EditorState):void => { 
        //console.log('set as HTML:', draftToHtml(convertToRaw(editorState.getCurrentContent()))); 
        let value:any = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.props.HtmlEditorStateChange(value);
        this.setState({  
          editorState,  
        });  
      }
    
      public render(): React.ReactElement<IHtmlEditorProps> {
        const { editorState } = this.state;
        return (
                <Editor
                      editorState={editorState}
                      onEditorStateChange={this.onEditorStateChange}                     
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{ width: '100%', border: "2px solid #ccc"}}
                  />
                );
        }
  }

    export default HtmlEditorCard;



// How to use this component and required parameters

// step-1 : import this component where you need to use 
// step-2 : call this component and pass some parameters follow step:2A and step:2B

// step-2A :
  //  editorValue ==== {message data}
  //  HtmlEditorStateChange ===== CallBackFunction 

// step-2B :
//  <HtmlEditorCard editorValue={EditData.Body} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard>