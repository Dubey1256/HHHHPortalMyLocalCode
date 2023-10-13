import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
const RestructureSmartMetaData = (props: any, ref: any) => {
    let restructureItemCallBack = props.restructureItemCallBack;
    const [AllMetaData, setAllMetaData]: any = React.useState([]);
    const [NewArrayBackup, setNewArrayBackup]: any = React.useState([]);
    const [ResturuningOpen, setResturuningOpen]: any = React.useState(false);
    const [restructureItem, setRestructureItem]: any = React.useState([]);
    const [checkItemLength, setCheckItemLength]: any = React.useState(false);
    useEffect(() => {
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
    useEffect(() => {
        if (props?.restructureItem?.length === 0 && checkItemLength) {
            let topCompo: any = false;
            let array = AllMetaData;
            array?.map((obj: any) => {
                obj.isRestructureActive = false;
                if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                    obj?.subRows?.map((Item: any) => {
                        Item.isRestructureActive = false;
                        if (Item?.subRows?.length > 0 && Item?.subRows != undefined) {
                            Item?.subRows?.map((Item1: any) => {
                                Item1.isRestructureActive = false;
                                if (Item1?.subRows?.length > 0 && Item1?.subRows != undefined) {
                                    Item1?.subRows?.map((Item2: any) => {
                                        Item2.isRestructureActive = false;
                                        if (Item2?.subRows?.length > 0 && Item2?.subRows != undefined) {
                                            Item2?.subRows?.map((Item3: any) => {
                                                Item3.isRestructureActive = false;
                                                if (Item3?.subRows?.length > 0 && Item3?.subRows != undefined) {
                                                    Item3?.subRows?.map((Item4: any) => {
                                                        Item4.isRestructureActive = false;
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            props.SmartrestructureFunct(false);
            restructureItemCallBack(array, topCompo);
        }
    }, [props.restructureItem.length === 0])
    const buttonRestructureCheck = () => {
        let topCompo: any = false
        if (AllMetaData?.length > 0 && AllMetaData !== undefined && restructureItem?.length > 0 && restructureItem !== undefined) {
            let MetaDataArray = AllMetaData;
            MetaDataArray?.filter((obj: any) => {
                topCompo = true;
                restructureItem[0]?.Id === obj?.Id ? obj.isRestructureActive = false : obj.isRestructureActive = true;
                if (obj?.subRows?.length > 0 && obj?.subRows !== null) {
                    obj?.subRows?.filter((sub: any) => {
                        restructureItem[0]?.Id === sub?.Id ? sub.isRestructureActive = false : sub.isRestructureActive = true;
                        if (sub?.subRows?.length > 0 && sub?.subRows !== null) {
                            sub?.subRows?.filter((sub1: any) => {
                                restructureItem[0]?.Id === sub1?.Id ? sub1.isRestructureActive = false : sub1.isRestructureActive = true;
                                if (sub1?.subRows?.length > 0 && sub1?.subRows !== null) {
                                    sub1?.subRows?.filter((sub2: any) => {
                                        restructureItem[0]?.Id === sub2?.Id ? sub2.isRestructureActive = false : sub2.isRestructureActive = true;
                                        if (sub2?.subRows?.length > 0 && sub2?.subRows !== null) {
                                            sub2?.subRows?.filter((sub3: any) => {
                                                restructureItem[0]?.Id === sub3?.Id ? sub3.isRestructureActive = false : sub3.isRestructureActive = true;
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            props.SmartrestructureFunct(true);
            restructureItemCallBack(MetaDataArray, topCompo);
            setCheckItemLength(true);
        }
    }
    const OpenModal = (item: any) => {
        let array = AllMetaData;
        var TestArray: any = [];
        array.forEach((obj: any) => {
            let object: any = {};
            if (obj.Id === item.Id) {
                object = { Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level1', }
                TestArray.push(object);
            }
            if (obj.subRows != undefined && obj.subRows.length > 0) {
                obj.subRows.forEach((sub: any) => {
                    if (sub.Id === item.Id) {
                        object = {
                            Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType, Level: 'Level2',
                            newSubChild: { Title: sub.Title, TaxType: sub.TaxType, Id: sub.Id, }
                        }
                        TestArray.push(object)
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
                                TestArray.push(object)
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
                                        TestArray.push(object)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        setNewArrayBackup(TestArray);
        setResturuningOpen(true);
    };
    const UpdateMetaDataRestructure = async function () {
        if (restructureItem[0] !== undefined) {
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
                .getById(props.AllList.SPSmartMetadataListID)
                .items.getById(restructureItem[0]?.Id)
                .update(postData)
                .then(async (res: any) => {
                    let array: any = [...AllMetaData];
                    setResturuningOpen(false);
                    restructureItemCallBack(array, false, restructureItem[0]?.TaxType);
                })
        }
    };
    const trueTopIcon = (items: any) => {
        setResturuningOpen(items);
    }
    useImperativeHandle(ref, () => ({
        OpenModal, trueTopIcon
    }));
    return (
        <>
            <button type="button" title="Restructure" className="btnCol btn btn-primary" style={{ backgroundColor: `${props.portfolioColor}`, borderColor: `${props.portfolioColor}`, color: '#fff' }}
                onClick={buttonRestructureCheck}
            >Restructure</button>
            {
                ResturuningOpen === true && restructureItem?.length == 1 ?
                    <Panel
                        type={PanelType.medium}
                        isOpen={ResturuningOpen}
                        isBlocking={false}
                        onDismiss={() => setResturuningOpen(false)}
                    >
                        <div>
                            <div>
                                <span> New: </span>
                                {NewArrayBackup?.map(function (obj: any) {
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
                            <footer className="mt-2 text-end">
                                {restructureItem != undefined &&
                                    restructureItem.length > 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-primary "
                                            onClick={(e) => UpdateMetaDataRestructure()}
                                        >
                                            Save
                                        </button>
                                    )}
                                <button
                                    type="button"
                                    className="btn btn-default btn-default ms-1"
                                    onClick={() => setResturuningOpen(false)}
                                >
                                    Cancel
                                </button>
                            </footer>
                        </div>
                    </Panel> : ''
            }
        </>
    )
};
export default forwardRef(RestructureSmartMetaData);

