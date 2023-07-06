import * as React from "react";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
let checkedData:any=[];
const SelectedClientCategoryPupup = (props: any) => {
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(true);
    const [data, setData]= React.useState<any>({})
    
     const [allClientCategory,setClientCategory]=React.useState([])
    const [checked, setChecked] = React.useState(false);
   const getClientCategory=(data:any)=>{
     let parentcat:any=[]
    data?.ClientCategory?.results?.map((items:any)=>{
        parentcat.push(items)
      })
      setClientCategory(parentcat)
   }
       React.useEffect(() =>{
        setData(props?.items)
        getClientCategory(props?.items)
       },[])
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
        data.ClientCategory2={}
        data.ClientCategory2={
           results:[]
        };
         props.callback()
        checkedData=[];
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
    const saveCategories = () => {
        console.log("close")
        setPopupSmartTaxanomy(false)
        data.ClientCategory2={}
        data.ClientCategory2={
           results:checkedData};
      props.callback(data)
        checkedData=[];

    }
    const customFooter = () => {
        return (
            <footer>
                 <button type="button" className="btn btn-default float-end mx-3" onClick={() => closeSelectedClientCategoryPupup()}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary float-end " onClick={() => saveCategories()}>
                    OK
                </button>
               
            </footer>
        )
    }
   
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
            className={data?.Portfolio_x0020_Type == 'Service'|| data?.Services?.length>0 ? "serviepannelgreena" : ""}
            >

                {allClientCategory?.map((item: any, index: any) => (
                    <React.Fragment key={item?.Id}>
                        <label>
                            <input
                                value={item}
                                id={item?.Id}
                                name={item?.Title}
                                type="checkbox"
                                className="me-2"
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