import * as React from "react";
import { useState } from "react";
import { Web } from "sp-pnp-js";
import Information from "./Information";
import Name_Details from "./Name_Details";
import "./MainProfile.css";

const MainProfile = () => {
  const [contactData, setContactData]: any = React.useState({
    Item_x0020_Cover: { Url: "" },
    country: { Title: "" },
    socialLink: {
      facebook: "",
      instagram: "",
      linkedIn: "",
      twitter: "",
    },
  });
  const [hr_Details, setHr_Details]: any = useState({
    Id: 0,
    sState: { Title: "" },
    sLanguage: { Title: "" },
  });

  const searchParams = new URLSearchParams(window.location.search);
   const contactID = searchParams.get("contactId");
  const contactFunc = async () => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
    await web.lists
      .getById("edc879b9-50d2-4144-8950-5110cacc267a")
      .items.getById(parseInt(contactID))
      .select(
        "Id",
        "Department",
        "Institution/Id",
        "Institution/Title",
        "JobTitle",
        "Email",
        "WorkPhone",
        "LinkedIn",
        "IM",
        "SocialMediaUrls",
        "WebPage",
        "WorkAddress",
        "WorkCity",
        "Item_x0020_Cover",
        "FullName",
        "SmartCountries/Title",
        "SmartCountries/Id"
      )
      .expand("Institution", "SmartCountries")
      .get()
      .then((data: any) => {
        let url: any = [];
        let smartCountry: any = data.SmartCountries;
        url = JSON.parse(data.SocialMediaUrls);
        url.push(...smartCountry);
        data["socialLink"] = url[0];
        data["country"] = url[1];
        setContactData(data);
        hrDataFunc(data.Id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hrDataFunc = async (id: any) => {
    const web1 = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
    await web1.lists
      .getById("6DD8038B-40D2-4412-B28D-1C86528C7842")
      .items.select(
        "BIC",
        "Country",
        "IBAN",
        "Nationality",
        "healthInsuranceCompany",
        "highestVocationalEducation",
        "healthInsuranceType",
        "highestSchoolDiploma",
        "insuranceNo",
        "otherQualifications",
        "dateOfBirth",
        "Fedral_State",
        "placeOfBirth",
        "maritalStatus",
        "taxNo",
        "churchTax",
        "taxClass",
        "monthlyTaxAllowance",
        "childAllowance",
        "SmartState/Title",
        "SmartState/Id",
        "SmartLanguages/Title",
        "SmartLanguages/Id",
        "SmartContact/Title",
        "SmartContact/Id"
      )
      .expand("SmartLanguages", "SmartState", "SmartContact")
      .get()
      .then((data: any) => {
        data.map((item: any) => {
          if (id === item.SmartContact.Id) {
            item.sLanguage = ''
            if (item.SmartLanguages != null) {
                if (item.SmartLanguages.length > 0) {
                    item.SmartLanguages.map((Language: any, index: any) => {
                        if (index == 0) {
                            item.sLanguage = Language.Title;
                        } else if (index > 0) {
                            item.sLanguage = item.sLanguage + ', ' + Language.Title;
                        }
                    })
                }
            }
            //item["sLanguage"] = item.SmartLanguages[0];
            item["sState"] = item.SmartState[0];
            let date = new Date(item.dateOfBirth)
            let day= ""+ date.getDate();
            let month = ""+ date.getMonth()+1;
            let year = date.getFullYear();
            
            if (month.length < 2) 
            month = '0' + month;
           if (day.length < 2) 
            day = '0' + day;

            let completeDate= [day, month, year].join('/')
            item["newDate"]=completeDate;
            setHr_Details(item);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    contactFunc();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <section style={{ flex: 1 }}>
        <Name_Details data={contactData} />
      </section>
      <section style={{ flex: 5 }}>
        <Information data={contactData} hrData={hr_Details} />
      </section>
    </div>
  );
};
export default MainProfile;