
import React, { useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditorComponent = ({ editorState, setEditorState, usedFor }: any) => {
    const onChange = async (value: any) => {
        setEditorState(value);
        console.log('New editor state:', editorState.getCurrentContent().getPlainText());
    };
    useEffect(() => {
        if (usedFor === "HomePage") {
            setTimeout(() => {
                const parentelements = document.querySelector('.public-DraftStyleDefault-block');
                parentelements.classList.add('d-flex')
                const elements = document.querySelectorAll('.rdw-link-decorator-wrapper');
                console.log(`Found ${elements.length} elements with the selector .rdw-link-decorator-wrapper`);
                elements.forEach(element => {
                    element.classList.add('HomepageTiles', 'Tile-Style2', 'justify-center');
                    element.querySelectorAll('a').forEach(anchor => {
                        anchor.classList.add('tile'); // Add the new class to the anchor tags
                    });
                });
            }, 1000)
        }
    }, [editorState, usedFor]);

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