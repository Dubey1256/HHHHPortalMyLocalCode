import React from 'react'
import { parseString } from 'xml2js';
import { EventRecurrenceInfo } from '../webparts/calendar/components/EventRecurrenceControls/EventRecurrenceInfo/EventRecurrenceInfo';
import { Panel, PanelType, Toggle } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import GlobalTooltip from './Tooltip'
import moment from 'moment';
let web :any
let copyTaskData:any;
const RecurringTask = (props: any) => {
    
    const [returnedRecurrenceInfo, setReturnedRecurrenceInfo] = React.useState(null);
    const [recurrenceData, setRecurrenceData] = React.useState(null);
    const [startDate, setStartDate]: any = React.useState(null);
    const [showRecurrenceSeriesInfo, setShowRecurrenceSeriesInfo] = React.useState(false);
    const [TaskData, SetTaskData]:any = React.useState({});
    const WorkingAction= React.useRef([])
     WorkingAction.current=  JSON.parse(JSON.stringify( props?.WorkingAction));
    // Function Convert date
    function convertToISO(dateString:any) {
        let match = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (!match) {
            throw new Error('Invalid date format. Expected format: DD/MM/YYYY');
            return null;
        }
        let day = match[1];
        let month = match[2];
        let year = match[3];
    
        let date = new Date(`${year}-${month}-${day}`);
        let isoDate = date.toISOString();
    
        return isoDate;
    }
    // Load the task
 
    const LoadTaskData = async () => {
      await web.lists
            .getById(props?.props?.Items?.listId)
            .items .getById(props?.props?.Items?.Id).select(
                "Id,Title,WorkingAction,workingThisWeek,CompletedDate,StartDate,PriorityRank,DueDate,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,TaskID,RecurrenceData"
            ).expand("AssignedTo,Author,TeamMembers,Editor,ResponsibleTeam")
            .get().then((TaskDetailsFromCall:any)=>{

                TaskDetailsFromCall. DueDate= TaskDetailsFromCall. DueDate!=undefined? new Date(TaskDetailsFromCall?.DueDate):undefined
                SetTaskData([TaskDetailsFromCall]);
                copyTaskData=TaskDetailsFromCall;
            }).catch((error:any)=>{
                console.log(error)
                props.props.Items.RecurrenceData="";
                let copyData =JSON.parse(JSON.stringify(props?.props?.Items))
                copyData.StartDate = convertToISO(copyData?.StartDate);
                copyData.CompletedDate = convertToISO(copyData?.CompletedDate)
                copyData.DueDate =convertToISO(copyData?.DueDate)
                SetTaskData([copyData])
                copyTaskData=copyData
            });
       
    }

    React.useEffect(() => {
        if(props?.props?.AllListId?.siteUrl){
            web = new Web(props?.props?.AllListId?.siteUrl);
           
            LoadTaskData()
        }
       
    }, [showRecurrenceSeriesInfo])


    const UpdateWorkinActionJSON = async (DataForUpdate: any) => {

        try {
            await web.lists
                .getById(props?.props?.Items?.listId)
                .items.getById(props?.props?.Items?.Id)
                .update({ WorkingAction: DataForUpdate?.length > 0 ? JSON.stringify(DataForUpdate) : null,
                    RecurrenceData:returnedRecurrenceInfo?.recurrenceData ,
                    DueDate:returnedRecurrenceInfo?.endDate
                })
                  
                .then((response:any) => {
                    console.log('Update successful:', response);
                    props.EditData.DueDate= moment(returnedRecurrenceInfo?.endDate).format("YYYY-MM-DD")
                    props?.setEditData(props.EditData)
                    props?.setWorkingAction(WorkingAction.current);
                    setShowRecurrenceSeriesInfo(false)
                })
        } catch (error) {
            console.log("Error", error.message)
        }
    }

    //  Recurrence Data
    const eventDataForBinding = (eventDetails:any, currentDate:any) => {
        const pad = (number:any) => {
            return number < 10 ? '0' + number : number;
        };
    
        const formatDate = (date:any) => {
            const d = new Date(date);
            const day = pad(d.getDate());
            const month = pad(d.getMonth() + 1); // Months are zero-indexed
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };
    
        let event = {
            "WorkingDate": formatDate(currentDate),
            "WorkingMember": eventDetails?.AssignedTo?.map((detail:any) => ({
                "Id": detail.Id,
                "Title": detail.Title
            }))
        };
    
        return event;
    };
    
    function parseRecurrence(recurrenceData: any) {
        const dates: any[] = [];
        const AllEvents: any = []
        try {
            parseString(recurrenceData?.RecurrenceData, (err: any, result: any) => {
                if (err || !result || !result.recurrence) {
                    console.error('Error parsing XML:', err);
                    return;
                }

                const { recurrence } = result;
                const rule = recurrence?.rule?.[0];
                const firstDayOfWeek = rule?.firstDayOfWeek || 'su';
                const startDate = new Date(recurrenceData?.EventDate);
                startDate.setDate(startDate.getDate() - 1);
                let repeatInstance = 0;

                if (rule?.repeatInstances && rule.repeatInstances[0] > 0) {
                    repeatInstance = Number(rule.repeatInstances[0]);
                }
                let useCount = false
                if (recurrenceData?.RecurrenceData?.includes('daily')) {
                    useCount = true
                }
                let count = 0;
                let windowEndDate: any;
                if (rule?.repeatForever && rule?.repeatForever[0] === 'FALSE') {
                    if (rule?.windowEnd == undefined) {
                        let createenddate = new Date(recurrenceData?.EndDate);
                        createenddate.setHours(0, 0, 0, 0);
                        createenddate.setDate(createenddate.getDate() + 1000);
                        createenddate.setHours(0, 0, 0, 0);
                        windowEndDate = createenddate;
                    }
                } else if (repeatInstance && repeatInstance > 0) {
                    let repeatInstanceEndDate =new Date(recurrenceData?.EventDate);
                    repeatInstanceEndDate.setHours(0, 0, 0, 0);
                    if (recurrenceData?.RecurrenceData) {
                      if (recurrenceData.RecurrenceData.includes('daily')) {
                        repeatInstanceEndDate.setDate(repeatInstanceEndDate.getDate() + repeatInstance);
                      } else if (recurrenceData.RecurrenceData.includes('weekly')) {
                        repeatInstanceEndDate.setDate(repeatInstanceEndDate.getDate() + repeatInstance * 7);
                      } else if (recurrenceData.RecurrenceData.includes('monthly')) {
                        repeatInstanceEndDate.setMonth(repeatInstanceEndDate.getMonth() + repeatInstance);
                      } else if (recurrenceData.RecurrenceData.includes('yearly')) {
                        repeatInstanceEndDate.setFullYear(repeatInstanceEndDate.getFullYear() + repeatInstance);
                      } else if (recurrenceData.RecurrenceData.includes('monthlyByDay')) {
                        // Custom logic for monthlyByDay
                        // Example: set to the same day of the month, incremented by `repeatInstance` months
                        const day = repeatInstanceEndDate.getDate();
                        repeatInstanceEndDate.setMonth(repeatInstanceEndDate.getMonth() + repeatInstance);
                        if (repeatInstanceEndDate.getDate() !== day) {
                          repeatInstanceEndDate.setDate(0); // Handle overflow to the last day of the month
                        }
                      } else if (recurrenceData.RecurrenceData.includes('yearlyByDay')) {
                        // Custom logic for yearlyByDay
                        // Example: set to the same day of the year, incremented by `repeatInstance` years
                        const month = repeatInstanceEndDate.getMonth();
                        const day = repeatInstanceEndDate.getDate();
                        repeatInstanceEndDate.setFullYear(repeatInstanceEndDate.getFullYear() + repeatInstance);
                        if (repeatInstanceEndDate.getMonth() !== month || repeatInstanceEndDate.getDate() !== day) {
                          repeatInstanceEndDate.setMonth(month, day); // Handle overflow if necessary
                        }
                      }
                    
                      repeatInstanceEndDate.setHours(0, 0, 0, 0);
                      windowEndDate = repeatInstanceEndDate;
                    }
                    
                  }
                else {
                    windowEndDate = rule.windowEnd ? new Date(rule.windowEnd[0]).setHours(0, 0, 0, 0) : new Date(recurrenceData?.EndDate).setHours(0, 0, 0, 0);
                }
                while (dates.length < repeatInstance || new Date(dates[dates.length - 1] || startDate).setHours(0, 0, 0, 0) < windowEndDate) {
                    if ((repeatInstance != 0 ? count > repeatInstance : new Date(dates[dates.length - 1]).setHours(0, 0, 0, 0) > windowEndDate) && useCount == true) {
                        break
                    }
                    count++;
                    if (calculateNextDate(rule, firstDayOfWeek, new Date(dates[dates.length - 1] || startDate), dates, windowEndDate, AllEvents, recurrenceData) === 'break')
                        break;
                }
                if (AllEvents?.length > 0) {
                    const { repeat } = rule;
                    const repeatType = Object.keys(repeat[0])[0];
                    let currentDate: any = new Date(dates[0])
                    let event: any = {};
                    switch (repeatType) {

                        case 'yearly':
                            currentDate.setFullYear(currentDate.getFullYear() - 1);
                            event = eventDataForBinding(recurrenceData, currentDate)
                            AllEvents?.push(event)
                            dates.push(new Date(currentDate));
                            break;
                        case 'monthly':
                            let MonthToBeIncreased = currentDate.getMonth() - 1;
                            currentDate = currentDate.setMonth(MonthToBeIncreased);
                            event = eventDataForBinding(recurrenceData, currentDate);
                            AllEvents?.push(event);
                            dates.push(new Date(currentDate));
                            break;


                        default:
                            return 'break';
                    }
                }
            });
        } catch (error) {
            console.error("Parsing error", error);
        }

        return AllEvents;
    }

    function handleDailyRecurrence(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any, repeatInstance: any) {
        const dayFrequency = parseInt(frequency.dayFrequency);
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
        let count = 0;
        let result = '';
        if (frequency?.weekday == 'TRUE') {
            let AllWeekDaysOfWeek = getWeekDays(nextDate)
            AllWeekDaysOfWeek?.map((DayOfWeek: any) => {

                const endDate = new Date(windowEndDate);
                if (new Date(eventDetails?.EventDate).setHours(0, 0, 0, 0) <= new Date(DayOfWeek).setHours(0, 0, 0, 0) && new Date(DayOfWeek).setHours(0, 0, 0, 0) < endDate.setDate(endDate.getDate() + 1)) {
                    const event = eventDataForBinding(eventDetails, DayOfWeek);
                    AllEvents.push(event);
                    dates.push(new Date(DayOfWeek));
                } else if (new Date(DayOfWeek).setHours(0, 0, 0, 0) >= new Date(windowEndDate).setHours(0, 0, 0, 0)) {
                    result = 'break';
                }
            })

        } else {
            while (count < repeatInstance && new Date(currentDate).setHours(0, 0, 0, 0) < windowEndDate) {
                currentDate.setDate(currentDate.getDate() + dayFrequency);
                const event = eventDataForBinding(eventDetails, currentDate);
                AllEvents.push(event);
                dates.push(new Date(currentDate));
                count++;
            }
        }
        return result;
    }

    function getWeekDays(today: any) {
        const currentDay = today.getDay();
        const monday = new Date(today);
        const dates = [];

        if (currentDay >= 1 && currentDay <= 4) { // Monday to Thursday
            monday.setDate(today.getDate() - currentDay + 1);
        } else { // Friday to Sunday
            monday.setDate(today.getDate() + (8 - currentDay)); // Next Monday
        }

        for (let i = 0; i < 5; i++) {
            dates.push(new Date(monday.getTime() + i * 24 * 60 * 60 * 1000));
        }

        return dates;
    }

    function handleWeeklyRecurrence(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any) {
        const { weekFrequency } = frequency;
        const daysOfWeekIndex = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

        // Get the days of the week that are marked as TRUE
        const daysOfWeek = daysOfWeekIndex.filter(day => frequency[day] === "TRUE");

        while (true) {
            let added = false;
            for (const day of daysOfWeek) {
                let targetDayIndex = daysOfWeekIndex.indexOf(day);
                let daysToAdd = targetDayIndex - currentDate.getDay();
                if (daysToAdd < 0) daysToAdd += 7;

                let targetDate: any = new Date(currentDate);
                targetDate.setDate(currentDate.getDate() + daysToAdd);

                if (targetDate.setHours(0, 0, 0, 0) > windowEndDate) {
                    if (!added) {
                        dates.push(new Date(targetDate));
                        added = true;
                    }
                    return;
                }

                const event = eventDataForBinding(eventDetails, targetDate);
                AllEvents.push(event);
                dates.push(new Date(targetDate));
            }

            currentDate.setDate(currentDate.getDate() + (weekFrequency * 7));
        }
    }
    function handleMonthlyByDay(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any) {
        const { monthFrequency, weekdayOfMonth } = frequency;
        const daysOfWeekIndex = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        const weekMap: any = { first: 1, second: 2, third: 3, fourth: 4, last: 5 };


        const monthFreq = parseInt(monthFrequency, 10);

        const processEvent = (dayIndexes: number[], isSpecificDay: boolean = false) => {
            while (true) {
                for (const dayIndex of dayIndexes) {
                    const targetDate: any = isSpecificDay
                        ? new Date(currentDate.getFullYear(), currentDate.getMonth(), weekMap[weekdayOfMonth])
                        : getNthWeekdayOfMonth(currentDate.getFullYear(), currentDate.getMonth(), dayIndex, weekMap[weekdayOfMonth]);

                    if (targetDate.setHours(0, 0, 0, 0) > windowEndDate) {
                        dates.push(new Date(targetDate));
                        return; // Exit the loop once window end date is exceeded
                    }

                    const event = eventDataForBinding(eventDetails, targetDate);
                    AllEvents.push(event);
                    dates.push(new Date(targetDate));
                }
                currentDate.setMonth(currentDate.getMonth() + monthFreq);
            }
        };
        if (frequency?.day === "TRUE") {
            // Process specific day based on weekdayOfMonth
            const targetDayIndexes = [weekMap[weekdayOfMonth]]; // Specific day of the month
            processEvent(targetDayIndexes, true);
        } else if (frequency?.weekday === "TRUE") {
            // Process weekdays (Monday to Friday)
            const targetDayIndexes = [1, 2, 3, 4, 5]; // Monday to Friday
            processEvent(targetDayIndexes);
        } else if (frequency?.weekend_day === "TRUE") {
            // Process weekends (Saturday and Sunday)
            const targetDayIndexes = [0, 6]; // Sunday and Saturday
            processEvent(targetDayIndexes);
        } else {
            // Process specific days of the week
            const keys: any = Object.keys(frequency);
            for (let i = 0; i < daysOfWeekIndex.length; i++) {
                const key = daysOfWeekIndex[i];
                if (keys.includes(key) && frequency[key] === "TRUE") {
                    const targetDayIndex = i;
                    processEvent([targetDayIndex]);
                    break;
                }
            }
        }



    }

    // Helper function to get the nth weekday of a given month
    function getNthWeekdayOfMonth(year: number, month: number, dayOfWeek: number, nth: number): Date {
        let firstDay = new Date(year, month, 1).getDay();
        let day = (dayOfWeek - firstDay + 7) % 7 + 1;
        let date = day + (nth - 1) * 7;

        // If nth is 'last', adjust the date to the last occurrence of the day
        if (nth === 5) {
            let lastDayOfMonth = new Date(year, month + 1, 0).getDate();
            while (date + 7 <= lastDayOfMonth) {
                date += 7;
            }
        }

        return new Date(year, month, date);
    }
    function handleYearlyByDay(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any) {
        const { yearFrequency, weekdayOfMonth, month } = frequency;
        const daysOfWeekIndex = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        const weekMap: any = { first: 1, second: 2, third: 3, fourth: 4, last: 5 };

        const yearFreq = parseInt(yearFrequency, 10);

        const processEvent = (dayIndexes: number[], isSpecificDay: boolean = false) => {
            while (true) {
                for (const dayIndex of dayIndexes) {
                    const targetDate: any = isSpecificDay
                        ? new Date(currentDate.getFullYear(), Number(month) - 1, weekMap[weekdayOfMonth])
                        : getNthWeekdayOfMonth(currentDate.getFullYear(), Number(month) - 1, dayIndex, weekMap[weekdayOfMonth]);

                    if (targetDate.setHours(0, 0, 0, 0) > windowEndDate) {
                        dates.push(new Date(targetDate));
                        return; // Exit the loop once window end date is exceeded
                    }

                    const event = eventDataForBinding(eventDetails, targetDate);
                    AllEvents.push(event);
                    dates.push(new Date(targetDate));
                }
                currentDate.setFullYear(currentDate.getFullYear() + yearFreq);
            }
        };

        if (frequency?.day === "TRUE") {
            // Process specific day based on weekdayOfMonth
            const targetDayIndexes = [weekMap[weekdayOfMonth]]; // Specific day of the month
            processEvent(targetDayIndexes, true);
        } else if (frequency?.weekday === "TRUE") {
            // Process weekdays (Monday to Friday)
            const targetDayIndexes = [1, 2, 3, 4, 5]; // Monday to Friday
            processEvent(targetDayIndexes);
        } else if (frequency?.weekend_day === "TRUE") {
            // Process weekends (Saturday and Sunday)
            const targetDayIndexes = [0, 6]; // Sunday and Saturday
            processEvent(targetDayIndexes);
        } else {
            // Process specific days of the week
            const keys: any = Object.keys(frequency);
            for (let i = 0; i < daysOfWeekIndex.length; i++) {
                const key = daysOfWeekIndex[i];
                if (keys.includes(key) && frequency[key] === "TRUE") {
                    const targetDayIndex = i;
                    processEvent([targetDayIndex]);
                    break;
                }
            }
        }
    }
    function calculateNextDate(rule: any, firstDayOfWeek: string, currentDate: any, dates: Date[], endDate?: any, AllEvents?: any, eventDetails?: any): string {
        try {
            const { repeat } = rule;
            const repeatType = Object.keys(repeat[0])[0];
            const frequency = repeat[0][repeatType][0].$;
            let event: any = {};

            switch (repeatType) {
                case 'daily':
                    if (handleDailyRecurrence(frequency, currentDate, dates, AllEvents, eventDetails, endDate, rule.repeatInstances ? parseInt(rule.repeatInstances[0]) : 1000) === 'break') {
                        console.log("Recuurence Verify" + dates)
                        return 'break';
                    }
                    break;
                case 'weekly':
                    handleWeeklyRecurrence(frequency, currentDate, dates, AllEvents, eventDetails, endDate);
                    console.log("Recuurence Verify" + dates)
                    break;
                case 'monthly':
                    let { monthFrequency, dayOfMonth } = frequency;
                    if (dayOfMonth === undefined && frequency?.day !== undefined) {
                      dayOfMonth = frequency?.day;
                    }
                    currentDate.setDate(Number(dayOfMonth));
                  
                    while (true) {
                      if (currentDate > endDate) {
                        break;
                      }
                      event = eventDataForBinding(eventDetails, currentDate);
                      AllEvents?.push(event);
                      dates.push(new Date(currentDate));
                      currentDate.setMonth(currentDate.getMonth() + Number(monthFrequency));
                      currentDate.setDate(Number(dayOfMonth));
                    }
                    break;
                case 'monthlyByDay':
                    handleMonthlyByDay(frequency, currentDate, dates, AllEvents, eventDetails, endDate);
                    console.log("Recuurence Verify" + dates)
                    break;
                case 'yearlyByDay':
                    handleYearlyByDay(frequency, currentDate, dates, AllEvents, eventDetails, endDate);
                    console.log("Recuurence Verify" + dates)
                    break;

                case 'yearly':
                    const { yearFrequency, month, day } = frequency;
                    currentDate.setMonth(Number(month) - 1);
                    currentDate.setDate(Number(day));
                    currentDate.setFullYear(currentDate.getFullYear() + Number(yearFrequency));
                    event = eventDataForBinding(eventDetails, currentDate)
                    AllEvents?.push(event)
                    dates.push(new Date(currentDate));
                    console.log("Recuurence Verify" + dates)
                    break;
                default:
                    return 'break';
            }
        } catch (error) {
            console.error("Date creation error", error);
        }
        return '';
    }
    // End of Recurrence data 
    const returnRecurrenceInfo = (startDate: Date, endDate: Date, recurrenceData: string) => {
        const returnedRecurrenceInfo = {
            recurrenceData: recurrenceData,
            eventDate: startDate,
            endDate: endDate,
        };
        setReturnedRecurrenceInfo(returnedRecurrenceInfo);
        console.log(returnedRecurrenceInfo);
    };
    const handleRecurrenceCheck = (
        ev: React.FormEvent<HTMLElement | HTMLInputElement>,
        recurChecked: boolean
    ) => {
        ev.preventDefault();
        setShowRecurrenceSeriesInfo(recurChecked);
    };

    const currentDate = new Date();
    // Handle Save In the Working Action
    const HandleRecurrenceUpdate=(returnedRecurrenceInfo:any)=>{
        if(returnedRecurrenceInfo!= null){
            let Taskobject=TaskData[0];
            Taskobject.EventDate = Taskobject?.StartDate != null ? Taskobject?.StartDate : currentDate;
            Taskobject.EndDate = Taskobject?.DueDate != null ? Taskobject?.DueDate : currentDate.getDate()+3;
            Taskobject.RecurrenceData = returnedRecurrenceInfo?.recurrenceData;
            let WorkingDetails = parseRecurrence(Taskobject)
            let WorkingActionJson = [
                { "Title": "Bottleneck", "InformationData": [] },
                { "Title": "Attention", "InformationData": [] },
                { "Title": "Phone", "InformationData": [] },
                { "Title": "WorkingDetails", "InformationData": WorkingDetails }
            ];
            if (!Array?.isArray(Taskobject?.WorkingAction)) {
                Taskobject.WorkingAction = [];
            }
             if(WorkingAction.current?.length>0){
                WorkingAction.current?.map((workingData:any)=>{
                    if(workingData?.Title==="WorkingDetails"){
                       if(copyTaskData?.RecurrenceData!=undefined && copyTaskData?.RecurrenceData?.length>0){
                        workingData.InformationData=WorkingDetails
                       }else{
                        workingData.InformationData=[... workingData.InformationData,...WorkingDetails]
                       }
                       
                    }
                })
                console.log(props?.WorkingAction)
                console.log(  WorkingAction.current)
                let Updatedworkingjson = [
                    ...Taskobject.WorkingAction, 
                    ... WorkingAction.current
                ];
                UpdateWorkinActionJSON(Updatedworkingjson);
             }else{
                let Updatedworkingjson = [
                    ...Taskobject.WorkingAction, 
                    ...WorkingActionJson
                ];
                UpdateWorkinActionJSON(Updatedworkingjson);
             }
            
            //  props?.setWorkingAction(props?.WorkingAction);
             
            // Combine with existing WorkingAction
           
    
           
        }
    }
    const customRecurrenceSeries = () => {
        return (
          <>
            <div className='subheading' >
              Select Recurrence 
            </div>
            <GlobalTooltip ComponentId='3292' />
          </>
        )
      }

    return (
        <>
        <div
            className="bdr-radius" >
            <Toggle
                className="rounded-pill"
                defaultChecked={false}
                checked={showRecurrenceSeriesInfo}
                inlineLabel
                title='Recurrence'
                // label="Recurrence"
                onChange={handleRecurrenceCheck}
                styles={{
                    root: { marginBottom: "10px" },
                    label: { fontWeight: "bold" }
                }}
            />
        </div>
        {showRecurrenceSeriesInfo && (
            <Panel
                headerText="Recurring Task"
                isOpen={showRecurrenceSeriesInfo}
                onDismiss={() => setShowRecurrenceSeriesInfo(false)}
                type={PanelType.medium}
                onRenderHeader={customRecurrenceSeries}
                closeButtonAriaLabel="Close"
               
            >
                <EventRecurrenceInfo
                    context={props.props.context}
                    display={true}
                    recurrenceData={TaskData?.length > 0 ? TaskData[0]?.RecurrenceData : props?.props?.Items?.RecurrenceData}
                    startDate={TaskData?.StartDate ? TaskData.StartDate : currentDate}
                    siteUrl={props?.props?.AllListId?.siteUrl}
                    returnRecurrenceData={returnRecurrenceInfo}
                    selectedKey={undefined}
                    DueDate ={TaskData[0]?.DueDate!=undefined? TaskData[0]?.DueDate:undefined}
                    selectedRecurrenceRule={undefined}
                />
                <div>
                    <button
                        type="button"
                        onClick={() => HandleRecurrenceUpdate(returnedRecurrenceInfo)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#0078d4",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >
                        Save
                    </button>
                </div>
            </Panel>
        )}
    </>
    
    )
}

export default RecurringTask
