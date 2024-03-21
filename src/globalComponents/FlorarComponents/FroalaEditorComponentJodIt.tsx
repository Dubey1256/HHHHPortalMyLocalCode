import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

export default function FroalaEditorComponentJodIt(Props: any) {
    const callBack: any = Props?.callBack;

    const editor = useRef(null);
    const [content, setContent] = useState(Props?.EditorValue);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: Props?.placeholder || 'Start typing...',
            uploader: {
                insertImageAsBase64URI: true // Enable pasting images as base64 URIs
            }
        }),
        [Props?.placeholder]
    );

    const handleModelChange = (model: any) => {
        onModelChange(model);
        setContent(model);
    };

    const onModelChange = (model: any) => {
        let edData = model;
        const div = document.createElement('div');
        div.innerHTML = edData;
        const lastChild = div.lastElementChild;
        if (lastChild && lastChild.tagName === 'P' && lastChild.innerHTML === '') {
            div.removeChild(lastChild);
        }
        let newData = div.innerHTML;
        callBack(newData);
    };


    return (
        <div className="jodit-container" style={{ width: '100%' }}>
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={(newContent: any) => setContent(newContent)}
                onChange={(newContent: any) => handleModelChange(newContent)}
            />
        </div>

    );
};
