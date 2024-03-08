import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditorComponent = ({ editorState, setEditorState }:any) => {
    const onChange = async (value:any) => {
        setEditorState(value);
        console.log('New editor state:', editorState.getCurrentContent().getPlainText());       
    };

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(value) => {
                    onChange(value);
                }}
                stripPastedStyles
                ariaLabel="draftEditor"
            />
        </div>
    );
};
export default EditorComponent;
