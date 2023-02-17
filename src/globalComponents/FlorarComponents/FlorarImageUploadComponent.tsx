import * as React from 'react';
import "./Style.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import Froala from "react-froala-wysiwyg";

const defaultContent = "";

export interface ITeamConfigurationProps {
    callBack: (dt: any) => void;
}

const froalaEditorConfig = {
    heightMin: 230,
    heightMax: 500,
    // width:250,
    pastePlain: true,
    wordPasteModal: false,
    listAdvancedTypes: false,
    paragraphDefaultSelection: 'Normal',
    attribution: false,
    quickInsertEnabled: false,
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    placeholderText: "Copy & Paste Image Here!",
    key: 'nB3B2F2A1C2F2E1rA1C7A6D6E1D4G3E1C10C6eUd1QBRVCDLPAZMBQ==',

    events: {
        "image.beforeUpload": function (files: any, arg1: any, arg2: any) {
            var editor = this;
            if (files.length) {
                if (files[0].size / 1000 > 255) {
                    alert("Image file size exceeded the limit");
                    return false;
                } else {
                    // Create a File Reader.
                    var reader = new FileReader();
                    // Set the reader to insert images when they are loaded.
                    reader.onload = (e) => {
                        var result = e.target.result;
                        editor.image.insert(result, null, null, editor.image.get());
                    };
                    // Read image as base64.
                    reader.readAsDataURL(files[0]);
                    let data = files[0]
                    var reader = new FileReader();
                    reader.readAsDataURL(data);
                    let ImageRawData:any =''
                    reader.onloadend = function () {
                        var base64String: any = reader.result;
                        console.log('Base64 String - ', base64String);
                        ImageRawData = base64String.substring(base64String.indexOf(', ') + 1)
                        
                    }
                    if(ImageRawData.length > 0){
                        this.imageArrayUpdateFunction(ImageRawData);
                    }
                }
            }
            editor.popups.hideAll();
            return false;
        }
    }
};

export default class App extends React.Component<ITeamConfigurationProps> {
    public render(): React.ReactElement<{}> {
        return (
            <div className="App" id="UpdateTestCase">
                <Froala
                    model={defaultContent}
                    onModelChange={this.onModelChange}
                    tag="textarea"
                    config={froalaEditorConfig}
                ></Froala>
            </div>
        );
    }

    private onModelChange = (model: any) => {
        let edData = model;
        let imgArray = model.split("=")
        let ArrayImage: any = [];
        imgArray?.map((data: any, index: any) => {
            if (imgArray?.length > 8) {
                if (index == 1) {
                    ArrayImage.push(data)
                }
            }

        })
        let elem = document.createElement("img");
        elem.innerHTML = edData;
        this.imageArrayUpdateFunction(ArrayImage);
    };

    private imageArrayUpdateFunction = (ImageData: any) => {
        let tempArray = ImageData.toString();
        let data1 = tempArray.split('"')
        this.props.callBack(data1[1]);
    }

}
