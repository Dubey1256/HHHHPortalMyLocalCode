//import React, * as React from "react";
import * as React from "react";
import { useEffect, useState } from 'react';
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import pnp, { Web } from "sp-pnp-js";
import { Label, makeStyles, mergeClasses, tokens, Tooltip as InfoToolTip, useId, } from "@fluentui/react-components";
import { Info16Regular, Add16Regular } from "@fluentui/react-icons";
import { data } from "jquery";
import { TextField } from "office-ui-fabric-react";
import HtmlEditor from '../globalComponents/HtmlEditor/HtmlEditor';
import { myContextValue } from './globalCommon'
const useStyles = makeStyles({
    root: { display: "flex", columnGap: tokens.spacingVerticalS, },
    visible: { color: tokens.colorNeutralForeground2BrandSelected, },
});
const LabelInfoIconToolTip = (props: any) => {
    let siteUrls: any;
    if (props != undefined && props?.ContextInfo?.siteUrl != undefined && props?.ContextInfo?.siteUrl?.toLowerCase()?.indexOf('sites/hhhh/sp') > -1)
        siteUrls = 'https://hhhhteams.sharepoint.com/sites/HHHH'
    else
        siteUrls = props?.ContextInfo?.siteUrl;

  
    // const myContextData2: any = React.useContext<any>(myContextValue);
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
    } = usePopperTooltip({
        trigger: null,
        interactive: true,
        closeOnOutsideClick: false,
        placement: "auto",
    });

    const styles = useStyles();
    const contentId = useId("content");
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [visibleDes, setVisibleDes] = useState(false);
    const [editdes, setEditDes] = useState(false);
    const [res, setRes] = useState<any>("");
    const [copyres, setcopyRes] = useState<any>("");

    const getsiteConfig = async () => {
        try {
            let getdata: any = [];
            let web = new Web(siteUrls);
            getdata = await web.lists.getByTitle("Column Management").items.select("Id", "Title", "InternalName", "LongDescription", "Description").top(4999).filter("InternalName eq  '" + props.columnName + "'").get();
            if (getdata != undefined && getdata.length > 0) {
                if (getdata[0].Description != undefined && getdata[0].Description != null && getdata[0].Description != '')
                    getdata[0].Description = getdata[0].Description.replace(/<[^>]*>|&#[^;]+;/g, '');
                getdata[0].copyTitle = getdata[0].Title;
                setRes(getdata[0]);
                setcopyRes(getdata[0]);
                console.log(props.columnName);
            }

        } catch (error) {
            console.log(props.columnName);
            console.log(error);
        }
    }
    useEffect(() => {
        if (props?.columnName != undefined){
            getsiteConfig()
        }
    }, [props?.columnName]);

    const toggleVisibility = () => {
        setVisibleDes(prevVisible => !prevVisible);
        setTooltipVisible(false);
    };
    let hovericon = false;
    const handleTooltipVisibilityChange = (e: any, data: any) => {
        if (!visibleDes) {
            if (data?.visible == false && hovericon) {
                data.visible = true;
                hovericon = false;
            }
            setTooltipVisible(data?.visible);
        }
        else {
            data.visible = false;
            hovericon = true;
        }
    };
    const CloseDespopup = (val: any) => {
        hovericon = true;

        if (val == 'update')
            setcopyRes(res);
        else
            setRes(copyres);
        setVisibleDes(prevVisible => !prevVisible);
        setTooltipVisible(true);
        setEditDes(false);
    };
    const handleDescriptionChange = (newItemRank: any) => {
        setRes((prevState: any) => ({
            ...prevState,
            Description: newItemRank.target.value
        }));
    }
    const handleTitleChange = (newPageTitle: any) => {
        setRes((prevState: any) => ({
            ...prevState,
            copyTitle: newPageTitle
        }));


    }
    const HtmlEditorCallBack = (items: any) => {
        var pageContent = ""
        if (items == '<p></p>\n') {
            pageContent = ""
        } else {
            pageContent = items
        }
        setRes((prevState: any) => ({
            ...prevState,
            LongDescription: pageContent
        }));
    }
    const editItem = (val: any) => {
        setVisibleDes(true);
        setEditDes(true);
    };
    const handleSave = async () => {
        let web = new Web(siteUrls);
        res.Title = res?.copyTitle;
        let postData: any = {
            Title: res?.copyTitle,
            LongDescription: res?.LongDescription,
            Description: res?.Description,
        }
        await web.lists.getByTitle("Column Management").items.getById(res.Id).update(postData).then((e) => {
            CloseDespopup('update');
        }).catch((error) => {
            console.log('Error:', error);
        });
    };


    return (
        <>
            {res != null && res != '' && props.onlyText == undefined ? <label className="alignCenter form-label full-width gap-1">
                {res?.Title}
                {props?.ShowPencilIcon && <span title="Edit label " className="svg__iconbox svg__icon--info " onClick={() => editItem(res)}></span>}
                {res?.Description && <div className={styles.root}>
                    <InfoToolTip
                        content={{
                            children: (
                                <>
                                    <span dangerouslySetInnerHTML={{ __html: res?.Description }}></span>
                                    {res?.LongDescription && <div className="col-sm-12 mt-2 text-end"> <a className="siteColor" onClick={() => editItem(res)}>Show More ...</a></div>}
                                </>),
                            id: contentId,
                        }}
                        withArrow
                        relationship="label"
                        onVisibleChange={handleTooltipVisibilityChange} >
                        <Info16Regular tabIndex={0} className={(tooltipVisible || !visibleDes) ? styles.visible : ''} onClick={toggleVisibility} />
                    </InfoToolTip>
                </div>}
            </label> : <> {res?.Title}  {res?.Description && <div className={styles.root}>
                <InfoToolTip
                    content={{
                        children: (
                            <>
                                <span dangerouslySetInnerHTML={{ __html: res?.Description }}></span>
                                {res?.LongDescription && <div className="col-sm-12 mt-2 text-end"> <a className="siteColor" onClick={() => editItem(res)}>Show More ...</a></div>}
                            </>),
                        id: contentId,
                    }}
                    withArrow
                    relationship="label"
                    onVisibleChange={handleTooltipVisibilityChange} >
                    <Info16Regular tabIndex={0} className={(tooltipVisible || !visibleDes) ? styles.visible : ''} onClick={toggleVisibility} />
                </InfoToolTip>
            </div>}
            </>

            }


            {(res != null && res != '' && props?.ShowPencilIcon && props.onlyText == "text") && <span title="Edit label" className="svg__iconbox svg__icon--info" onClick={() => editItem(res)}></span>}
            {visibleDes && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: ['Bottleneck', 'Phone', 'Attention'].indexOf(res.InternalName) !== -1 ? 'tooltip-container itemRankTooltip tooltip-Right p-0 m-0': 'tooltip-container itemRankTooltip p-0 m-0' })}>

                    <div className="col-12">
                        <div className="alignCenter tootltip-title">{res?.Title} <span title="Edit Item" className="light ml-4 svg__icon--editBox svg__iconbox" onClick={() => editItem(res)}></span></div>
                        <button type="button" className="toolTipCross" onClick={(e: any) => CloseDespopup('close')}>
                            <div className="popHoverCross">×</div>
                        </button>
                    </div>
                    {!editdes && <div className="col-12 toolsbox">
                        {res?.LongDescription ? <div dangerouslySetInnerHTML={{ __html: res?.LongDescription }}></div> : <div dangerouslySetInnerHTML={{ __html: res?.Description }}></div>}
                    </div>}

                    {editdes && <div className="col-12 toolsbox">
                        <div className="col-12 mb-2">
                            <label><b>Title</b></label>
                            <TextField value={res.copyTitle} onChange={(ev, newVal) => handleTitleChange(newVal)} />
                        </div>
                        <div className="col-12 mb-2">
                            <label><b>Description</b></label>
                            <textarea className="col-12" rows={7} value={res?.Description} onChange={(e) => handleDescriptionChange(e)} ></textarea>
                        </div>
                        <div className="col-12 mb-2">
                            <label><b>Long Description</b></label>
                            <div className="">
                                {<HtmlEditor editorValue={res?.LongDescription !== null ? res?.LongDescription : ""}
                                    HtmlEditorStateChange={(Data: any) => HtmlEditorCallBack(Data)} />}
                            </div>
                        </div>
                    </div>
                    }
                    {editdes && <div className="col-12 px-3 py-2">
                        <button type="button" className="btn btn-primary pull-right" onClick={handleSave} >
                            Save
                        </button>
                    </div>}
                </div>
            )}
        </>

    );
}

export default LabelInfoIconToolTip;