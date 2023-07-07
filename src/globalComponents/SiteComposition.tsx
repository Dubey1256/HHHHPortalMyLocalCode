import * as React from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import pnp, { Web} from "sp-pnp-js";

var myarray4: any = [];
let ClientTimeArray: any[] = [];
export default function Sitecomposition(datas:any) {
// GetSmartMetaData

const [show, setshows] = React.useState(false);

const [showComposition, setshowComposition] = React.useState(true);
const [smartMetaDataIcon, setsmartMetaDataIcon] = React.useState([]);
React.useEffect(()=>{
  getsmartmetadataIcon();

if(datas?.props?.ClientCategory?.results?.length>0||datas?.props.Sitestagging != undefined){
  GetSmartMetaData(datas?.props?.ClientCategory?.results,datas?.props?.Sitestagging)
}
  
},[datas?.props?.ClientCategory?.results])


const GetSmartMetaData = async (ClientCategory: any, ClientTime: any) => {
  const array2: any[] = [];
  let ClientTime2:any[]=[];  

  if (ClientTime != null) {
    ClientTime2 = JSON.parse(ClientTime);
  }
   ClientTimeArray = ClientTime2.filter((item:any)=>item?.Title!="Gender")

  const web = new Web(datas?.sitedata?.siteUrl);
  const smartMetaData = await web.lists
    .getById(datas?.sitedata?.SmartMetadataListID)
    .items.select('Id', 'Title', 'IsVisible', 'TaxType', 'Parent/Id', 'Parent/Title', 'siteName', 'siteUrl', 'SmartSuggestions', 'SmartFilters')
    .expand('Parent')
    .filter("TaxType eq 'Client Category'")
    .top(4000)
    .get();

  ClientCategory?.forEach((item: any) => {
    smartMetaData?.forEach((metaDataItem: any) => {
      if (item?.Id == metaDataItem?.Id) {
        item.SiteName = metaDataItem?.siteName;
        array2.push(item);
      }
    });
  });

  console.log(ClientCategory);

  if (ClientTimeArray != undefined && ClientTimeArray != null) {
    ClientTimeArray?.forEach((timeItem: any) => {
      array2?.forEach((item: any) => {
        if (timeItem?.Title == item?.SiteName ) {
          if (timeItem.ClientCategory == undefined) {
            timeItem.ClientCategory = [];
            timeItem.ClientCategory.push(item);
          } else {
            timeItem.ClientCategory.push(item);
          }
        }
      });
    });
  }
  setshows(true)
};

// Get meta data
const getsmartmetadataIcon=async()=>{

  let web = new Web(datas?.sitedata?.siteUrl);

  await web.lists

  // .getByTitle('SmartMetadata')

  .getById(datas?.sitedata?.SmartMetadataListID)

  .items

  .select('Id', 'Title', 'Item_x0020_Cover', 'TaxType',  'siteName', 'siteUrl', 'Item_x005F_x0020_Cover')




  .filter("TaxType eq 'Sites'").top(4000)

  .get().then((data:any)=>{

    setsmartMetaDataIcon(data);




  }).catch((error:any)=>{

  console.log(error)

  });

}

const  GetSiteIcon=(listName: string)=> {


  if (listName != undefined) {

    let siteicon = '';
   
      smartMetaDataIcon?.map((icondata:any)=>{

         if(icondata.Title!=undefined){

           if(icondata.Title.toLowerCase()==listName?.toLowerCase()&&icondata.Item_x0020_Cover!=undefined){

             siteicon=icondata.Item_x0020_Cover.Url

           }

           if(icondata.Title.toLowerCase()==listName?.toLowerCase()&&icondata.Item_x005F_x0020_Cover!=undefined){

             siteicon=icondata.Item_x005F_x0020_Cover.Url

           }

         }

       })

     

     return siteicon;
    }
  }
  // Open close 
  const  showhideComposition = () =>{

    if (showComposition) {
     setshowComposition(false)
    } else {

      setshowComposition(true)

    }




  }
  return (
    <>
    {(show && ClientTimeArray.length>0 )&&
       <dl className="Sitecomposition">
  <div className='dropdown'>

    <a className="sitebutton bg-fxdark "
     onClick={() => showhideComposition()}
     >

      <span >{showComposition ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span>Site Composition</span>
      
    </a>

    <div className="spxdropdown-menu"
     style={{ display: showComposition ? 'block' : 'none' }}
     >

      <ul>

        {ClientTimeArray?.map((cltime: any, i: any) => {

          return <li className="Sitelist">

            <span>

              <img style={{ width: "22px" }} src={`${GetSiteIcon(cltime?.Title)}`} />

            </span>

            {cltime?.ClienTimeDescription != undefined &&

              <span>

                {Number(cltime?.ClienTimeDescription).toFixed(2)}%

              </span>

            }

            {cltime.ClientCategory != undefined && cltime.ClientCategory.length>0 ?cltime.ClientCategory?.map((clientcat:any)=>{

            return(

             <span>{clientcat.Title}</span>

            )

            }) : null}

          </li>

        })}

      </ul>

    </div>

  </div>

</dl>
}
    </>
  );
}

