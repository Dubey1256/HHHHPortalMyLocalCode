import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

export default function ImageUploadContainer(Props: any) {
    const callBack = Props?.callBack;
    const editor = useRef(null);
    const [content, setContent] = useState(Props?.editorValue);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: Props?.placeholder || 'Copy & Paste Image Here!',
        uploader: {
            insertImageAsBase64URI: true
        }
    }), [Props?.placeholder]);

    const handleModelChange = (model: any) => {
        setContent(model);
        onModelChange(model);
    };

    const onModelChange = (model: any) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(model, 'text/html');
        const imgTags = doc.querySelectorAll('img');
        let src:any;
        imgTags.forEach(img => {
            src = img.getAttribute('src');
        })
        if(src?.length > 0){
            callBack(src);
        } 
    };

    return (
        <div className="jodit-container-Image-Upload-Container" id="uploadImageFroalaEditor" style={{ width: '100%' }}>
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
