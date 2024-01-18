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
    }, [props?.EmployeeData != undefined || props?.hrUpdateData != undefined])



    return (
        <>
            <div className='col-sm-12 px-2 mt-3 row'>
                <div className='siteBdrBottom siteColor sectionHead ps-0 mb-2'>Contact Information</div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaSquarePhone />
                    </span>
                    <span className="full_widivh ms-2 mt-1">{EmployeeData?.CellPhone}</span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter mb-3">
                    <span className="f-20">
                        <IoMdMail />
                    </span>
                    <span className="full_widivh ms-2 mt-1">
                        <a href={`mailto:${EmployeeData?.Email}`}>{EmployeeData?.Email}</a>
                    </span>
                </div>
            </div>
            <div className='col-sm-12 px-2 mt-3 row'>
                <div className='siteBdrBottom sectionHead siteColor ps-0 mb-2'>Social Media Information</div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <BsLinkedin />
                    </span>
                    <span className="full_widivh ms-2 mt-1" style={{ wordBreak: "break-all" }}><a href={EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}>{EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}</a></span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter">
                    <span className="f-20">
                        <BsSkype />
                    </span>
                    <span className="full_widivh ms-2 mt-1" style={{ wordBreak: "break-all" }}>
                        <a href={EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}>{EmployeeData?.SocialMediaUrlsArray[0]?.LinkedIn}</a>
                    </span>
                </div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaFacebook />
                    </span>
                    <span className="full_widivh ms-2 mt-1" style={{ wordBreak: "break-all" }}><a href={EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}>{EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}</a></span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaSquareInstagram />
                    </span>
                    <span className="full_widivh ms-2 mt-1" style={{ wordBreak: "break-all" }}>
                        <a href={EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}>{EmployeeData?.SocialMediaUrlsArray[0]?.Facebook}</a>
                    </span>
                </div>
                <div className="col-sm-6 ps-0 alignCenter mb-3">
                    <span className="f-20">
                        <FaTwitter />
                    </span>
                    <span className="full_widivh ms-2 mt-1" style={{ wordBreak: "break-all" }}><a href={EmployeeData?.SocialMediaUrlsArray[0]?.Twitter}>{EmployeeData?.SocialMediaUrlsArray[0]?.Twitter}</a></span>
                </div>
                <div className="col-sm-6 pe-0 alignCenter mb-3">
                    <span className="f-20">
                        <CiLink />
                    </span>
                    <span className="full_widivh ms-2 mt-1" style={{ wordBreak: "break-all" }}>
                        <a href={EmployeeData?.WebPage}>{EmployeeData?.WebPage}</a>
                    </span>
                </div>
            </div>
            {props?.siteTaggedHR && <div className='col-sm-12 mt-3 px-2 row'>
                <div className="infoblock Adivress ps-0 col-sm-6 form-group">
                    <div className="siteBdrBottom sectionHead siteColor ps-0 mb-2">Address Information</div>
                    <div className="alignCenter mb-3">
                        <span className="f-20 ps-2" title='city'>
                            <FaCity />
                        </span>
                        <span className="full_widivh ms-2 mt-1 ">{EmployeeData?.WorkCity}</span>
                    </div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="Country" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Website.svg" data-themekey="#" />
                        </span>
                        <span className="full_widivh ms-2 mt-1 ">{EmployeeData?.SmartCountries?.length > 0 ? EmployeeData?.SmartCountries[0]?.Title : null}</span>
                    </div>

                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="Fedral State" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/state.svg" data-themekey="#" />
                        </span>
                        <span className="full_widivh ms-2 mt-1 "></span>
                    </div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="Adivress" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/location.svg" data-themekey="#" />
                        </span>
                        <span className="full_widivh ms-2 mt-1 ">
                            {EmployeeData?.WorkAdivress}
                        </span>
                    </div>
                </div>
                <div className="infoblock Adivress col-sm-6 form-group pe-0">
                    <div className="siteBdrBottom sectionHead siteColor pe-0 mb-2">Bank Information</div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="BIC" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/BIC.svg" data-themekey="#" />
                        </span>
                        <span className="full_widivh ms-2 mt-1 ">{hrUpdateData?.BIC}</span>
                    </div>
                    <div className="alignCenter mb-3">
                        <span className="f-20">
                            <img title="IBAN" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/IBAN.svg" data-themekey="#" />
                        </span>
                        <span className="full_widivh ms-2 mt-1 ">{hrUpdateData?.IBAN}</span>
                    </div>
                </div>
            </div>}
            {props?.siteTaggedHR && <div className='col-md-12 mt-3 px-2 mb-2 row'>
                <div className='siteBdrBottom siteColor sectionHead p-0 mb-2'>Personal Information</div>

                <div className="profileHead p-0">
                    <div className="bg-Fa profileLeftSec width15">
                        Date of birth
                    </div>
                    <div className="bg-FF profileRightSec width35">
                        {hrUpdateData?.dateOfBirth != undefined && hrUpdateData?.dateOfBirth != "" ? moment(hrUpdateData?.dateOfBirth)?.format('div-MM-YYYY') : ""}
                    </div>
                    <div className="bg-Fa profileLeftSec width15">
                        Place of birth
                    </div>
                    <div className="bg-FF profileRightSec width35">
                        {hrUpdateData?.placeOfBirth}
                    </div>
                </div>
                <div className="profileHead p-0">
                    <div className="bg-Fa profileLeftSec width15">
                        Nationality
                    </div>
                    <div className="bg-FF profileRightSec width35">
                        {hrUpdateData?.Nationality}
                    </div>
                    <div className="bg-Fa profileLeftSec width15">
                        Marital status
                    </div>
                    <div className="bg-FF profileRightSec width35">
                        {hrUpdateData?.maritalStatus}
                    </div>
                </div>
            </div>}
        </>
    )
}
export default Information;