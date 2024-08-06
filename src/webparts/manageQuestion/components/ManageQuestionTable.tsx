import * as React from 'react'
import { Web } from 'sp-pnp-js'
import moment from 'moment'
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable'
import { ColumnDef } from '@tanstack/react-table';
import EditPage from '../../../globalComponents/EditPanelPage/EditPage'
import EditQuestion from './EditQuestion';

let AllListId: any
let ID: any

const ManageQuestions = (props: any) => {
    const [questions, setQuestions] = React.useState([])
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false)
    const [dataUpdate, setDataUpdate] = React.useState<any>({})
    const [headerChange, setHeaderChange]: any = React.useState('');
    let [descriptionChange, setDescrpitionChange]: any = React.useState("");
    const params = new URLSearchParams(window.location.search)
    const compID = params.get("taskId")

    React.useEffect(() => {
        loadQuestions();
    }, [])
    AllListId = {
        MasterTaskListID: props?.props?.MasterTaskListID,
        SmartHelpListID: props?.props?.SmartHelpListID,
        SitePagesList: props?.props?.SitePagesList,
        siteUrl: props?.props?.siteUrl
    }

    const web = new Web(AllListId?.siteUrl)
    const loadQuestions = async () => {
        await web.lists.getById(AllListId?.SmartHelpListID).items.select("Id, Title, Created, Modified, Body, Components/Id, Components/Title, Author/Id, Author/Title, Editor/Id, Editor/Title").expand("Components,Author,Editor").filter(`Components/Id eq ${compID}`).get().then((item: any) => {
            if(item.length>0){
                item.map((question: any) => {
                    question.ModifiedDate = moment(new Date(question.Modified)).format("DD/MM/YYYY")
                    question.showEditandDelete = true
                    question.subRows = []
                    if(question.Body){
                        question.Description = question.Body.replace("<p>","")
                        question.Description = question.Description.replace("</p>","")
                        question.Description = question.Description.replace("<br>","")
                    }
                    if (question.Description != "" && question.Description != undefined){
                        question.subRows.push({Title: question.Description, showEditandDelete: false})
                    }    
                })
            }
            setQuestions(item)
        }).catch((error: any) => {
            console.log(error)
        })

    }

    const editQuestionHandler = (ques: any) => {
        setisOpenEditPopup(true)
        setDataUpdate(ques)
        ID = ques.Id
    }

    const closeEditQuestionPopup = () => {
        setisOpenEditPopup(false)
    }

    const changeDescription =(items: any) => {
        setDescrpitionChange(items)
    }

    const changeHeader=(items:any)=>{
        setHeaderChange(items)
    }
    React.useEffect(() => {
        if (descriptionChange != null && descriptionChange != undefined){
            let modifiedDescription = descriptionChange.replace("<p>", "");
            modifiedDescription = modifiedDescription.replace("</p>", "");
            setDescrpitionChange(modifiedDescription)
        }
    }, [descriptionChange])
    
    const deleteQuestion = async (Id: any) => {
        if(confirm("Are you sure you want to delete this Question?")){
          await web.lists.getById(AllListId?.SmartHelpListID).items.getById(Id).delete()
          .then((i: any) => {
              console.log(i);
              questions.map((catId: any, index: any) => {
                  if (Id == catId.Id) {
                    questions.splice(index, 1);
                  }
              })
          })
          setQuestions((question: any) => [...question]);
        }    
      }

      

      const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        console.log(elem)
    }, []);

    let context = props.props.Context
    context.siteUrl = context.pageContext.web.absoluteUrl;
    context.SitePagesList = AllListId.SitePagesList;

    const columns2 = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: true,
                hasExpanded: true,
                size: 20,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row }) => (
                    <div className='alignCenter columnFixedTitle p-0'>
                        <>
                        {row?.original?.Title}
                        </>
                    </div>
                ),
                id: 'Title',
                placeholder: 'Search Question',
                resetColumnFilters: false,
                header: '',
                size: 500,
            },
            {
                accessorFn: (row: any) => row?.Components,
                cell: ({ row }: any) => (
                    <div className='alignCenter columnFixedTitle p-0'>
                        <>
                        {row.original.showEditandDelete == true && <a className='ms-1' target="_blank" data-interception="off" href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.Components[0]?.Id}`}> {row?.original?.Components[0]?.Title} </a>}
                        </>
                    </div>
                ),
                id: 'Components',
                placeholder: 'Component Name',
                resetColumnFilters: false,
                header: '',
                size: 91,
            },
            {
                accessorFn: (row: any) => row?.Modified,
                cell: ({ row }: any) => (
                    <div> 
                        {row?.original.Modified !== null && row.original.showEditandDelete == true ? moment(row?.original.Modified).format("DD/MM/YYYY") : ""}
                    </div>
                ),
                id: 'Modified',
                placeholder: 'Modified',
                resetColumnFilters: false,
                header: '',
                size: 91,
            },
            {
                accessorFn: "",
                cell: ({ row }: any) => (
                    <>
                    {row.original.showEditandDelete == true && <span title="Edit" className="alignIcon svg__iconbox svg__icon--edit hreflink" onClick={() => editQuestionHandler(row.original)}></span>}
                    </>    
                ),
                id: 'CreatedDate',
                placeholder: '',
                resetColumnFilters: false,
                header: '',
                size: 42,
            },
           {
            cell: ({ row }) => (
            <div className="alignCenter">
              {row.original.showEditandDelete == true && <span
                onClick={() => deleteQuestion(row?.original?.Id)}
                className="ml-auto alignIcon svg__iconbox svg__icon--trash hreflink"
                title="Delete"
              ></span>}
            </div>
          ),
          accessorKey: "",
          canSort: false,
          placeholder: "",
          header: "",
          id: "row.original",
          size: 1,
        },

        ], [questions]);

    return (
      <>
      <h2 className='heading mb-3'>{headerChange != undefined && headerChange != null && headerChange != '' ? headerChange : 'Manage Questions'}
      <EditPage context={context} changeHeader={changeHeader} changeDescription={changeDescription}/>
      <h5 className='mb-3'>{descriptionChange != undefined && descriptionChange != null && descriptionChange != '' ? descriptionChange : ''}</h5>
      </h2>
          <GlobalCommanTable
            data={questions}
            columns={columns2}
            callBackData={callBackData}
            showHeader={true}
            hideOpenNewTableIcon={true}
            hideTeamIcon={true}
          />
        {isOpenEditPopup && <EditQuestion AllListId={AllListId} dataUpdate={dataUpdate} setQuestion={loadQuestions} closeEditQuestionPopup={closeEditQuestionPopup}/>}    
      </>
    );
}
export default ManageQuestions;
