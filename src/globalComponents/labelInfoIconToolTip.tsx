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

const useStyles = makeStyles({
    root: { display: "flex", columnGap: tokens.spacingVerticalS, },
    visible: { color: tokens.colorNeutralForeground2BrandSelected, },
});
const LabelInfoIconToolTip = (props: any) => {
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

    let siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH';
    let listId = 'fb4b4ae0-fb2d-4623-bffd-a7172e12cd09';
    if (window?.location?.href?.toLowerCase()?.indexOf('hhhhqa') > -1) {
        siteUrl = 'https://smalsusinfolabs.sharepoint.com/sites/HHHHQA/SP';
        listId = '69a5eee2-8ab3-45af-b9a5-363086ddc122';
    }
    else {
        siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH';
        listId = 'fb4b4ae0-fb2d-4623-bffd-a7172e12cd09';
    }
    const getsiteConfig = async () => {
        try {
            let web = new Web(siteUrl);
            let getdata: any = [];  // .filter(Id eq )
            getdata = await web.lists.getById(listId).items.select("Id", "Title", "InternalName", "LongDescription", "Description").top(4999).filter("InternalName eq  '" + props.columnName + "'").get();
            if (getdata != undefined && getdata.length > 0) {
                if (getdata[0].Description != undefined && getdata[0].Description != null && getdata[0].Description != '')
                    getdata[0].Description = getdata[0].Description.replace(/<[^>]*>|&#[^;]+;/g, '');
                getdata[0].copyTitle=getdata[0].Title;
                setRes(getdata[0]);
                setcopyRes(getdata[0]);
            }

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (props?.columnName != undefined) {
            getsiteConfig()
        }
    }, [props != undefined])
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
        setEditDes(true);
    };
    const handleSave = async () => {
        res.Title=res?.copyTitle;
        let postData: any = {
            Title: res?.copyTitle,
            LongDescription: res?.LongDescription,
            Description: res?.Description,
        }
        let web = new Web(siteUrl);
        await web.lists.getById(listId).items.getById(res.Id).update(postData).then((e) => {
            CloseDespopup('update');
        }).catch((error) => {
            console.log('Error:', error);
        });
    };


    return (
        <>
            {res != null && res != '' && props.onlyText==undefined ? <label className="alignCenter form-label full-width gap-1">
                {res?.Title}
                {res?.Description != null && res?.Description != '' && <div className={styles.root}>
                    <InfoToolTip
                        content={{
                            children: <span dangerouslySetInnerHTML={{ __html: res?.Description }}></span>,
                            id: contentId,
                        }}
                        withArrow
                        relationship="label"
                        onVisibleChange={handleTooltipVisibilityChange} >
                        <Info16Regular tabIndex={0} className={(tooltipVisible || !visibleDes) ? styles.visible : ''} onClick={toggleVisibility} />
                    </InfoToolTip>
                </div>}
                {res?.InternalName == 'dueDate' && <span title="Re-occurring Due Date"> <input type="checkbox" className="form-check-input rounded-0 ms-2" />  </span>}
            </label>:  res?.Title}
            {visibleDes && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container itemRankTooltip p-0 m-0" })}>

                    <div className="col-12">
                        <div className="alignCenter tootltip-title">{res?.Title} <span title="Edit Item" className="light ml-4 svg__icon--editBox svg__iconbox" onClick={() => editItem(res)}></span></div>
                        <button type="button" className="toolTipCross" onClick={(e: any) => CloseDespopup('close')}>
                            <div className="popHoverCross">×</div>
                        </button>
                    </div>
                    {!editdes && <div className="col-12 toolsbox">
                        {res?.LongDescription != null && res?.LongDescription != '' ? <div dangerouslySetInnerHTML={{ __html: res?.LongDescription }}></div> : <div dangerouslySetInnerHTML={{ __html: res?.Description }}></div>}
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
