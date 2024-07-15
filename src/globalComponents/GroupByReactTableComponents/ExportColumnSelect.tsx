import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from "react";
import Tooltip from "../../globalComponents/Tooltip";
const ExportColumnSelect = (props: any) => {
    const [ExportColumnSelect,setExportColumns]=React.useState<any>([]);
    React.useEffect(()=>{
     getColumnVisible()      
    },[])
    const getColumnVisible=()=>{
        let columns =props?.AllColumns;
        let notVisbleColumns: any = Object.keys(props?.NotVisbleColumns);
        let columnsData:any=[];
        columns?.map((columns7:any)=>{
            let columnsDisplay:any={};
                if(notVisbleColumns?.includes(columns7?.id)!=true && columns7?.placeholder!=undefined && columns7?.placeholder!=''){
                    columnsDisplay.id=columns7.id
                    columnsDisplay.placeholder=columns7.placeholder
                    columnsDisplay.displayChecked= true
                    columnsData.push(columnsDisplay)
                }
                else if(columns7?.placeholder!=undefined && columns7?.placeholder!=''){
                    columnsDisplay.id=columns7.id
                    columnsDisplay.placeholder=columns7.placeholder
                    columnsDisplay.displayChecked= false
                    columnsData.push(columnsDisplay)
                }
              
        })
        setExportColumns(columnsData)
    }

    const handleClosePopup = () => {
        props?.exportCallBack('close')
    };
    const handleChangeDateAndDataCallBack = () => {
        props.exportCallBack(ExportColumnSelect)
    };
    const exportColumnsSetting=(column:any,e:any)=>{
       
        ExportColumnSelect.map((columsChecked:any)=>{
            if(columsChecked?.id==column?.id){
                columsChecked.displayChecked=e.target.checked
            }
        })
        setExportColumns([...ExportColumnSelect])
    }
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span  className="siteColor">Export Columns</span>
                </div>
                <Tooltip ComponentId={8781} />
            </>
        );
    };

    return (
        <Panel className="overflow-x-visible"
            type={PanelType.custom} 
            customWidth="276px"
            isOpen={props?.isOpen}
            onDismiss={handleClosePopup}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
        >
            <div className="modal-body p-0 mt-2 mb-3">
                <div style={{ width: '100%' }} >
                    <div>
                        <div className="px-1"><div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }}><span className="siteColor"></span></div></div>
                        {ExportColumnSelect?.map((column: any) => {
                            return (
                                <div key={column?.id} className="px-1">
                                    {column?.placeholder != undefined && column?.placeholder != '' && <label>
                                        <input className="form-check-input cursor-pointer me-1" type='checkbox'checked={column?.displayChecked}
                                            onChange={(e: any) => exportColumnsSetting(column, e)} 
                                        />
                                        {column?.placeholder}
                                    </label>}
                                </div>
                            )
                        })}
                    </div>
                    
                </div>
            </div>
            <footer>
                <button type="button" className="btn btn-default pull-right" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} onClick={handleClosePopup}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary mx-1 pull-right" style={{ backgroundColor: `${props?.portfolioColor}` }} onClick={handleChangeDateAndDataCallBack}>
                    Export
                </button>
            </footer>
        </Panel>
    );



}
export default ExportColumnSelect;