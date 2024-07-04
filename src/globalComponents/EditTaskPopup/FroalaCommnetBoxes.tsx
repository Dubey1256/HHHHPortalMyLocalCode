/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import 'setimmediate';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
export interface IHtmlEditorProps {
    editorValue: any;
    HtmlEditorStateChange: (editorChangeValue: any) => void;
}
export interface IHtmlEditorState {
    editorState: EditorState;
}
export class HtmlEditorCard extends React.Component<IHtmlEditorProps, IHtmlEditorState> {
    constructor(props: IHtmlEditorProps) {
        super(props);
        this.state = {
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p>' + this.props.editorValue + '</p>').contentBlocks
                )
            ),
        }
    }
    private onEditorStateChange = (editorState: EditorState): void => {
        //console.log('set as HTML:', draftToHtml(convertToRaw(editorState.getCurrentContent())));
        const value: any = draftToHtml(convertToRaw(editorState.getCurrentContent()));
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
                wrapperStyle={{ width: '100%', border: "1px solid #ccc" }}
            />
        );
    }
}



export default HtmlEditorCard;