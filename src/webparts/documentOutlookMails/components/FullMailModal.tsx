import * as React from 'react'
import { useState , useEffect } from 'react'
import {
    Modal,
    getTheme,
    mergeStyleSets,
    FontWeights,
    IIconProps,
} from '@fluentui/react';

import { IconButton } from '@fluentui/react/lib/Button';

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const FullMailModal = (props: any) => {
    const [indexNum, setIndexNum] = useState<number>(0);
    const [showingData, setShowingData] = useState<any>();
    const { closeFullMailModal, fullData , mailData } = props;

    // Extract the original data from fullData
    const filterModalData = fullData.map((item: any) => item?.original);


    // Find the initial index based on mailData
    useEffect(() => {
        const index = filterModalData.findIndex((item: any) => item?.Id === mailData);
        if (index !== -1) {
            setIndexNum(index);
            setShowingData(filterModalData[index]);
        }
    }, [fullData, mailData]);

    // Update showingData when indexNum changes
    useEffect(() => {
        setShowingData(filterModalData[indexNum]);
    }, [indexNum, filterModalData])


    // useEffect(() => {
    //     const filterModalData = fullData.map((item: any) => item?.original);
    //     const index = filterModalData.findIndex((item: any) => item?.Id === mailData);
        
    //     if (index !== -1) {
    //         setIndexNum(index);
    //         setShowingData(filterModalData[index]);
    //     }
    // }, [fullData, mailData]);

    const handlePrivious = () => {
        if(indexNum >= 0){
            setIndexNum(indexNum - 1);
        } 
    }

    const handleNext = () => {
        if(indexNum < filterModalData.length -1 ){
            setIndexNum(indexNum + 1);
        } 
    }

    // console.log(showingData);

    // render Modal Pop Up 
    return (
        <>
                    <Modal
                        isOpen={true}
                        onDismiss={() => closeFullMailModal()}
                        isModeless={true}
                        containerClassName={contentStyles.container}>
                        <div className="d-flex flex-row justify-content-between" style={{ width: '100%', padding:10}}>
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: 'rgb(0,0,102)'}} onClick={handlePrivious} disabled={indexNum === 0} >Previous</button>
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: 'rgb(0,0,102)' }} onClick={handleNext} disabled={indexNum === filterModalData.length -1}>Next</button>
                        </div>
                        <div className={contentStyles.header}>
                            <h2 className={contentStyles.heading}>
                                {/* Data */}
                                {showingData?.senderEmail?.split("@")[0]?.toUpperCase().replace(".", " ")}'S OUTLOOK MAIL
                            </h2>
                            <IconButton
                                styles={iconButtonStyles}
                                ariaLabel="Close popup modal"
                                iconProps={cancelIcon}
                                onClick={() => closeFullMailModal()}
                            />
                        </div>
                        <div className={contentStyles.body}>
                            <p><span style={{ fontWeight: 'bold' }}>From         :</span> {showingData?.senderEmail}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Sent on      :</span> {showingData?.creationTime}</p>
                            <p><span style={{ fontWeight: 'bold' }}>To           :</span> {showingData?.recipients}</p>
                            <br />
                            <p><span style={{ fontWeight: 'bold' }}>Subject      :</span>{showingData?.Title}</p>
                            <br />
                            <p>{showingData?.Body?.split('From:')[0]}</p>
                        </div>
                    </Modal>
        </>
    );
};

export default FullMailModal;

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        width: 650,
        height: 350,

    },
    header: [
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 24px',
        },
    ],
    heading: {
        // color: theme.palette.neutralPrimary,
        fontWeight: FontWeights.semibold,
        // fontSize: 'inherit',
        margin: '0',
        color: 'rgb(0,0,102)',
        fontSize: 21,
    },
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});

const iconButtonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
}


