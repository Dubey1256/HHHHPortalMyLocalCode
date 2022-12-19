import * as React from 'react';
import { useEffect, useRef } from "react";
import '../components/Style.css';

const Information = (props: any) => {
  console.log(props.props)
  let Item = props.props;
  const personGroupKeyRef = useRef(null);
  const healthInsuranceCompanyRef = useRef(null);
  useEffect(() => {
    // healthInsuranceCompanyRef.current.style.width =
    //   personGroupKeyRef.current.clientWidth + "px";
  }, []);
  return (


    <div>
      { Item&&

            <div>
              <h2 className="heading">Tax information</h2>

              <div className="item-container">
                <div className="item">
                  <div className="item-left">
                    <div className="item-label">Tax No</div>
                    <div className="item-label">Solidarity Surcharge</div>
                  </div>
                  <div className="item-right">
                    <div className="label-value">{Item.taxNo}</div>
                    <div className="label-value">{Item.solidaritySurcharge}</div>
                  </div>
                </div>
                <div className="item">
                  <div className="item-left">
                    <div className="item-label">Church Tax</div>
                    <div className="item-label">Monthly Tax Allowance</div>
                  </div>
                  <div className="item-right">
                    <div className="label-value">{Item.churchTax}</div>
                    <div className="label-value">{Item.monthlyTaxAllowance}</div>
                  </div>
                </div>
                <div className="item">
                  <div className="item-left">
                    <div className="item-label">Tax Class</div>
                    <div className="item-label">Child Allowance</div>
                  </div>
                  <div className="item-right">
                    <div className="label-value">{Item.taxClass}</div>
                    <div className="label-value">{Item.childAllowance}</div>
                  </div>
                </div>
              </div>

              <h2 className="heading">Social Security Insurance</h2>

              <div className="item">
                <div className="item-left" style={{ width: "unset" }}>
                  <div className="item-label" ref={healthInsuranceCompanyRef}>
                    Health Insurance Company
                  </div>
                </div>
                <div className="item-right" style={{ width: "100%" }}>
                  <div className="label-value">{Item.healthInsuranceCompany}</div>
                </div>
              </div>

              <div className="item-container">
                <div className="item">
                  <div className="item-left">
                    <div className="item-label" ref={personGroupKeyRef}>
                      Person Group Key
                    </div>
                    <div className="item-label">Health Insurance Type</div>
                    <div className="item-label">Levy 1 Type</div>
                    <div className="item-label">Levy 1 Reimbursement Rate</div>
                    <div className="item-label">Cobtribution Group HI</div>
                    <div className="item-label">Cobtribution Group UI</div>
                  </div>
                  <div className="item-right">
                    <div className="label-value">{Item.PersonGroupKey}</div>
                    <div className="label-value">{Item.healthInsuranceType}</div>
                    <div className="label-value">{Item.levy1Type}</div>
                    <div className="label-value">{Item.levy1ReimbursementRate}</div>
                    <div className="label-value">{Item.contributionGroupHi}</div>
                    <div className="label-value">{Item.contributionGroupUI}</div>
                  </div>
                </div>
                <div className="item">
                  <div className="item-left">
                    <div className="item-label">
                      Additional Contribution to HI(Rate)
                    </div>
                    <div className="item-label">Health Insurance No</div>
                    <div className="item-label">Levy 1 Contribution Rate</div>
                    <div className="item-label">Levy 2 Contribution Rate</div>
                    <div className="item-label">Contribution Group RI</div>
                    <div className="item-label">Contribution Group NCI</div>
                  </div>
                  <div className="item-right">
                    <div className="label-value">{Item.additionalContributionToHI}</div>
                    <div className="label-value">{Item.insuranceNo}</div>
                    <div className="label-value">{Item.levy1RateOfContribution}</div>
                    <div className="label-value">{Item.levy2ContributionRate}</div>
                    <div className="label-value">{Item.contributionGroupRI}</div>
                    <div className="label-value">{Item.contributionGroupNCI}</div>
                  </div>
                </div>
              </div>
            </div>
      }

    </div>

  );
};

export default Information;
