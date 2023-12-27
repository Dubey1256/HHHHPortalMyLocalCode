import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { FaFilter } from "react-icons/fa";
const DateColumnFilter = (item: any) => {
    const [comparisonOperator, setComparisonOperator] = React.useState(item?.dateColumnFilterData?.comparisonOperator);
    const [selectedDate, setSelectedDate] = React.useState(item?.dateColumnFilterData?.selectedDate);
    ///// Year Range Using Piker ////////
    const [years, setYear] = React.useState([])
    const [months, setMonths] = React.useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",])
    React.useEffect(() => {
        const currentYear = new Date().getFullYear();
        const year: any = [];
        for (let i = 1990; i <= currentYear; i++) {
            year.push(i);
        }
        setYear(year);
    }, [])
    ///// Year Range Using Piker end////////
    const ExampleCustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
        <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
            <input type="text" id="datepickerss" className="form-control date-picker ps-2" placeholder="DD/MM/YYYY" defaultValue={value} />
            <span style={{ position: "absolute", top: "58%", right: "8px", transform: "translateY(-50%)", cursor: "pointer" }}>
                <span className="svg__iconbox svg__icon--calendar dark"></span>
            </span>
        </div>
    ));
    const handleClosePopup = (event: any) => {
        if (event === 'clearFilter') {
            setComparisonOperator('')
            setSelectedDate(null)
            item?.selectedDateColumnFilter(event);
            if (item?.taskTypeDataItem && item?.taskTypeDataItemBackup) {
                item?.taskTypeDataItemBackup.forEach((backupElem: any) => {
                    item?.taskTypeDataItem.forEach((elem1: any) => {
                        if (backupElem.Title === elem1.Title) {
                            let filterNumberKey = backupElem[backupElem.Title + 'filterNumber'];
                            elem1[elem1.Title + 'filterNumber'] = filterNumberKey
                        }
                    });
                });
            }
            if (item?.portfolioTypeDataItemBackup && item?.portfolioTypeData) {
                item?.portfolioTypeDataItemBackup?.forEach((backupElem: any) => {
                    item?.portfolioTypeData?.forEach((elem1: any) => {
                        if (backupElem.Title === elem1.Title) {
                            let filterNumberKey = backupElem[backupElem.Title + 'filterNumber'];
                            elem1[elem1.Title + 'filterNumber'] = filterNumberKey
                        }
                    });
                });
            }
            item?.setData(item?.flatViewDataAll);
        } else {
            item?.selectedDateColumnFilter();
        }
    };
    const handleChangeDateAndDataCallBack = () => {
        const selectedCompareItem = {
            ColumnsName: item?.Lable || '',
            selectedDate: selectedDate,
            comparisonOperator: comparisonOperator || ''
        };
        item?.selectedDateColumnFilter(selectedCompareItem);
        item?.setLoaded(false);
        customColumnFilterDateAndNumberFormat(selectedCompareItem);
    };
    const customColumnFilterDateAndNumberFormat = (compareItemsValue: any) => {
        if (compareItemsValue?.ColumnsName === "DueDate") {
            if (compareItemsValue?.selectedDate && compareItemsValue?.comparisonOperator) {
                const compareServerData = compareItemsValue?.selectedDate.setHours(0, 0, 0, 0);
                let filteredDataItems = item?.flatViewDataAll?.filter((elem: any) => {
                    switch (compareItemsValue.comparisonOperator) {
                        case 'equal':
                            return elem.serverDueDate === compareServerData;
                        case 'greater':
                            return elem.serverDueDate > compareServerData;
                        case 'less':
                            return elem.serverDueDate < compareServerData;
                        case 'notEqual':
                            return elem.serverDueDate !== compareServerData;
                        default:
                            return false;
                    }
                });
                item?.taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
                item?.portfolioTypeData?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
                filteredDataItems?.map((result: any) => {
                    item?.taskTypeDataItem?.map((type: any) => {
                        if (result?.TaskType?.Title === type.Title) {
                            type[type.Title + 'filterNumber'] += 1;
                        }
                    });
                });
                filteredDataItems?.map((result: any) => {
                    item?.portfolioTypeData?.map((type: any) => {
                        if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                            type[type.Title + 'filterNumber'] += 1;
                        }
                    });
                });
                item?.setData(filteredDataItems);
                item?.setLoaded(true);
            }
        }
    };
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span className="siteColor">{item?.Lable}</span>
                </div>
            </>
        );
    };
    return (
        <>
            <Panel
                className='PresetDate'
                type={PanelType.custom}
                customWidth="450px"
                isOpen={item?.isOpen}
                onDismiss={handleClosePopup}
                onRenderHeader={onRenderCustomHeader}
                isBlocking={false}
            >
                <div className="modal-body p-0 mt-2 mb-3">
                    <div className="col-sm-12 p-0 smart">
                        <div>
                            <select className="col-12 mb-3" style={{ height: "37px" }} value={comparisonOperator} onChange={(e) => { setComparisonOperator(e.target.value); }}>
                                <option value=""></option>
                                <option value="equal">Equal to</option>
                                <option value="greater">Greater than</option>
                                <option value="less">Less than</option>
                                <option value="notEqual">Not equal to</option>
                            </select>
                        </div>

                        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="dd/MM/yyyy"
                            className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />}
                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled
                            }) => (<div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
                                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{"<"}</button>
                                <select value={date.getFullYear()} onChange={({ target: { value } }: any) => changeYear(value)}>{years.map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                                <select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>{months.map((option) => (<option key={option} value={option}>{option} </option>))}</select>
                                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{">"}</button>
                            </div>
                            )}
                        />
                    </div>
                </div>
                <footer>
                    <button type="button" className="btn btn-default pull-right" onClick={() => handleClosePopup("clearFilter")}>Clear</button>
                    <button type="button" className="btn btn-primary mx-1 pull-right" onClick={handleChangeDateAndDataCallBack}>Filter</button>
                </footer>
            </Panel>
        </>
    )


}
export default DateColumnFilter;