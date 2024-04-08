import React, { forwardRef, useEffect } from 'react';
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { myContextValue } from '../../../globalComponents/globalCommon';
import Tooltip from '../../../globalComponents/Tooltip';
const RestructureSmartMetaData = (props: any, ref: any) => {
    let restructureItemCallBack = props.restructureItemCallBack;
    const [AllMetaData, setAllMetaData]: any = React.useState([]);
    const globalContextValue: any = React.useContext(myContextValue)
    const [NewArrayBackup, setNewArrayBackup]: any = React.useState([]);
    const [OldArrayBackup, setOldArrayBackup]: any = React.useState([]);
    const [ResturuningOpen, setResturuningOpen]: any = React.useState(false);
    const [restructureItem, setRestructureItem]: any = React.useState([]);
    const [checkItemLength, setCheckItemLength]: any = React.useState(false);
    useEffect(() => {
        globalContextValue.OpenModal = OpenModal;
        if (props?.restructureItem != undefined && props?.restructureItem?.length > 0) {
            props.AllMetaData?.map((obj: any) => {
                const matchingMetaData = props?.restructureItem?.find((item: any) => obj?.Id === item?.Id);
                if (matchingMetaData) {
                    console.log(matchingMetaData)
                }
            })
            setAllMetaData(props.AllMetaData);
            let array: any = []
            props?.restructureItem?.map((obj: any) => {
                const matchingMetaData = props?.AllMetaData?.find((item: any) => obj?.Id === item?.Id);
                if (matchingMetaData) {
                    console.log(matchingMetaData)
                }
                array.push(obj);
            })
            setRestructureItem(array);
        }
    }, [props?.restructureItem])
    const buttonRestructureCheck = () => {
        let topCompo: any = false
        if (props?.AllMetaData?.length > 0 && props?.AllMetaData !== undefined && props?.restructureItem?.length > 0 && props?.restructureItem !== undefined) {
            let MetaDataArray = props?.AllMetaData;
            MetaDataArray?.filter((obj: any) => {
                topCompo = true;
                props?.restructureItem[0]?.Id === obj?.Id ? obj.isRestructureActive = false : obj.isRestructureActive = true;
                if (obj?.subRows?.length > 0 && obj?.subRows !== null) {
                    obj?.subRows?.filter((sub: any) => {
                        props?.restructureItem[0]?.Id === sub?.Id ? sub.isRestructureActive = false : sub.isRestructureActive = true;
                        if (sub?.subRows?.length > 0 && sub?.subRows !== null) {
                            sub?.subRows?.filter((sub1: any) => {
                                props?.restructureItem[0]?.Id === sub1?.Id ? sub1.isRestructureActive = false : sub1.isRestructureActive = true;
                                if (sub1?.subRows?.length > 0 && sub1?.subRows !== null) {
                                    sub1?.subRows?.filter((sub2: any) => {
                                        props?.restructureItem[0]?.Id === sub2?.Id ? sub2.isRestructureActive = false : sub2.isRestructureActive = true;
                                        if (sub2?.subRows?.length > 0 && sub2?.subRows !== null) {
                                            sub2?.subRows?.filter((sub3: any) => {
                                                props?.restructureItem[0]?.Id === sub3?.Id ? sub3.isRestructureActive = false : sub3.isRestructureActive = true;
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            MetaDataArray?.filter((obj: any) => {
                topCompo = true;
                if (props.restructureItem[0]?.ParentId === obj?.Id) {
                    obj.isRestructureActive = false;
                    if (obj?.subRows?.length > 0 && obj?.subRows !== null) {
                        obj?.subRows?.filter((sub: any) => {
                            if (props.restructureItem[0]?.ParentId === sub?.Id) {
                                sub.isRestructureActive = false;
                                if (sub?.subRows?.length > 0 && sub?.subRows !== null) {
                                    sub?.subRows?.filter((sub1: any) => {
                                        if (props.restructureItem[0]?.ParentId === sub1?.Id) {
                                            sub1.isRestructureActive = false;
                                            if (sub1?.subRows?.length > 0 && sub1?.subRows !== null) {
                                                sub1?.subRows?.filter((sub2: any) => {
                                                    if (props.restructureItem[0]?.ParentId === sub2?.Id) {
                                                        sub2.isRestructureActive = false;
                                                        if (sub2?.subRows?.length > 0 && sub2?.subRows !== null) {
                                                            sub2?.subRows?.filter((sub3: any) => {
                                                                if (props.restructureItem[0]?.ParentId === sub2?.Id) {
                                                                    sub2.isRestructureActive = false;

                                                                }
                                                            })
                                                        }
                                                    }

                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
            props.SmartrestructureFunct(true);
            restructureItemCallBack(props?.restructureItem[0], topCompo);
            setCheckItemLength(true);
        }
    }
    useEffect(() => {
        buttonRestructureCheck();
    }, [props?.RestructureButton])
    const OpenModal = async (item: any, TopTrue: any) => {
        if (TopTrue) {
            if (props?.restructureItem[0] !== undefined && item !== undefined) {
                var postData: any = {
                    ParentId: item?.Id,
                    ParentID: item?.Id,
                };
                let web = new Web(props?.AllList?.SPSitesListUrl);
                await web.lists
                    .getById(props?.AllList?.SmartMetadataListID)
                    .items.getById(props?.restructureItem[0]?.Id)
                    .update(postData)
                    .then(async (res: any) => {
                        // let array: any = [...AllMetaData];
                        console.log(res);
                        setResturuningOpen(false);
                        restructureItemCallBack(props?.restructureItem[0], false, props?.restructureItem[0]?.TaxType);
                    })
            }
        } else {
            let array = props.AllMetaData;
            var TestArray1: any = [];
            var TestArray2: any = [];
            array.forEach((obj: any) => {
                let object: any = {};
                if (obj.Id === item.Id) {
                    object = { Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level1', }
                    TestArray1.push(object);
                }
                if (obj.subRows != undefined && obj.subRows.length > 0) {
                    obj.subRows.forEach((sub: any) => {
                        if (sub.Id === item.Id) {
                            object = {
                                Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level2',
                                newSubChild: { Title: sub.Title, TaxType: sub.TaxType, Id: sub.Id, }
                            }
                            TestArray1.push(object)
                        }
                        if (sub.subRows != undefined && sub.subRows.length > 0) {
                            sub.subRows.forEach((newsub: any) => {
                                if (newsub.Id === item.Id) {
                                    object = {
                                        Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level3',
                                        newSubChild: {
                                            Title: sub.Title, TaxType: sub.TaxType, Id: sub.Id,
                                            newFeatChild: { Title: newsub.Title, TaxType: newsub.TaxType, Id: newsub.Id, }
                                        }
                                    }
                                    TestArray1.push(object)
                                }
                                if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                                    newsub.subRows.forEach((newfeat: any) => {
                                        if (newsub.Id === item.Id) {
                                            object = {
                                                Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level4',
                                                newSubChild: {
                                                    Title: sub.Title, TaxType: sub.TaxType, Id: sub.Id,
                                                    newFeatChild: {
                                                        Title: newsub.Title, TaxType: newsub.TaxType, Id: newsub.Id,
                                                        newFeatChild2: { Title: newfeat.Title, TaxType: newfeat.TaxType, Id: newfeat.Id, }
                                                    }
                                                }
                                            }
                                            TestArray1.push(object)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            array.forEach((obj: any) => {
                let object: any = {};
                if (obj.Id === props?.restructureItem[0]?.ParentId) {
                    object = { Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level1', }
                    TestArray2.push(object);
                }
                if (obj.subRows != undefined && obj.subRows.length > 0) {
                    obj.subRows.forEach((sub: any) => {
                        if (sub.Id === props?.restructureItem[0]?.ParentId) {
                            object = {
                                Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level2',
                                newSubChild: { Title: sub.Title, TaxType: sub.TaxType, Id: sub.Id, }
                            }
                            TestArray2.push(object)
                        }
                        if (sub.subRows != undefined && sub.subRows.length > 0) {
                            sub.subRows.forEach((newsub: any) => {
                                if (newsub.Id === props?.restructureItem[0]?.ParentId) {
                                    object = {
                                        Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level3',
                                        newSubChild: {
                                            Title: sub.Title, TaxType: sub.TaxType, Id: sub.Id,
                                            newFeatChild: { Title: newsub.Title, TaxType: newsub.TaxType, Id: newsub.Id, }
                                        }
                                    }
                                    TestArray2.push(object)
                                }
                                if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                                    newsub.subRows.forEach((newfeat: any) => {
                                        if (newsub.Id === props?.restructureItem[0]?.ParentId) {
                                            object = {
                                                Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level4',
                                                newSubChild: {
                                                    Title: sub.Title, TaxType: sub.TaxType, Id: sub.Id,
                                                    newFeatChild: {
                                                        Title: newsub.Title, TaxType: newsub.TaxType, Id: newsub.Id,
                                                        newFeatChild2: { Title: newfeat.Title, TaxType: newfeat.TaxType, Id: newfeat.Id, }
                                                    }
                                                }
                                            }
                                            TestArray2.push(object)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            setNewArrayBackup(TestArray1);
            setOldArrayBackup(TestArray2);
            if (item !== undefined)
                setResturuningOpen(true);
        }
    };
    const UpdateMetaDataRestructure = async function () {
        if (props?.restructureItem[0] !== undefined) {
            let web = new Web(props.AllList.SPSitesListUrl);
            if (NewArrayBackup[0].Level === 'Level2') {
                var postData: any = {
                    ParentId: NewArrayBackup[0].newSubChild?.Id,
                    ParentID: NewArrayBackup[0].newSubChild?.Id,
                };
            }
            else if (NewArrayBackup[0].Level === 'Level3') {
                var postData: any = {
                    ParentId: NewArrayBackup[0].newSubChild?.newFeatChild?.Id,
                    ParentID: NewArrayBackup[0].newSubChild?.newFeatChild?.Id,
                };
            }
            else if (NewArrayBackup[0].Level === 'Level4') {
                var postData: any = {
                    ParentId: NewArrayBackup[0].newSubChild?.newFeatChild?.newFeatChild2?.Id,
                    ParentID: NewArrayBackup[0].newSubChild?.newFeatChild?.newFeatChild2?.Id,
                };
            }
            else {
                var postData: any = {
                    ParentId: NewArrayBackup[0].Id,
                    ParentID: NewArrayBackup[0].Id
                };
            }
            await web.lists
                .getById(props.AllList.SmartMetadataListID)
                .items.getById(props?.restructureItem[0]?.Id)
                .update(postData)
                .then(async (res: any) => {
                    //let array: any = [...props?.AllMetaData];
                    setResturuningOpen(false);
                    restructureItemCallBack(props?.restructureItem[0], false, props?.restructureItem[0]?.TaxType);
                })
        }
    };
    const closeRestructurePopup = () => {
        setResturuningOpen(false)
        props.RestructureButton = false;
        restructureItemCallBack(props?.restructureItem[0], false, props?.restructureItem[0]?.TaxType);
        props?.closeRestructurepopup();

    }
    const onRenderRestuctureSmartMetadata = () => {
        return (
            <>
                <h3> Restucture Smartmetadata <span className="ml-auto"> <Tooltip ComponentId={'1630'} /></span>
                </h3>
            </>
        );
    };

    const CustomFooter = () => {
        return (
            <footer>
                <div className='ml-auto'>
                    {restructureItem != undefined &&
                        restructureItem.length > 0 && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={(e) => UpdateMetaDataRestructure()}
                            >
                                Save
                            </button>
                        )}
                    <button
                        type="button"
                        className="btn btn-default ms-1"
                        onClick={() => closeRestructurePopup()}
                    >
                        Cancel
                    </button></div>
            </footer>
        )
    }
    return (
        <>
            {/* <button type="button" title="Restructure" className="btnCol btn btn-primary" style={{ backgroundColor: `${props.portfolioColor}`, borderColor: `${props.portfolioColor}`, color: '#fff' }}
                onClick={buttonRestructureCheck}
            >Restructure</button> */}
            {
                ResturuningOpen === true && restructureItem?.length == 1 ?
                    <Panel
                        type={PanelType.medium}
                        isOpen={ResturuningOpen}
                        isBlocking={false}
                        onDismiss={() => closeRestructurePopup()}
                        onRenderHeader={onRenderRestuctureSmartMetadata}
                        onRenderFooterContent={CustomFooter}
                    >
                        <div>
                            <div>
                                <span> Old: </span>
                                {OldArrayBackup?.map((obj: any) => {
                                    return (
                                        <span>
                                            <a
                                                data-interception="off"
                                                target="_blank"
                                                className="hreflink serviceColor_Active"
                                            >
                                                <span>{obj?.Title} </span>
                                            </a>
                                            <span>{obj?.newSubChild ? <span>{'>'}{obj?.newSubChild?.Title}</span> : ''}</span>
                                            <span>{obj?.newSubChild?.newFeatChild ? <span>{'>'}{obj?.newSubChild?.newFeatChild?.Title}</span> : ''}</span>
                                        </span>
                                    );
                                })}
                            </div>
                            <div>
                                <span> New: </span>
                                {NewArrayBackup?.map((obj: any) => {
                                    return (
                                        <span>
                                            <a
                                                data-interception="off"
                                                target="_blank"
                                                className="hreflink serviceColor_Active"
                                            >
                                                <span>{obj?.Title} </span>
                                            </a>
                                            <span>{obj?.newSubChild ? <span>{'>'}{obj?.newSubChild?.Title}</span> : ''}</span>
                                            <span>{obj?.newSubChild?.newFeatChild ? <span>{'>'}{obj?.newSubChild?.newFeatChild?.Title}</span> : ''}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </Panel> : ''
            }
        </>
    )
};
export default forwardRef(RestructureSmartMetaData);

