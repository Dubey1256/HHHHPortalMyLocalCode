import * as React from "react";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
let checkedData:any=[];
const SelectedClientCategoryPupup = (props: any) => {
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(true);
    const [selectedCategory, setselectedCategory] = React.useState(props?.items);
 
    const [checked, setChecked] = React.useState(false);


    const customHeader = () => {
        return (
            <div className={"d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <h2 className="heading">Select -Client Category</h2>
                </div>
                {/* <Tooltip ComponentId="1626" /> */}
            </div>
        )
    }

    const closeSelectedClientCategoryPupup = () => {
        setPopupSmartTaxanomy(false)
        props.callback(checkedData)
        checkedData=[];
        // props.Call();
        // NewArray = []
        // setSelect([])
        // item.closePopupCallBack();

    }
    const saveCategories = () => {
        console.log("close")
        setPopupSmartTaxanomy(false)
        props.callback(checkedData)
        checkedData=[];

    }
    const customFooter = () => {
        return (
            <footer>
                <button type="button" className="btn btn-primary float-end me-5" onClick={() => saveCategories()}>
                    OK
                </button>
                <button type="button" className="btn btn-primary float-end me-5" onClick={() => closeSelectedClientCategoryPupup()}>
                    Cancel
                </button>
            </footer>
        )
    }
   
    const handleChange = (items: any, e: any) => {
        setChecked(!checked);
        if(e.currentTarget.checked){
            checkedData.push(items)
        }else{
            checkedData?.map((cat:any,index:any)=>{
               if(cat.Id==items.Id){
                checkedData.splice(index, 1, );
               }
            })
        }
        console.log('items......', items)
        console.log('e......', e)
    };
    return (
        <>
            <Panel
                onRenderHeader={customHeader}
                isOpen={PopupSmartTaxanomy}
                type={PanelType.custom}
                customWidth="850px"
                onDismiss={closeSelectedClientCategoryPupup}
                isBlocking={false}
                onRenderFooter={customFooter}
            // className={props?.props?.Portfolio_x0020_Type == 'Service'||props?.props?.Services?.length>0 ? "serviepannelgreena" : ""}
            >

                {selectedCategory?.map((item: any, index: any) => (
                    <React.Fragment key={item?.Id}>
                        <label>
                            <input
                                value={item}
                                id={item?.Id}
                                name={item?.Title}
                                type="checkbox"
                                className="mx-2"
                                onChange={(e) => handleChange(item, e)}
                            />
                            {item?.Title}
                        </label>
                        <br></br>
                    </React.Fragment>
                    
                ))}

            </Panel>

        </>
    )






}
export default SelectedClientCategoryPupup;