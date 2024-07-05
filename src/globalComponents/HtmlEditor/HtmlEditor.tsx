import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Collapse from "bootstrap/js/dist/collapse";

export default function FroalaEditorComponentJodIt(Props: any) {
    const callBack = Props?.HtmlEditorStateChange;
    const editor = useRef(null);
    const [content, setContent] = useState(Props?.editorValue);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: Props?.placeholder || 'Start typing...',
        uploader: {
            insertImageAsBase64URI: true
        },
        extraButtons: [
            {
                name: 'insertAccordion',
                iconURL: 'https://cdn0.iconfinder.com/data/icons/leading-international-corporate-website-app-collec/16/Expand_menu-512.png',
                tooltip: 'Insert Accordion',
                exec: (editor: any) => {
                    const id = `accordionExample-${Date.now()}`;
                    const accordionHTML = `
                        <details>
                            <summary>
                              <a> <span>Accordion Title</span> </a>
                            </summary>
                            <div class="expand-AccordionContent border clearfix">
                              Fill Accordion Content Here...
                            </div>
                        </details>
                    `;
                    editor.s.insertHTML(accordionHTML);
                }
            }
        ]
    }), [Props?.placeholder]);

    const handleModelChange = (model: any) => {
        setContent(model);
        onModelChange(model);
    };

    const onModelChange = (model: any) => {
        callBack(model);
    };

    return (
        <div className="jodit-container" style={{ width: '100%' }}>
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={(newContent) => setContent(newContent)}
                onChange={(newContent) => handleModelChange(newContent)}
            />
        </div>
    );
}
