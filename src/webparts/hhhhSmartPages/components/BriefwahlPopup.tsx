import React, { useState } from 'react';
import './Briefwahl.css';
import './custom.css';
import { IoChevronForwardOutline, IoCloseOutline } from "react-icons/io5";
import { PiUploadSimple, PiDownloadSimple  } from "react-icons/pi";
import { BiSolidError } from "react-icons/bi";

const BriefwahlPopup = (props:any) => {
    const [showModal, setShowModal] = useState(props.showModal);
    const [showModal1, setShowModal1] = useState(props.showModal1);

    const cancelbox = () => {
        props.cancelbox();
    };

    const ModalPopup = () => {
        return (
            <><div id="box1content" className={`modal  ${showModal ? 'show' : ''}`} role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className='col-sm-12 text-end'> <a className="text-dark" onClick={cancelbox}><IoCloseOutline /></a></h3>
                        </div>
                        <div className="modal-body">
                            <div className="col-sm-12">
                                <h1>Anleitung Briefwahl - Bin in Deutschland gemeldet</h1>
                                <h3>Anleitung zur Beantragung von Briefwahlunterlagen</h3>
                                <img className="AnleitungDesktopImg" src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/AnleitungDesktop.jpg" />
                                <img className="AnleitungMobileImg" src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/AnleitungMobile.jpg" />
                                <p className="mb-20">Online-Formular der Melde-Gemeinde in <strong>OV Washington Briefwahl-Datenbank</strong> finden:</p>
                                <div className="banner col-lg-4 col-md-6 col-sm-12 justify-content-between valign-middle">Per Online-Antrag <IoChevronForwardOutline /></div>
                                <ul className="banner-list">
                                    <li>- Online-Formular ausfüllen</li>
                                    <li>- Unterlagen werden kostenlos zugeschickt</li>
                                </ul>
                                <div className="banner col-lg-4 col-md-6 col-sm-12 justify-content-between valign-middle">Per formloser Email <PiUploadSimple /></div>
                                <ul className="banner-list">
                                    <li>- Inhalt: Familienname, Vorname(n), Geburtsdatum, Anschrift</li>
                                    <li>- Unterlagen werken kostenlos zugeschickt</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="box2content"  className={`modal ${showModal1 ? 'show' : ''}`} role="dialog" style={{ display: showModal1 ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h3 className='col-sm-12 text-end'> <a className="text-dark" onClick={cancelbox}><IoCloseOutline /></a></h3>
                        </div>
                            <div className="modal-body">
                                <div className="col-sm-12 mb-20">
                                    <h1>Anleitung Briefwahl - Nicht mehr in Deutschland gemeldet</h1>
                                    <h3>Anleitung zum Eintrag ins Wähler*innenverzeichnis</h3>
                                    <p className="mb-20">Wer nicht mehr in Deutschland gemeldet ist muss den Eintrag ins Wähler*innenverzeichnis beantragen. Zuständig ist die Gemeinde, bei der man zuletzt gemeldet war.</p>
                                    <ul className="banner-list">
                                        <li className="mb-20 gap-2 valign-middle"> <BiSolidError  style={{color: '#f06564'}} /><span lang="DE">Muss bei jeder Wahl neu gemacht werden!</span></li>
                                        <li className="gap-2 valign-middle"><PiDownloadSimple /><a target="_blank" href="https://www.bundeswahlleiter.de/dam/jcr/dc589523-d709-4c43-adbc-9342dda468ad/bwo_anlage-2_ausfuellbar.pdf"><span lang="DE">Der Antrag als Download</span></a></li>
                                    </ul>
                                    <p>Zu schicken an: die für die letzte Meldeadresse zuständige Behörde.</p>
                                    <p>Frist: Sonntag, 5.September 2021 (Eingangsdatum be der Behörde)</p>
                                    <p>Mit dem Eintrag werden die Briefwahlunterlagen automatisch mit beantragt.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></>
        );
    };

    return (
        <>
            <ModalPopup />
        </>
    );
}

export default BriefwahlPopup;
