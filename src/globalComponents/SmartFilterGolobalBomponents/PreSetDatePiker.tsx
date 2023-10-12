import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../Tooltip';
function PreSetDatePikerPannel(props: any) {
    const [startDateLocalStorage, setStartDateLocalStorage] = React.useState<any>(localStorage.getItem('startDate'));
    const [endDateLocalStorage, setEndDateLocalStorage] = React.useState<any>(localStorage.getItem('endDate'));
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    React.useEffect(() => {
        if (startDateLocalStorage && endDateLocalStorage) {
          const preSetStartDate = JSON.parse(startDateLocalStorage)
          const preSetEndDate = JSON.parse(endDateLocalStorage)
          setStartDate(new Date(preSetStartDate));
          setEndDate(new Date(preSetEndDate));
        }
    }, [startDateLocalStorage, endDateLocalStorage])

    const handleDayChange = (days: any, isStartDate: any) => {
        if (isStartDate) {
            setStartDate(new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000));
        } else {
            setEndDate(new Date(endDate.getTime() + days * 24 * 60 * 60 * 1000));
        }
    };

    const handleMonthChange = (months: any, isStartDate: any) => {
        if (isStartDate) {
            setStartDate(new Date(startDate.setMonth(startDate.getMonth() + months)));
        } else {
            setEndDate(new Date(endDate.setMonth(endDate.getMonth() + months)));
        }
    };

    const handleYearChange = (years: any, isStartDate: any) => {
        if (isStartDate) {
            setStartDate(new Date(startDate.setFullYear(startDate.getFullYear() + years)));
        } else {
            setEndDate(new Date(endDate.setFullYear(endDate.getFullYear() + years)));
        }
    };
    const onRenderCustomHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading siteColor">
                    Select Preset Date
                </div>
                <Tooltip ComponentId={2330} />
            </div>
        );
    };


    const setModalIsOpenToFalse = () => {
        props?.PreSetPikerCallBack();
    };

    const handleChangeData = () => {
        props?.PreSetPikerCallBack(startDate, endDate);
        if (startDate && endDate) {
            let startDatas = JSON.stringify(startDate);
            localStorage.setItem('startDate', startDatas);
            let endDates = JSON.stringify(endDate);
            localStorage.setItem('endDate', endDates);
        }
    };

    const ExampleCustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
        <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
            <input
                type="text"
                id="datepicker"
                className="form-control date-picker"
                placeholder="DD/MM/YYYY"
                defaultValue={value}
            />
            <span
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "0px",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                }}
            >
                <span className="svg__iconbox svg__icon--calendar"></span>
            </span>
        </div>
    ));


    return (
        <>
            <Panel
                type={PanelType.custom}
                customWidth="490px"
                isOpen={props?.isOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeader}
                isBlocking={props?.isOpen}
            // onRenderFooter={CustomFooter}
            >
                <div className="modal-body p-0 mt-2 mb-3">
                    <div className="d-flex pb-3 border-bottom">
                        <div className="col-sm-4 pe-3">
                            <label className='form-label w-100'>Start Date</label>
                            <DatePicker selected={startDate} selectsStart startDate={startDate} endDate={endDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" customInput={<ExampleCustomInput/>} />
                        </div>
                        <div className="col-sm-8 session-control-buttons alignCenter">
                            <div className="col-sm-4 pe-2 text-center">
                                <button id="DayPlus" className="top-container plus-button plus-minus" onClick={() => handleDayChange(1, true)}><i className="fa fa-plus" aria-hidden="true"></i> </button>
                                <span className="min-input">Day</span>
                                <button id="DayMinus" className="top-container minus-button plus-minus" onClick={() => handleDayChange(-1, true)}> <i className="fa fa-minus" aria-hidden="true"></i> </button>
                            </div>

                            <div className="col-sm-4 px-2  text-center">
                                <button id="MonthPlus" className="top-container plus-button plus-minus" onClick={() => handleMonthChange(1, true)}><i className="fa fa-plus" aria-hidden="true"></i> </button>
                                <span className="min-input">Month</span>
                                <button id="MonthMinus" className="top-container minus-button plus-minus" onClick={() => handleMonthChange(-1, true)}><i className="fa fa-minus" aria-hidden="true"></i></button>
                            </div>

                            <div className="col-sm-4 ps-2  text-center">
                                <button id="YearPlus" className="top-container plus-button plus-minus" onClick={() => handleYearChange(1, true)}> <i className="fa fa-plus" aria-hidden="true"></i></button>
                                <span className="min-input">Year</span>
                                <button id="YearMinus" className="top-container minus-button plus-minus" onClick={() => handleYearChange(-1, true)}> <i className="fa fa-minus" aria-hidden="true"></i> </button>
                            </div>
                        </div>
                    </div>
                    <div className="my-3 d-flex">
                        <div className="col-sm-4 pe-3">
                            <label className='form-label w-100'>End Date</label>
                            <DatePicker selected={endDate} selectsEnd startDate={startDate} endDate={endDate} dateFormat="dd/MM/yyyy" onChange={(date) => setEndDate(date)} customInput={<ExampleCustomInput />}
                            />
                        </div>
                        <div className="col-sm-8 session-control-buttons alignCenter">
                            <div className="col-sm-4 pe-2 text-center">
                                <button id="DayPlus" className="top-container plus-button plus-minus" onClick={() => handleDayChange(1, false)}><i className="fa fa-plus" aria-hidden="true"></i> </button>
                                <span className="min-input">Day</span>
                                <button id="DayMinus" className="top-container minus-button plus-minus" onClick={() => handleDayChange(-1, false)}> <i className="fa fa-minus" aria-hidden="true"></i> </button>
                            </div>

                            <div className="col-sm-4 px-2  text-center">
                                <button id="MonthPlus" className="top-container plus-button plus-minus" onClick={() => handleMonthChange(1, false)}><i className="fa fa-plus" aria-hidden="true"></i> </button>
                                <span className="min-input">Month</span>
                                <button id="MonthMinus" className="top-container minus-button plus-minus" onClick={() => handleMonthChange(-1, false)}><i className="fa fa-minus" aria-hidden="true"></i></button>
                            </div>

                            <div className="col-sm-4 ps-2  text-center">
                                <button id="YearPlus" className="top-container plus-button plus-minus" onClick={() => handleYearChange(1, false)}> <i className="fa fa-plus" aria-hidden="true"></i></button>
                                <span className="min-input">Year</span>
                                <button id="YearMinus" className="top-container minus-button plus-minus" onClick={() => handleYearChange(-1, false)}> <i className="fa fa-minus" aria-hidden="true"></i> </button>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className='modal-footer'>
                    <button type="button" className="btn btn-default ms-1" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} onClick={setModalIsOpenToFalse}>
                        Cancel
                    </button>
                    <button onClick={() => handleChangeData()} className="btn btn-primary ms-1">OK</button>
                </footer>
            </Panel>
        </>

    );
}

export default PreSetDatePikerPannel;