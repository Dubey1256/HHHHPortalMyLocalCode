import * as React from 'react';

const SmartTimeTotalFunctionOnTaskPopup = (item: any) => {
    const [smartTimeTotal, setSmartTimeTotal] = React.useState(0);
    const callBack = item.callBack;
    React.useEffect(() => {
        EditData(item.props);
    }, []);
    const EditData = async (items: any) => {
        var AllTimeSpentDetails: any = [];
        if (items.siteType == "Offshore Tasks") {
            var siteType = "OffshoreTasks"
            var Filters = "Task" + siteType + "/Id eq " + items.Id;
        }
        else {
            var Filters = "Task" + items.siteType + "/Id eq " + items.Id;
        }

        var select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + Filters + "";
        var count = 0;
        if (items.siteType == "Migration" || items.siteType == "ALAKDigital") {
            var AllUrls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select + "" }]
        }
        else if (item.props.sitePage == "SH") {
            var AllUrls = [{
                'Url': `${item.props.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select= ${select}`
            }]
        }
        else {
            var AllUrls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
            ]
        }
        $.each(AllUrls, async function (index: any, item: any) {
            await $.ajax({
                url: item.Url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    count++;
                    let tempArray: any = [];
                    if (data.d.results != undefined && data.d.results.length > 0) {
                        AllTimeSpentDetails = AllTimeSpentDetails.concat(data.d.results);
                        AllTimeSpentDetails.map((items: any) => {
                            if (items.AdditionalTimeEntry != null) {
                                let data = JSON.parse(items.AdditionalTimeEntry)
                                tempArray.push(data[0]);
                            }
                        })
                    }
                    let TotalTimeData: any = 0;
                    let FinalTotalTime: any
                    if (tempArray.length > 0) {
                        tempArray.map((tempItem: any) => {
                            if (tempItem.TaskTimeInMin > 0) {
                                TotalTimeData = TotalTimeData + tempItem.TaskTimeInMin;
                            }
                        })
                    }
                    if (TotalTimeData > 0) {
                        FinalTotalTime = (TotalTimeData / 60);
                    }
                    setSmartTimeTotal(FinalTotalTime);
                    callBack(FinalTotalTime)
                }
            })
        })
    };

    return (
        <>
            {smartTimeTotal.toFixed(1)}
        </>
    )
}
export default SmartTimeTotalFunctionOnTaskPopup;