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
        if (restructureItem?.length === 0 && checkItemLength) {
            let topCompo: any = false;
            let array = AllMetaData;
            array?.map((obj: any) => {
                obj.isRestructureActive = false;
                if (obj?.subRows.length > 0 && obj?.subRows != undefined) {
                    obj?.subRows?.map((sub: any) => {
                        sub.isRestructureActive = false;
                        if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                            sub?.subRows?.map((feature: any) => {
                                feature.isRestructureActive = false;
                                if (feature?.subRows?.length > 0 && feature?.subRows != undefined) {
                                    feature?.subRows?.map((activity: any) => {
                                        activity.isRestructureActive = false;
                                        if (activity?.subRows?.length > 0 && activity?.subRows != undefined) {
                                            activity?.subRows?.map((wrkstrm: any) => {
                                                wrkstrm.isRestructureActive = false;
                                                if (wrkstrm?.subRows?.length > 0 && wrkstrm?.subRows != undefined) {
                                                    wrkstrm?.subRows?.map((task: any) => {
                                                        task.isRestructureActive = false;
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
            props.restructureFunct(false);
            restructureItemCallBack(array, topCompo);
        }
    }, [restructureItem])
    const buttonRestructureCheck = () => {
        let topCompo: any = false
        if (AllMetaData?.length > 0 && AllMetaData !== undefined && restructureItem?.length > 0 && restructureItem !== undefined) {
            let MetaDataArray = AllMetaData;
            MetaDataArray?.filter((obj: any) => {
                topCompo = true;
                obj.isRestructureActive = true;
                if (obj?.subRows?.length > 0 && obj?.subRows !== null) {
                    obj?.subRows?.filter((sub: any) => {
                        sub.isRestructureActive = true;
                        if (sub?.subRows?.length > 0 && sub?.subRows !== null) {
                            sub?.subRows?.filter((sub1: any) => {
                                sub1.isRestructureActive = true;
                                if (sub1?.subRows?.length > 0 && sub1?.subRows !== null) {
                                    sub1?.subRows?.filter((sub2: any) => {
                                        sub2.isRestructureActive = true;
                                    })
                                }
                            })
                        }
                    })

                }
            })
            MetaDataArray?.filter((obj: any, index: number) => {
                restructureItem?.filter((ReStruct: any) => {
                    if (obj?.Id === ReStruct?.Id) {
                        obj.isRestructureActive = false;
                        MetaDataArray[index].isRestructureActive = { ...ReStruct?.isRestructureActive }
                        if (obj?.subRows?.length > 0 && obj?.subRows !== null) {
                            obj?.subRows?.filter((sub: any, index2: number) => {
                                sub.isRestructureActive = false;
                                MetaDataArray[index].subRows[index2].isRestructureActive = { ...sub?.isRestructureActive }
                            })
                        }
                    }
                    if (obj?.subRows?.length > 0 && obj?.subRows !== null) {
                        obj?.subRows?.filter((sub: any, index2: number) => {
                            if (obj?.Id === ReStruct?.Id) {
                                obj.isRestructureActive = false;
                                MetaDataArray[index].subRows[index2].isRestructureActive = { ...sub?.isRestructureActive }
                            }
                        })
                    }
                })
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
                object = { Title: obj.Title, Id: obj.Id, TaxType: obj.TaxType }
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
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP/');
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
                .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
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
            <button type="button" title="Restructure" className="btn btn-primary" style={{ backgroundColor: `${props.portfolioColor}`, borderColor: `${props.portfolioColor}`, color: '#fff' }}
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

