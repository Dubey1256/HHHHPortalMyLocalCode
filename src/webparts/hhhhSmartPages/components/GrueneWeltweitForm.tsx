import React, { useState, useEffect } from 'react';
import "./Formdata.css";
import { Web } from 'sp-pnp-js';

const GrueneWeltweitForm = (props: any) => {
    const [txtCountry, setTxtCountry] = useState('');
    const [txtOccupation, setTxtOccupation] = useState('');
    const [txtComment, setTxtComment] = useState('');
    const [txtName, setTxtName] = useState('');
    const [txtEmail, setTxtEmail] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [enteredCaptcha, setEnteredCaptcha] = useState('');
    const [status, setStatus] = useState('');
    useEffect(() => {
        generateCaptcha();
    }, []);
    const generateCaptcha = () => {
        const alphabets = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
        const first = alphabets[Math.floor(Math.random() * alphabets.length)];
        const second = Math.floor(Math.random() * 10);
        const third = Math.floor(Math.random() * 10);
        const fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
        const fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
        const sixth = Math.floor(Math.random() * 10);
        const captchaValue = `${first}${second}${third}${fourth}${fifth}${sixth}`;
        setCaptcha(captchaValue);
        setStatus('');
    };

    const checkCaptcha = () => {
        if (enteredCaptcha === captcha) {
            addItemClickCount();
        } else {
            setStatus("Invalid captcha.....");
            setEnteredCaptcha('');
        }
    };

    const addItemClickCount = async () => {
        let web = new Web(props.AllList.GrueneSitesListUrl);
        try {
            const postDataArray = {
                Title: txtName,
                Email: txtEmail,
                Country: txtCountry,
                Occupation: txtOccupation,
                GrueneWeltweitInterested: txtComment
            };
            await web.lists.getById("a7213bba-0d3c-48f3-9f8a-0d5ec947b81c").items.add(postDataArray).then(async (data: any) => {
                console.log('Response:', data);
                setStatus('Vielen Dank für Dein Interesse. Wir melden uns bei dir mit Neuigkeiten');
                setTxtCountry('');
                setTxtOccupation('');
                setTxtComment('');
                setTxtName('');
                setTxtEmail('');
                setEnteredCaptcha('');
            })
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    return (
        <div className="container">
            <div className="capctha">
                <form>
                    <div className="row">
                        <div className="col-sm-6 form-group">
                            <label htmlFor="fname">Name <span className="required-asterisk">*</span></label>
                            <input type="text" id="fname" name="Title" value={txtName} onChange={(e) => setTxtName(e.target.value)} placeholder="Enter Name here.." />
                        </div>
                        <div className="col-sm-6 form-group">
                            <label htmlFor="lname">Email <span className="required-asterisk">*</span></label>
                            <input type="text" id="lname" name="Email" value={txtEmail} onChange={(e) => setTxtEmail(e.target.value)} placeholder="Enter Email here.." />
                        </div>
                        <div className="col-sm-6 form-group">
                            <label htmlFor="country">Country</label>
                            <input type="text" id="lname" name="Country" value={txtCountry} onChange={(e) => setTxtCountry(e.target.value)} placeholder="Enter Country here.." />
                        </div>
                        <div className="col-sm-6 form-group">
                            <label htmlFor="country">Occupation</label>
                            <input type="text" id="lname" name="Occupation" value={txtOccupation} onChange={(e) => setTxtOccupation(e.target.value)} placeholder="Enter Occupation here.." />
                        </div>
                        <div className="col-sm-12 form-group">
                            <label htmlFor="subject">Interest in Gruene Weltweit</label>
                            <textarea id="subject" name="subject" value={txtComment} onChange={(e) => setTxtComment(e.target.value)} placeholder="Enter here.." style={{ height: '200px' }}></textarea>
                        </div>
                        <div className="col-sm-12 form-group">
                            <div className="mainbody">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control searchbox_height" id="entered-captcha" onPaste={(e) => e.preventDefault()} placeholder="Enter the captcha.." autoComplete="off" value={enteredCaptcha} onChange={(e) => setEnteredCaptcha(e.target.value)} />
                                    </div>
                                    <div className="col-sm-6">
                                      <div className="col valign-middle">
                                      <input type="text" className="text-center searchbox_height" onCopy={(e) => e.preventDefault()} id="generated-captcha" value={captcha} />
                                        <a onClick={generateCaptcha} id="newgen" title="Generate new captcha" className='ms-1'>
                                            <img src="https://www.gruene-washington.de/PublishingImages/Icons/32/Re-load.png" alt="reload icon" />
                                        </a>
                                      </div>
                                        <label className="full_width mt-5 mb-10"><div id="newstatus" className="c-red">{status}</div></label>
                                    </div>
                                    <div className="col-sm-2">
                                        <button type="button" className="btn btn-primary pull-right" disabled={!txtName && !txtEmail} onClick={checkCaptcha}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrueneWeltweitForm;
