import * as React from "react";
import FroalaEditor from "react-froala-wysiwyg";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";




export default function FroalaEditorComponent(Props: any) {
    const [model, setModel] = React.useState(Props?.EditorValue);
    const callBack: any = Props?.callBack;

    const handleModelChange = (event: any) => {
        setModel(event);
        onModelChange(event);
    }
    const configuration = {
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
        heightMin: 150,
        heightMax: 550,
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
            },
            
        },

    }
    const onModelChange = (model: any) => {
        let edData = model;
        $('.hiddendiv').html(edData);
        $(".hiddendiv p:last-child").remove();
        let newData = $('.hiddendiv').html();
        callBack(newData)
    };
    return (
        <div>
            <div className="col froala-comment-box" id="uploadCommentFroalaEditor">
                <FroalaEditor
                    config={configuration}
                    onModelChange={handleModelChange}
                    model={model}  
                />
            </div>
            <div className="hiddendiv" style={{ display: "none" }}>
            </div>
        </div>
    );
}
