import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';


export default function HtmlEditorCard(Props: any) {
    const callBack = Props?.HtmlEditorStateChange;
    const editor = useRef(null);
    const [content, setContent] = useState(Props?.editorValue);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: Props?.placeholder || 'Write Description....',
        uploader: {
            insertImageAsBase64URI: true
        },
        buttons: [
            'bold', 'italic', 'underline', 'eraser','|', 'ul','ol','|','font','fontsize','|','table', 'image','link','|','undo','redo','preview','|','source',
        ],
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
                              <a> <span>Custom Accordion</span> </a>
                            </summary>
                            <div class="expand-AccordionContent border clearfix">
                              
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
                onBlur={(newContent:any) => setContent(newContent)}
                onChange={(newContent:any) => handleModelChange(newContent)}
            />
        </div>
    );
}
