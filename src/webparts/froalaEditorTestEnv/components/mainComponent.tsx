import * as React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import Froalaeditor from "froala-editor";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';


export default function MainComponent() {
    const [model, setModel] = React.useState("");
    const [ShowOutPut, setShowOutPut] = React.useState(false);

    const handleModelChange = (event: any) => {
        setModel(event)
    }
    const configuration = {
        enter: Froalaeditor.ENTER_BR,
        key: "nB3B2F2A1C2F2E1rA1C7A6D6E1D4G3E1C10C6eUd1QBRVCDLPAZMBQ==",
        tableStyles: {
            "no-border": "No border",
        },
        useClasses: false,
        attribution: false,
        toolbarSticky: false,
        charCounterCount: true,
        fontFamilySelection: true,
        fontSizeSelection: true,
        paragraphFormatSelection: true,
        heightMin: 200,
        heightMax: 550,
        // linkInsertButtons: [],
        toolbarButtons: {
            'moreText': {
                'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
            },
            'moreParagraph': {
                'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
            },
            'moreRich': {
                'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
            },
            'moreMisc': {
                buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
                align: 'right',
                buttonsVisible: 3
            }
        },
        // linkList: [],
    }
    return (
        <div>
            <div className="col froala-comment-box">
                <FroalaEditor
                    config={configuration}
                    onModelChange={handleModelChange}
                />
            </div>
            <button onClick={() => setShowOutPut(!ShowOutPut)}>Show Output</button>
            {ShowOutPut ?
                <div className="border p-1 my-5">
                    <FroalaEditorView
                        model={model}
                    />
                </div> : null}
        </div>
    );
}
