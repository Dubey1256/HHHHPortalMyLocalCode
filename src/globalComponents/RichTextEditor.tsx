import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

export default function FroalaEditorComponentJodIt(Props: any) {
    const callBack: any = Props?.HtmlEditorStateChange;

    const editor = useRef(null);
    const [content, setContent] = useState(Props?.EditorValue);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: Props?.placeholder || 'Start typing...',
            uploader: {
                insertImageAsBase64URI: true 
            }
        }),
        [Props?.placeholder]
    );

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
                onBlur={(newContent: any) => setContent(newContent)}
                onChange={(newContent: any) => handleModelChange(newContent)}
            />
        </div>

    );
};