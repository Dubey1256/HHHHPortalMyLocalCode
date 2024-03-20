import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
// let propColumns: any = [];
let allColumns: any = [];
const ListCreatePopup = (props: any) => {
    const [listTitle, setListTitle] = React.useState('');
    const [columnName, setColumnName] = React.useState('');
    const [columnType, setColumnType] = React.useState('');
    const [existingColumn, setExistingColumn] = React.useState([]);
    const [AllColumnGetValue, setAllColumnGetValue] = React.useState([]);

    const handleClosePopup = () => {
        props?.createListCallBack('close');
    };
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span style={{ color: `${props?.portfolioColor}` }} className="siteColor">Create List</span>
                </div>
            </>
        );
    };
    const handleChangeDateAndDataCallBack = () => {
        try {
            if (listTitle != "") {
                let defaultColumns: any = []
                const web = new Web(props?.AllListId?.siteUrl);
                const listDescription = '';
                web.lists.ensure(listTitle, listDescription, 100, true).then(async (result: any) => {
                    console.log(`List created: ${result?.list?.Title}`);
                    const list = web.lists.getByTitle(listTitle);
                    const defaultColumns = await list.fields.get();
                    console.log("Default Columns:", defaultColumns);

                    let StoreColumn: any = [];
                    for (const elem of allColumns || []) {
                        let columnName = elem?.columnName;
                        let columnType = elem?.columnType
                        const columnExists = defaultColumns?.some((column: any) => column.InternalName === columnName);
                        if (!columnExists) {
                            let resp = await CreateColumns(list, columnName, columnType);
                            StoreColumn.push(resp?.data);
                        } else {
                            alert("This Column" + `${elem?.columnName}` + "are already exist");
                        }
                    }
                    let defultCol = [{ InternalName: "Title", }, { InternalName: "Created" }, { InternalName: "Modified" }];
                    StoreColumn = StoreColumn.concat(defultCol);

                    if (StoreColumn?.length > 0) {
                        const list = web.lists.getByTitle(listTitle);
                        await list.fields.get().then(async (defaultAllColumn) => {
                            if (defaultAllColumn?.length > 0) {
                                let filteredArray = defaultAllColumn?.filter((e: any) => StoreColumn.some((x: any) => e.InternalName === x.InternalName));
                                setAllColumnGetValue(filteredArray);
                                await addDynamicConfrigration(result, filteredArray);
                            }
                        });
                    }
                });
            }
        } catch (error) {
        }
    };
    const CreateColumns = async (list: any, columnNameUpdate: string, columnTypeUpdate: string) => {
        try {
            let addedField;
            if (list?.fields != undefined && columnTypeUpdate === "Single line of text" && columnNameUpdate != "") {
                addedField = await list.fields.addText(columnNameUpdate, 255, { /* additional properties */ });
                console.log("Single Line Text Column added successfully:", addedField);
            } else if (list?.fields != undefined && columnTypeUpdate === "Choice (menu to choose from)") {
                addedField = await list.fields.addMultiChoice("MultiChoiceColumn", ["Option1", "Option2", "Option3"], true, { /* additional properties */ });
                console.log("Multi-Choice Column added successfully:", addedField);
            } else if (list?.fields != undefined && columnTypeUpdate === "Multiple lines of text") {
                addedField = await list.fields.addMultilineText("MultilineTextColumn", 10, false, true, false, true, { /* additional properties */ });
                console.log("Multiline Text Column added successfully:", addedField);
            } else if (list?.fields != undefined && columnTypeUpdate === "Date and Time") {
                addedField = await list.fields.addDateTime("DateTimeColumn", "DateTime", "DateTime", "FriendlyDisplayFormat", { /* additional properties */ });
                console.log("Date/Time Column added successfully:", addedField);
            } else if (list?.fields != undefined && columnTypeUpdate === "Number (1, 1.0, 100)") {
                addedField = await list.fields.addNumber("NumberColumn", 0, 100, { /* additional properties */ });
                console.log("Number Column added successfully:", addedField);
            }
            return addedField;
        } catch (error) {
            console.error("Error in CreateColumns:", error);
        }
    };

    const addDynamicConfrigration = async (result: any, allColumnConfig: any) => {
        let dynamicConfiguration: any = []
        allColumnConfig?.map((elem: any, index: any) => {
            if (elem.TypeDisplayName === "Single line of text") {
                let postDynamicConfiguration: any = {
                    internalName: elem.InternalName, displayName: elem.InternalName, type: "SingleLineText", id: elem.InternalName, placeholder: elem.InternalName, isColumnDefultSortingAsc: false, size: null, isColumnVisible: true, sortOrder: index
                }
                dynamicConfiguration.push(postDynamicConfiguration)
            } else if (elem.TypeDisplayName === "Counter") {
                let postDynamicConfiguration: any = {
                    internalName: elem.InternalName, displayName: elem.InternalName, type: "Number", id: elem.InternalName, placeholder: elem.InternalName, isColumnDefultSortingAsc: false, size: null, isColumnVisible: true, sortOrder: index
                }
                dynamicConfiguration.push(postDynamicConfiguration)
            } else if (elem.TypeDisplayName === "Date and Time") {
                let postDynamicConfiguration: any = {
                    internalName: elem.InternalName, displayName: elem.InternalName, type: "date", id: elem.InternalName, placeholder: elem.InternalName, isColumnDefultSortingAsc: false, size: null, isColumnVisible: true, sortOrder: index
                }
                dynamicConfiguration.push(postDynamicConfiguration)
            }
        })
        const dynamicConfigurationJSON = JSON.stringify(dynamicConfiguration, null, 2)
        let postCofig = {
            Title: listTitle,
            DatabaseListId: "",
            ColumnConfig: "",
            DynamicConfiguration: dynamicConfigurationJSON,
            ListId: result?.data?.Id
        }
        const updatePromises: Promise<any>[] = [];
        if (Object.keys(postCofig).length > 0) {
            const web = new Web(props?.AllListId?.siteUrl);
            const updatePromise: any = await web.lists.getById(props?.AllListId?.TableConfrigrationListId).items.add(postCofig);
            updatePromises.push(updatePromise);
        }
        setListTitle('');
        setColumnName('');
        setColumnType('');
        props?.createListCallBack('close');
    }
    const handleColumnNameChange = (e: any) => {
        setColumnName(e.target.value);
    };

    const handleColumnTypeChange = (e: any) => {
        setColumnType(e.target.value);
    };
    const handleSaveCreateColumn = () => {
        console.log('Column Name:', columnName);
        console.log('Column Type:', columnType);
        let column = { columnName: columnName, columnType: columnType }
        allColumns?.push(column);
        setExistingColumn(allColumns);
        setColumnName('');
        setColumnType('');
    };


    return (
        <Panel className="overflow-x-visible" type={PanelType.custom} customWidth="1300px" isOpen={props?.isOpen} onDismiss={handleClosePopup} onRenderHeader={onRenderCustomHeader} isBlocking={false}>
            <div className="col-sm-12">
                <div className="col-sm-3">
                    <div className="siteColor">Create List</div>
                    <div className=" d-flex">
                        <input type="text" className="ms-1" value={listTitle} onChange={(e) => setListTitle(e.target.value)} />
                    </div>
                </div>

                <div className="col-sm-3">
                    <div className="siteColor">Existing Column</div>
                    <div className=" d-flex">
                        {existingColumn?.map((elem: any) => {
                            return (
                                <div>{elem.columnName}</div>
                            )
                        })}
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="siteColor">Column Name:</div>
                    <div className=" d-flex">
                        <input type="text" value={columnName} onChange={handleColumnNameChange} />
                    </div>
                    <br />
                    <label>Column Type:</label>
                    <div>
                        <label> <input type="radio" value="Single line of text" checked={columnType === 'Single line of text'} onChange={handleColumnTypeChange} />Single line of text</label>
                    </div>
                    <br />
                    <button type="button" className="btn btn-primary mx-1 pull-right" style={{ backgroundColor: `${props?.portfolioColor}` }} onClick={handleSaveCreateColumn}>Create</button>
                </div>
            </div>


            <footer>
                <button type="button" className="btn btn-default pull-right" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} onClick={handleClosePopup}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary mx-1 pull-right" style={{ backgroundColor: `${props?.portfolioColor}` }} onClick={handleChangeDateAndDataCallBack}>
                    Apply
                </button>
            </footer>
        </Panel>
    );
};
export default ListCreatePopup;
