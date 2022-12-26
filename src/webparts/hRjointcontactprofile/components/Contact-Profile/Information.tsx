import * as React from "react";
import "./Information.css";

const Information = (props: any) => {
  const [navBar, setNavbar]: any = React.useState("information");
  const [navTrueFalse, setNavTrueFalse]: any = React.useState(true);
  const changeNav = (e: any, k: any) => {
    setNavTrueFalse(e);
    setNavbar(k);
  };
  console.log("checking here pushing data is ok or nit ===", props.hrData);
  return (
    <div>
      <section className="m-2 w-100">




        
        <nav style={{ width: "35%" }}>
          <ul
            className="text-center"
            style={{
              backgroundColor: '#F8F8F8',
              listStyle: "none",
              padding: "0%",
              display: "flex",
              margin: "0%",
            }}
          >
            <li className="border p-2 w-100 h-100 litest actives"  role={"button"}>INFORMATION</li>
            <li className="border p-2 w-100 h-100 litest actives"  role={"button"}>LEAVES</li>
            <li className="border p-2 w-100 h-100 litest actives"  role={"button"}>DOCUMENTS</li>
            <li className="border p-2 w-100 h-100 litest actives"  role={"button"}>TASKS</li>
          </ul>
        </nav>
        <section className="d-flex w-100 text-start border">
          <div style={{ width: "17%", margin: "10px" }}>
            <ul className="ul"
              style={{
                listStyle: "none",
                padding: "0%",
                margin: "0%",
              }}
            >
              <li 
                className="border p-2 litest "
                role={"button"}
                onClick={() => changeNav(true, "information")}
              >
                Information
                
              </li>
              <li
                className="border p-2 litest"
                role={"button"}
                onClick={() => changeNav(true, "taxInformation")}
              >
                Tax and Information
              </li>
              <li
                className="border p-2 litest"
                role={"button"}
                onClick={() => changeNav(true, "qualification")}
              >
                Qualification
              </li>
            </ul>
          </div>

          {navTrueFalse && navBar === "information" ? (
            <div style={{ width: "83%" }}>
              <div className="w-100">
                <div>
                  <h6 className="text1-hadding">Contact Information</h6>
                </div>
                <div className="d-flex">
                  <div className="w-50 d-flex align-items-center">
                    <img
                      className="img-fluid w-28"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Phone.svg"
                      alt="WorkPhone"
                    />

                    <p className="ms-3 text2-anchor">{props.data.WorkPhone}</p>
                  </div>
                  <div className="w-50 d-flex">
                    <img
                      className="w-28"
                      src="	https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/E-mail.svg"
                      alt="Email"
                    />

                    <p
                      className="ms-3 text2-anchor"
                      role={"button"}
                      onClick={() => {
                        window.location.href = "mailto: {props.data.Email}";
                      }}
                    >
                      {props.data.Email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-100 mt-3">
                <div>
                  <h6 className="text1-hadding">Social Media Information</h6>
                </div>
                <div className="d-flex">
                  <div className="w-50">
                    <div className="d-flex">
                      <img
                        className="w-28"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/linkedin.svg"
                        alt="linkedin"
                      />

                      <p className="ms-3">
                        <a
                          className="text-decoration-none text2-anchor"
                          href={props.data.socialLink.LinkedIn}
                          target="_blank"
                        >
                          {props.data.socialLink.LinkedIn}
                        </a>
                      </p>
                    </div>

                    <div className="d-flex">
                      <img
                        className="w-28"
                        src="	https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/facebook.svg"
                        alt="facebook"
                      />

                      <p className="ms-3">
                        <a
                          className="text-decoration-none text2-anchor"
                          href={props.data.socialLink.Facebook}
                          target="_blank"
                        >
                          {props.data.socialLink.Facebook}
                        </a>
                      </p>
                    </div>

                    <div className="d-flex">
                      <img
                        className="w-28"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/twitter.svg"
                        alt="twitter"
                      />

                      <p className="ms-3">
                        <a
                          className="text-decoration-none text2-anchor"
                          href={props.data.socialLink.Twitter}
                          target="_blank"
                        >
                          {props.data.socialLink.Twitter}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="w-50">
                    <div className="d-flex">
                      <img
                        className="w-28"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Skype.svg"
                        alt="skype"
                      />

                      <p className="ms-3">
                        <a
                          className="text-decoration-none text2-anchor"
                          href={props.data.IM}
                          target="_blank"
                        >
                          {props.data.IM}
                        </a>
                      </p>
                    </div>
                    <div className="d-flex">
                      <img
                        className="w-28"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/instagram.svg"
                        alt="instagram"
                      />

                      <p className="ms-3">
                        <a
                          className="text-decoration-none text2-anchor"
                          href={props.data.socialLink.Instagram}
                          target="_blank"
                        >
                          {props.data.socialLink.Instagram}
                        </a>
                      </p>
                    </div>
                    <div className="d-flex">
                      <img
                        className="w-28"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/link_m.svg"
                        alt="webpage"
                      />

                      <p className="ms-3">
                        <a
                          className="text-decoration-none text2-anchor"
                          href={props.data.WebPage}
                          target="_blank"
                        >
                          {props.data.WebPage}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-100 d-flex mt-3">
                <div className="w-50 m-1">
                  <div>
                    <h6 className="text1-hadding">Address Information</h6>
                  </div>
                  <div className="d-flex">
                    <img
                      className="w-28"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/city.svg"
                      alt="workcity"
                    />

                    <p className="ms-3 text2-anchor">{props.data.WorkCity}</p>
                  </div>
                  <div className="d-flex">
                    <img
                      className="w-28"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Website.svg"
                      alt="country"
                    />

                    <p className="ms-3 text2-anchor">{props.data.country.Title}</p>
                  </div>
                  <div className="d-flex">
                    <img
                      className="w-28"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/state.svg"
                      alt="state"
                    />

                    <p className="ms-3 text2-anchor">{props.hrData.sState.Title}</p>
                  </div>
                  <div className="d-flex">
                    <img
                      className="w-28"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/location.svg"
                      alt="WorkAddress"
                    />

                    <p className="ms-3 text2-anchor">{props.data.WorkAddress}</p>
                  </div>
                </div>

                <div className="w-50 m-1">
                  <div>
                    <h6 className="text1-hadding">Bank Information</h6>
                  </div>
                  <div className="col d-flex">
                    <img
                      className="w-28"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/BIC.svg"
                      alt="BIC"
                    />

                    <p className="ms-3 text2-anchor">{props.hrData.BIC}</p>
                  </div>
                  <div className="d-flex">
                    <img
                      className="w-28"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/IBAN.svg"
                      alt="IBAN"
                    />

                    <p className="ms-3 text2-anchor">{props.hrData.IBAN}</p>
                  </div>
                </div>
              </div>

              <div className="w-100 mt-3">
                <div className="row">
                  <h6 className="text1-hadding">Personal Information</h6>
                </div>
                <div className="d-flex">
                  <div className="w-50">
                    <div className="d-flex w-100">
                      <h6 className="w-25"> Date of Birth</h6>
                      <p className="w-75 text2-anchor">{props.hrData.newDate}</p>
                    </div>
                    <div className="d-flex w-100">
                      <h6 className="w-25"> Nationality</h6>
                      <p className="w-75 text2-anchor">{props.hrData.Nationality}</p>
                    </div>
                  </div>
                  <div className="w-50">
                    <div className="d-flex w-100">
                      <h6 className="w-25">Place of birth</h6>
                      <p className="w-75 text2-anchor">{props.data.placeOfBirth}</p>
                    </div>
                    <div className="d-flex w-100">
                      <h6 className="w-25">Marital status</h6>
                      <p className="w-75 text2-anchor">{props.hrData.maritalStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {navTrueFalse && navBar === "taxInformation" ? (
            <div style={{ width: "83%" }}>
              <div>
                <div>
                  <h6 className="text1-hadding">Tax Information</h6>
                </div>
                <div className="d-flex w-100">
                  <div className="me-2" style={{ width: "33.33%" }}>
                    <div className="d-flex">
                      <h6>Tax No</h6>
                      <p className="ms-3 text2-anchor">{props.hrData.taxNo}</p>
                    </div>
                    <div className="d-flex">
                      <h6>Monthly Tax Allowance</h6>
                      <p className="ms-3 text2-anchor">
                      
                        {props.hrData.monthlyTaxAllowance}
                      </p>
                    </div>
                  </div>
                  <div className="me-2" style={{ width: "33.33%" }}>
                    <div className="d-flex">
                      <h6>Church tax</h6>
                      <p className="ms-3 text2-anchor">{props.hrData.churchTax}</p>
                    </div>
                    <div className="d-flex">
                      <h6>Child Allowance</h6>
                      <p className="ms-3 text2-anchor">{props.hrData.childAllowance}</p>
                    </div>
                  </div>
                  <div style={{ width: "33.33%", display: "flex" }}>
                    <h6>Tax class</h6>
                    <p className="ms-3 text2-anchor">{props.hrData.taxClass}</p>
                  </div>
                </div>
              </div>

              <div className="w-100">
                <h6 className="text1-hadding">Social Security Insurance</h6>

                <div>
                  <div className="d-flex">
                    <h6>Health Insurance Company</h6>
                    <p className="ms-3 text2-anchor">
                      {props.hrData.healthInsuranceCompany}
                    </p>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 d-flex">
                      <h6>Health Insurance Type</h6>
                      <p className="ms-3 text2-anchor">{props.hrData.healthInsuranceType}</p>
                    </div>
                    <div className="w-50 d-flex">
                      <h6>Health Insurance No</h6>
                      <p className="ms-3 text2-anchor">{props.hrData.insuranceNo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {navTrueFalse && navBar === "qualification" ? (
            <div style={{ width: "83%" }}>
              <h6 className="text1-hadding">Qualifications</h6>

              <div className="d-flex w-100">
                <div className="w-50">
                  <div className="d-flex">
                    <h6>Highest school diploma</h6>
                    <p className="ms-3 text2-anchor">{props.hrData.highestSchoolDiploma}</p>
                  </div>
                  <div className="d-flex">
                    <h6>Other qualifications</h6>
                    <p className="ms-3 text2-anchor">{props.hrData.otherQualifications}</p>
                  </div>
                </div>
                <div className="w-50">
                  <div className="d-flex">
                    <h6>Highest vocational education</h6>
                    <p className="ms-3 text2-anchor">
                 
                      {props.hrData.highestVocationalEducation}
                    </p>
                  </div>
                  <div className="d-flex">
                    <h6>Languages</h6>
                    <p className="ms-3 text2-anchor">{props.hrData.sLanguage}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </div>
  );
};
export default Information;
