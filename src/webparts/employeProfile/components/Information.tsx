import *as React from 'react'
import { BsLinkedin } from "react-icons/bs";
import { BsSkype } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { CiLink } from "react-icons/ci";
import { FaSquarePhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaCity } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { Web } from 'sp-pnp-js';
import moment from 'moment';
// import { FaAtlas } from "react-icons/fa";

const Information = (props: any) => {
    const [EmployeeData, setEmployeeData]: any = useState();
    const [hrUpdateData, setHrUpdateData]: any = useState()
    useEffect(() => {
        if (props?.EmployeeData != undefined) {
            setEmployeeData(props?.EmployeeData)
        }
        if (props?.siteTaggedHR && props?.hrUpdateData != undefined) {
            setHrUpdateData(props?.hrUpdateData)
        }
    }, [props?.EmployeeData != undefined || props?.hrUpdateData!=undefined])



    return (
        <>
            <div className='col-sm-12 ps-3 pe-0 mt-3 row'>
                <div className='border-bottom siteColor ps-0 mb-2'>Contact Information</div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaSquarePhone />
                    </span>
                    <span className="full_width ms-2 mt-1">{EmployeeData?.CellPhone}</span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter mb-3">
                    <span className="f-20">
                        <IoMdMail />
                    </span>
                    <span className="full_width ms-2 mt-1">
                        <a href={`mailto:${EmployeeData?.Email}`}>{EmployeeData?.Email}</a>
                    </span>
                </div>
            </div>
            <div className='col-sm-12 ps-3 pe-0 mt-3 row'>
                <div className='border-bottom siteColor ps-0 mb-2'>Social Media Information</div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <BsLinkedin />
                    </span>
                    <span className="full_width ms-2 mt-1"><a href={EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}>{EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}</a></span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter">
                    <span className="f-20">
                        <BsSkype />
                    </span>
                    <span className="full_width ms-2 mt-1">
                        <a href={EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}>{EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}</a>
                    </span>
                </div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaFacebook />
                    </span>
                    <span className="full_width ms-2 mt-1"><a href={EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}>{EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}</a></span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaSquareInstagram />
                    </span>
                    <span className="full_width ms-2 mt-1">
                        <a href={EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}>{EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}</a>
                    </span>
                </div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaTwitter />
                    </span>
                    <span className="full_width ms-2 mt-1"><a href={EmployeeData?.SocialMediaUrlsArray[0]?.Twitter}>{EmployeeData?.SocialMediaUrlsArray[0]?.Twitter}</a></span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter mb-3">
                    <span className="f-20">
                        <CiLink />
                    </span>
                    <span className="full_width ms-2 mt-1">
                        <a href={EmployeeData?.WebPage}>{EmployeeData?.WebPage}</a>
                    </span>
                </div>
            </div>
            {props?.siteTaggedHR && <div className='col-sm-12 ps-3 pe-0 mt-3 row'>
                <div className="infoblock Address p-0 col-sm-6 form-group">
                    <div className="border-bottom siteColor ps-0 mb-2">Address Information</div>
                    <div className="alignCenter mb-3">
                        <span className="f-20" title='city'>
                            <FaCity />
                        </span>
                        <span className="full_width ms-2 mt-1 ">{EmployeeData?.WorkCity}</span>
                    </div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="Country" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Website.svg" data-themekey="#" />
                        </span>
                        <span className="full_width ms-2 mt-1 ">{EmployeeData?.SmartCountries?.length > 0 ? EmployeeData?.SmartCountries[0]?.Title : null}</span>
                    </div>

                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="Fedral State" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/state.svg" data-themekey="#" />
                        </span>
                        <span className="full_width ms-2 mt-1 "></span>
                    </div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="Address" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/location.svg" data-themekey="#" />
                        </span>
                        <span className="full_width ms-2 mt-1 ">
                            {EmployeeData?.WorkAddress}
                        </span>
                    </div>
                </div>
                <div className="infoblock Address col-sm-6 form-group p-0">
                    <div className="border-bottom siteColor ps-0 mb-2">Bank Information</div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="BIC" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/BIC.svg" data-themekey="#" />
                        </span>
                        <span className="full_width ms-2 mt-1 ">{hrUpdateData?.BIC}</span>
                    </div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="IBAN" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/IBAN.svg" data-themekey="#" />
                        </span>
                        <span className="full_width ms-2 mt-1 ">{hrUpdateData?.IBAN}</span>
                    </div>
                </div>
            </div>}
            {props?.siteTaggedHR && <div className='col-sm-12 ps-3 pe-0 mt-3 row team_member'>
                <div className='border-bottom siteColor p-0 mb-2'>Personal Information</div>
                <dl className="col-lg-6 alignCenter ps-0">
                    <dt className="col-lg-3 bg-Fa">
                        Date of birth
                    </dt>
                    <dd className="col-lg-9 bg-Fa">
                        {hrUpdateData?.dateOfBirth != undefined && hrUpdateData?.dateOfBirth != "" ? moment(hrUpdateData?.dateOfBirth)?.format('DD-MM-YYYY') : ""}
                    </dd>
                </dl>
                <dl className="col-lg-6 pe-0">
                    <dt className="col-lg-3 bg-Fa">
                        Place of birth
                    </dt>
                    <dd className="col-lg-9 bg-Fa">
                        {hrUpdateData?.placeOfBirth}
                    </dd></dl>
                <dl className="col-lg-6 ps-0">
                    <dt className="col-lg-3 bg-Fa">
                        Nationality
                    </dt>
                    <dd className="col-lg-9 bg-Fa">
                        {hrUpdateData?.Nationality}
                    </dd>
                </dl>

                <dl className="col-lg-6 pe-0">
                    <dt className="col-lg-3 bg-Fa">
                        Marital status
                    </dt>
                    <dd className="col-lg-9 bg-Fa">
                        {hrUpdateData?.maritalStatus}
                    </dd>
                </dl>

            </div>}
        </>
    )
}
export default Information;