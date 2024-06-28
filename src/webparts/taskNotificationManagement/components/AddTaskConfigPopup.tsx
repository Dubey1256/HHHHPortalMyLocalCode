import { Panel, PanelType } from 'office-ui-fabric-react'
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js'
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import Button from 'react-bootstrap/Button';
import * as globalCommon from "../../../globalComponents/globalCommon";
let copyAllCategory:any=[]
let copyAllSiteData:any=[];
let users: any = []
const AddTaskConfigPopup = (props: any) => {
 const [DefaultSelectedUseremail, setDefaultSelectedUseremail] = React.useState([]);
    const [NotificationType ,setnotificationType]:any= useState(["All","Teams", "Email","Assigned To","Lead"])
    const [Notify,setnotify]:any=useState(["Creator","Approval","Specific"])
    const [notificationType, setNotificationType] = useState("")
    const [Category, setCategory]= React.useState<string[]>([])
    const[avoidItself,setAvoidItSelf]:any=useState(false)
    const [exceptionCategory, setExceptionCategory] = React.useState<string[]>([]);
    const [exceptionSite, setExceptionSite] = React.useState<string[]>([]);
    const [notify, setNotify] = useState("")
    const [selectedPersonsAndGroups, setSelectedPersonsAndGroups] = React.useState([]);
    const [AllCategory, setAllCategory] = useState([])
    const [AllSite, setAllSite] = useState([])
    const[selectedSite,setSelectedSite]=useState("")
    useEffect(() => {
        if (props?.editTaskconfigData != undefined) {
            setNotificationType(props?.editTaskconfigData?.NotificationType);
            setNotify(props?.editTaskconfigData?.Notify)
            setCategory(props?.editTaskconfigData?.Category);
            setAvoidItSelf(props?.editTaskconfigData?.avoidItself)
            setExceptionCategory(props?.editTaskconfigData?.ExceptionCategory)
            setSelectedPersonsAndGroups(props?.editTaskconfigData?.Notifier)
            setSelectedSite(props?.editTaskconfigData?.selectedSite),
            setExceptionSite(props?.editTaskconfigData?.ExceptionSite)
                let selectesUser:any=[];
                if(props?.editTaskconfigData?.Notifier?.length>0){
                    props?.editTaskconfigData?.Notifier?.map((data:any)=>{
                        selectesUser.push(data?.Email)  
                    })
                }
                setDefaultSelectedUseremail(selectesUser)
            // setException(
            //     props?.editTaskconfigData?.ExceptionCategory?.length>0 ? [...exception, item.key as string] : exception.filter(key => key !== item.key),
            //   );

          }
        GetSmartMetadata()
        loadusersAndGroups();
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
                  let allSiteData=  CategoryData?.filter((data:any)=>data?.TaxType=="Sites")
                  copyAllSiteData=JSON.parse(JSON.stringify(allSiteData));
                   allSiteData?.unshift({Title:"All"});
                     setAllSite(allSiteData);
                  let  AllCategory = CategoryData?.filter((data:any)=>data.TaxType=="Categories")
                  copyAllCategory=JSON.parse(JSON.stringify(AllCategory));
                    copyAllCategory=AllCategory
                    AllCategory.unshift({Title:"All"});
                    setAllCategory(AllCategory)
                }
              
            }).catch((error: any) => {
                console.log(error)
            });


    };
    const loadusersAndGroups = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let web = new Web(pageInfo.WebFullUrl);
            await web.siteUsers.get().then((userData) => {
                console.log(userData)
                users = userData
            }).catch((error: any) => {
                console.log(error)
            });
        }

    }
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className=" full-width pb-1 AddTaskConfigPopup " > <div className="subheading">
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
        // if (selectedType == "Category") {
           
        //     setCategory(key)
        // }
       
        if(selectedType=="Notify"){
            setNotify(key)
        }
        if(selectedType==="SelectedSite"){
            setSelectedSite(key)
        }
    }
    const onChangeCategory = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item) {
            setCategory(
            item.selected ? [...Category, item.key as string] : AllCategory.filter(key => key !== item?.key),
          );
        }
      };
    const onChangeExceptionCategory = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item) {
            setExceptionCategory(
            item.selected ? [...exceptionCategory, item.key as string] : exceptionCategory.filter(key => key !== item?.key),
          );
        }
      };
      const onChangeExceptionSite = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item) {
            setExceptionSite(
            item.selected ? [...exceptionSite, item.key as string] : exceptionSite.filter(key => key !== item?.key),
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
        let peopleAndGroup: any = [];
        allConfigData=props?.allTaskStatusToConfigure;
        selectedPersonsAndGroups?.map((user: any) => {
            let foundPerson = users?.find((person: any) => (person?.LoginName == user?.id) || (person?.Title == user?.Title));
            if (foundPerson?.Id != undefined) {
                peopleAndGroup?.push(foundPerson)
            }
        })
        
        let configData:any={
            percentComplete:props?.percentageComplete,
            NotificationType:notificationType,
            Category:Category,
            selectedSite:selectedSite,
            ExceptionSite:selectedSite=="All"?exceptionSite:"",
            ExceptionCategory:Category?.some((cat:any)=>cat==="All")?exceptionCategory:"",
            Notifier:notify=="Specific"?peopleAndGroup:[],
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
                         placeholder="Select options"
                          
                         selectedKeys={Category}
                         // eslint-disable-next-line react/jsx-no-bind
                         onChange={onChangeCategory}
                         multiSelect
                         options={AllCategory?.map((AllCategory: any) => ({ key: AllCategory?.Title, text:AllCategory?.Title }))}
                        styles={{ dropdown: { width: '100%' } }}
                        
                        />
                    </div>
                </div>
              
                {Category?.some((cat:any)=>cat==="All")&& <div className='row alignCenter mb-3'>
                    <div className='col-3'><label className='form-label fw-semibold'>Exception Category</label></div>
                    <div className='col-9 '>
                        <Dropdown
                            placeholder="Select options"
                          
                            selectedKeys={exceptionCategory}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={onChangeExceptionCategory}
                            multiSelect
                            options={copyAllCategory?.map((copyAllCategory: any) => ({ key: copyAllCategory?.Title, text:copyAllCategory?.Title }))}
                           
                            styles={{ dropdown: { width: '100%' } }}
                        />
                        
                    </div>
                </div>}
                <div className='row mb-3 alignCenter'>
                    <div className='col-3'><label className='form-label fw-semibold'>Select Site</label></div>
                    <div className='col-9'>

                        <Dropdown className='full-width'
                            id="ItemRankUpload"
                            options={AllSite?.map((allSite: any) => ({ key: allSite?.Title, text: allSite?.Title }))}
                            selectedKey={selectedSite}
                            onChange=
                            {(e, option) => handleChange(option?.key, 'SelectedSite')}
                            styles={{ dropdown: { width: '100%' } }}
                        />
                    </div>
                </div>
                {selectedSite == "All" && <div className='row alignCenter mb-3'>
                    <div className='col-3'><label className='form-label fw-semibold'>Exception Site</label></div>
                    <div className='col-9 '>
                        <Dropdown
                            placeholder="Select options"
                          
                            selectedKeys={exceptionSite}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={onChangeExceptionSite}
                            multiSelect
                            options={copyAllSiteData?.map((copyAllSiteData: any) => ({ key: copyAllSiteData?.Title, text:copyAllSiteData?.Title }))}
                           
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
                    <div className='col-9' style={{ zIndex: '9999999999999' }}>

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
                      <label form="AvoidItself" className='alignCenter'><input type="checkbox" className='form-check-input ms-2' id="AvoidItself" name="AvoidItself"defaultChecked={avoidItself}  checked={avoidItself} onChange={(e)=>setAvoidItSelf(e?.target?.checked)}/> <span className='me-2'>Ignore Notification if Creator and Notifier are the same person</span></label>
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