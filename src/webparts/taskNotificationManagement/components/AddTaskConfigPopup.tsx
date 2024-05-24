import { Panel, PanelType } from 'office-ui-fabric-react'
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js'
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import Button from 'react-bootstrap/Button';

let copyAllCategory:any=[]
let DefaultSelectedUseremail:any=[]
const AddTaskConfigPopup = (props: any) => {
    const [NotificationType ,setnotificationType]:any= useState(["Teams", "Email","Assigned To"])
    const [Notify,setnotify]:any=useState(["Creator","Approval","Specific"])
    const [notificationType, setNotificationType] = useState("")
    const [Category, setCategory] = useState("")
    const[avoidItself,setAvoidItSelf]:any=useState()
    const [exception, setException] = React.useState<string[]>([]);
    const [notify, setNotify] = useState("")
    const [selectedPersonsAndGroups, setSelectedPersonsAndGroups] = React.useState([]);
    const [AllCategory, setAllCategory] = useState([])
    useEffect(() => {
        if (props?.editTaskconfigData != undefined) {
            setNotificationType(props?.editTaskconfigData?.NotificationType);
            setNotify(props?.editTaskconfigData?.Notify)
            setCategory(props?.editTaskconfigData?.Category);
            setAvoidItSelf(props?.editTaskconfigData?.avoidItself)
            setException(props?.editTaskconfigData?.ExceptionCategory)
            setSelectedPersonsAndGroups(props?.editTaskconfigData?.Notifier)
            DefaultSelectedUseremail.push(props?.editTaskconfigData?.Notifier[0]?.secondaryText)
            // setException(
            //     props?.editTaskconfigData?.ExceptionCategory?.length>0 ? [...exception, item.key as string] : exception.filter(key => key !== item.key),
            //   );

          }
        GetSmartMetadata()
    },[])

    //==================GET SMARTMETADATA FOR GET
    const GetSmartMetadata = async () => {

        let web = new Web(props?.AllListId?.siteUrl);
        let MetaData = [];
        await web.lists
            .getById(props?.AllListId?.SmartMetadataListID)
            .items.select(
                "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Parent/Id,Parent/Title,EncodedAbsUrl,IsVisible,Created,Item_x0020_Cover,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,AlternativeTitle"
            ).expand("Author,Editor,Parent")
            .getAll().then((CategoryData: any) => {
                if(CategoryData?.length>0){
                   let  AllCategory = CategoryData?.filter((data:any)=>data.TaxType=="Categories")
                    copyAllCategory=AllCategory
                    AllCategory.unshift({Title:"All"});
                    setAllCategory(AllCategory)
                }
              
            }).catch((error: any) => {
                console.log(error)
            });


    };
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className=" full-width pb-1" > <div className="subheading">
                <span className="siteColor">
                    {props?.SelectedEditItem?.Id != undefined ? `Edit Task Configuration - ${props?.SelectedEditItem?.Title}` : 'Add Task Configuration'}
                </span>
            </div>
            </div>
        );
    };

    // ========handle onchnage function for ALL ===============
    const handleChange = (key: any, selectedType: any) => {
        if (selectedType == "NotificationType") {
            setNotificationType(key)
        }
        if (selectedType == "Category") {
           
            setCategory(key)
        }
       
        if(selectedType=="Notify"){
            setNotify(key)
        }
    }
    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item) {
            setException(
            item.selected ? [...exception, item.key as string] : exception.filter(key => key !== item.key),
          );
        }
      };

    // =====Handle people picker function ==========
    const handlePeopleChange = (people: any) => {
        setSelectedPersonsAndGroups(people)
        // console.log(people)
    }

    //============create config function start=================
    const CreateConfig=()=>{
        let allConfigData:any=[];
        allConfigData=props?.allTaskStatusToConfigure;
        let configData:any={
            percentComplete:props?.percentageComplete,
            NotificationType:notificationType,
            Category:Category,
            ExceptionCategory:Category=="All"?exception:"",
            Notifier:notify=="Specific"?selectedPersonsAndGroups:[],
            Notify:notify,
            avoidItself:avoidItself
        }
        if(props?.allTaskStatusToConfigure?.length>0){
           
            if(props?.editTaskconfigData!=undefined){
            
                allConfigData[props?.editTaskconfigData?.index]  =configData
            }
            else{
                allConfigData.push(configData)
            }
            // allConfigData?.push(configData)
        }
        
        else{
            allConfigData.push(configData)
        }
        DefaultSelectedUseremail=[]
      props?.setAllTaskStatusToConfigure(allConfigData)
      props?.TaskconfigCallback()
    }
    //============create config function End=================
    return (
        <Panel
            onRenderHeader={onRenderCustomHeader}
            // type={PanelType.medium}
            type={PanelType.custom}
            customWidth="800px"
            isOpen={true}
            onDismiss={() => props?.TaskconfigCallback()}
            isBlocking={false}
            layerProps={{ styles: { root: { zIndex: 1000000000 }}}}
>
            <div>
                <div className='row mb-3 alignCenter'>
                    <div className='col-3'><label className='form-label fw-semibold'>Notify Type</label></div>
                    <div className='col-9'>

                        <Dropdown className='full-width'
                            id="ItemRankUpload"
                            options={NotificationType?.map((NotificationType: any) => ({ key: NotificationType, text: NotificationType }))}
                            selectedKey={notificationType}
                            onChange=
                            {(e, option) => handleChange(option?.key, 'NotificationType')}
                            styles={{ dropdown: { width: '100%' } }}
                        />
                    </div>
                </div>
                <div className='row mb-3 alignCenter'>
                    <div className='col-3'><label className='form-label fw-semibold'>Category</label></div>
                    <div className='col-9'>

                        <Dropdown className='full-width'
                            id="ItemRankUpload"
                            options={AllCategory?.map((AllCategory: any) => ({ key: AllCategory?.Title, text: AllCategory?.Title }))}
                            selectedKey={Category}
                            onChange=
                            {(e, option) => handleChange(option?.key, 'Category')}
                            styles={{ dropdown: { width: '100%' } }}
                        />
                    </div>
                </div>
                {Category == "All" && <div className='row alignCenter mb-3'>
                    <div className='col-3'><label className='form-label fw-semibold'>Exception</label></div>
                    <div className='col-9 '>
                        <Dropdown
                            placeholder="Select options"
                          
                            selectedKeys={exception}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={onChange}
                            multiSelect
                            options={copyAllCategory?.map((copyAllCategory: any) => ({ key: copyAllCategory?.Title, text:copyAllCategory?.Title }))}
                           
                            styles={{ dropdown: { width: '100%' } }}
                        />
                        
                    </div>
                </div>}
                <div className='row alignCenter mb-3'>
                    <div className='col-3'><label className='form-label fw-semibold'>Notify</label></div>
                    <div className='col-9'>

                       <Dropdown className='full-width'
                            id="ItemRankUpload"
                            options={Notify?.map((Notify: any) => ({ key: Notify, text: Notify }))}
                            selectedKey={notify}
                            onChange=
                            {(e, option) => handleChange(option?.key, 'Notify')}
                            styles={{ dropdown: { width: '100%' } }}
                        />
                    </div>
                </div>
              {notify=="Specific" &&  <div className='row alignCenter mb-3'>
                    <div className='col-3'><label className='form-label fw-semibold'>Recipients</label></div>
                    <div className='col-9'>

                                  <PeoplePicker
                                    context={props?.AllListId?.Context}
                                    principalTypes={[PrincipalType.User, PrincipalType.SharePointGroup, PrincipalType.SecurityGroup, PrincipalType.DistributionList]}
                                    personSelectionLimit={10}
                             
                                    resolveDelay={1000}
                                    onChange={handlePeopleChange}
                                    showtooltip={true}
                                    required={true}
                                   defaultSelectedUsers={DefaultSelectedUseremail}
                                ></PeoplePicker>
                    </div>
                </div>}
                <div className='row mb-3'>
                      <label form="AvoidItself" className='alignCenter'><input type="checkbox" className='form-check-input ms-2' id="AvoidItself" name="AvoidItself" value="true" checked={avoidItself=="true"} onChange={(e)=>setAvoidItSelf(e.target.value)}/>Ignore If Creator or Notifier Same</label>
                </div>
            </div>
            <footer className='alignCenter mt-2'>
                    <div className="col text-end">
                    <Button type="button" variant="primary" className='me-1'  onClick={() => CreateConfig()} >Create</Button>
                  <Button type="button" className="btn btn-default" variant="secondary" onClick={() => props?.TaskconfigCallback()} >Cancel</Button>
                    </div>
                </footer>

        </Panel>

    )
}
export default AddTaskConfigPopup;