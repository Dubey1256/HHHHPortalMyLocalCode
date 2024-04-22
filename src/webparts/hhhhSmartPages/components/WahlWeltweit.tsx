
import React, { useState } from 'react';
import './Wahlweltweit.css'; 


const WahlWeltweit = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleAccordionClick = (index:any) => {
      setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (
        <><div className="red_block">
            <a href="https://gruene-weltweit.de/SitePages/Bundestagswahl2021.aspx">OV Washington - Briefwahl Suchmaschine
                <svg className="right-arrowSvg" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32"></path>
                </svg>
            </a>
        </div>
        <section id="content" className='SmartPages'>
                
        <div id="content-wrap">
        <div className="container topmargin-sm bottommargin-sm clearfix">
            <h1 className="privacypageTitle ">Warum eigentlich aus dem Ausland wählen? Es gibt 1000 gute Gründe …</h1>
            <p>Deutsche Politik betrifft Dich unmittelbar<br/>
                Egal, ob Du noch die deutsche Staatsbürgerschaft besitzt, Familie oder Freunde in Deutschland hast und
                nicht kategorisch
                ausschließen kannst, irgendwann nach Deutschland zurückzugehen!<br/>
                Sie betrifft Deine Rechte und Pﬂichten als Staatsbürger*in, betrifft das Leben Deiner Familie und Deiner
                Freunde, sie
                bestimmt, unter welchen Bedingungen Du bei Deiner Rückkehr in Deutschland leben wirst. Solltest Du
                arbeitslos oder krank
                werden und in die Heimat zurückkehren müssen, bist Du auf eine funktionierende Sozial- und
                Gesundheitspolitik
                angewiesen. Doch damit nicht genug: Politik - egal in welchem Land! - betrifft die Zukunft der Welt.<br/>
                Klima, Krieg, Freiheit und Frieden betreffen alle Menschen! Wählen in Zeiten der Krise ist nicht nur ein
                Recht, sondern
                auch Verantwortung. Und Du, was bewegt Dich zum Wählen? Schreib uns Deinen Grund an
                <a>info(at)gruene-washington.de.</a> Wir
                freuen uns darauf!
            </p>
        </div>
        <div className="container topmargin-sm bottommargin-sm clearfix">
            <section className="bg-red">

                <p>Jetzt loslegen und Briefwahlunterlagen beantragen! Wir haben alle vorhandenen Online-Formulare der
                    11000 Gemeinden
                    Deutschlands in unserem Briefwahl-Tool zusammengetragen. Hier könnt ihr mit wenigen Klicks online
                    Eure
                    Briefwahl-Unterlagen anfordern:</p>
                <h3><a href="https://gruene-weltweit.de/SitePages/BriefwahlSearch.aspx">OV Washington
                        Briefwahl-Suchmaschine <svg className="right-arrowSvgMini" width="31" height="22"
                            viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z">
                            </path>
                        </svg></a></h3>

            </section>
            <div className="accordionPlus">
                <div className={`accordion__header ${activeIndex === 0 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(0)}>
                    <h2><img src="https://www.gruene-washington.de/Site%20Collection%20Images/ICONS/01.png"/>1. Weil Dich
                        Politik, die in Deutschland gemacht wird auch im Ausland
                        betrifft</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 0 ? 'is-active' : ''}`}>
                    <p>Deutsche Politik betrifft uns auch im Ausland. Viele
                        Rechte und Pflichten sind automatisch mit unserer Staatsbürgerschaft verbunden.
                        Steuergesetzgebung,
                        Sozialsysteme, Renten- und Krankenversicherung, Einwanderungs – und Einbürgerungsregelungen, die
                        Anerkennung von Bildungsabschlüssen – viele dieser Bereiche haben auch im Ausland ganz
                        praktische Auswirkungen für uns und unsere Familie. Aber auch andere Entscheidungen in
                        Deutschland
                        wirken international: Was ist die Zukunft Europas und des Euro? Was für eine deutsche Außen- und
                        Sicherheitspolitik wollen wir, wie wollen wir Entwicklungspolitik gestalten? Welche
                        Bürger*innenrechte und Datenschutzbestimmungen sind uns wichtig? Was für eine Energie- und
                        Klimapolitik wünschen wir uns und welche Regulierungen wollen wir für die internationalen
                        Finanzsysteme? Was auch immer der Politikbereich, wir haben ein großes Interesse daran, die
                        Richtung durch unsere Wahl mitzubestimmen – auch im Ausland.</p>
                </div>
                <div className={`accordion__header ${activeIndex === 1 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(1)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/02.png"/>2. Weil
                        Probleme wie der Klimaschutz nicht an Grenzen aufhören</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 1 ? 'is-active' : ''}`}>
                    <p>Wenn wir eines seit der Kindheit gelernt haben, dann das Wetter und Wolken nicht an politischen
                        Grenzen halt machen. Der Klimawandel tut dies schon gar nicht. Allerdings geht das
                        klimaschädliche Handeln Deutschlands und anderer Staaten zurzeit vor allem auf Kosten der Länder
                        im globalen Süden. Hier steht Deutschland in der Pflicht zu handeln.</p>
                </div>

                <div className={`accordion__header ${activeIndex === 2 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(2)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/03.png"/>3. Weil es
                        Dir nicht egal sein kann, wer Dich als Deutsche*r politisch
                        repräsentiert</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 2 ? 'is-active' : ''}`}>
                    <p>Das internationale Bild Deutschlands ist stark an die aktuelle Regierung gekoppelt. Um so
                        wichtiger sollte es deshalb für uns sein, dass unsere
                        Regierung uns auch angemessen repräsentiert.</p>
                </div>

                <div className={`accordion__header ${activeIndex === 3 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(3)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/04.png"/>4. Weil Du
                        Familie und Freunde in Deutschland hast</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 3 ? 'is-active' : ''}`}>
                    <p>Auch wenn wir das Gefühl haben, dass uns Politik in Deutschland im Alltag kaum betrifft, ist das
                        für unsere Familie und Freunde in Deutschland
                        anders. Du hast die Möglichkeit im Interesse Deiner Familie und Freunde dazu beizutragen, dass
                        sich Deutschland in die richtige Richtung entwickelt.</p>
                </div>

                <div className={`accordion__header ${activeIndex === 4 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(4)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/05.png"/>5. Weil Du
                        oder deine Familie vielleicht einmal nach Deutschland
                        zurückwollen</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 4 ? 'is-active' : ''}`}>
                    <p>Wir kennen es alle, manchmal müssen wir mit allen
                        Eventualitäten rechnen. Vielleicht willst Du wieder einmal nach Deutschland zurückkehren,
                        wirst dort arbeiten oder Deinen Ruhestand verbringen. Vielleicht musst Du aus gesundheitlichen
                        Gründen zurück nach Deutschland oder möchtest Dich um einen Verwandten kümmern. In allen Fällen
                        gilt: Als Auslandsdeutsche haben wir ein Interesse daran, dass wir oder unsere Familie bei der
                        Rückkehr ein Deutschland antreffen, was unseren Wünschen entspricht.</p>
                </div>

                <div className={`accordion__header ${activeIndex === 5 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(5)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/06.png"/>6. Weil
                        Deutschland eine international Perspektive braucht</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 5 ? 'is-active' : ''}`}>
                    <p>Als Auslandsdeutsche haben wir eine andere Sicht
                        auf Deutschland und sehen vieles mit anderen Augen. Was wir gut oder schlecht finden an
                        Deutschland wird uns manchmal erst aus der Ferne bewusst. In einer zunehmend vernetzten Welt,
                        ist eine
                        solche internationale Perspektive für Deutschland nicht nur wünschenswert sondern dringend
                        notwendig. Als Auslandsdeutsche können wir mit unseren ganz eigenen Erfahrungen dazu beitragen,
                        Deutschland
                        zu bereichern.</p>
                </div>

                <div className={`accordion__header ${activeIndex === 6 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(6)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/07.png"/>7. Weil das
                        Wahlrecht ein hohes, lange erkämpftes Gut ist</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 6 ? 'is-active' : ''}`}>
                    <p>Das Wahlrecht ist ein wertvolles Gut, das historisch lange erkämpft wurde. An vielen Orten auf
                        der Welt sind freie Wahlen immer noch nicht an der
                        Tagesordnung. Wir haben das Recht zu wählen, das allein sollte uns eigentlich Motivation
                        genug sein. Eine Demokratie kann nur funktionieren, wenn sich die Bürgerinnen und Bürger
                        engagieren und
                        ihre Teilhabe am politischen Prozess aktiv einfordern und wahrnehmen. Durch die Wahl können
                        wir dazu beitragen, die Demokratie in unserem Land zu stärken, ganz unabhängig davon, ob meine
                        Partei gewinnt.</p>
                </div>

                <div className={`accordion__header ${activeIndex === 7 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(7)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/08.png"/>8. Weil Du
                        am politischen Prozess teilhaben kannst.</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 8 ? 'is-active' : ''}`}>
                    <p>Auch als Auslandsdeutsche sind wir Bürgerinnen und
                        Bürger und können unserer Stimme Gehör verschaffen. Viele Deutsche im Ausland haben in ihrem
                        Gastland übrigens kein Wahlrecht – teils selbst dann, wenn sie dort schon Jahre lang leben.
                        Die Wahl
                        in Deutschland ist dann die einzige Gelegenheit, dieses zentrale Recht in Anspruch zu nehmen.
                    </p>
                </div>

                <div className={`accordion__header ${activeIndex === 8 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(8)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/09.png"/>9. Weil Du
                        gute Ideen und deine Werte unterstützen möchtest, egal wo auf der Welt</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 8 ? 'is-active' : ''}`}>
                    <p>Auch wenn Du nicht mehr in Deutschland wohnst,
                        hast Du trotzdem zu vielen Themen Deine Meinung. Die grossen Probleme der Gegenwart sind
                        international und können auch nur international gelöst werden. Du möchtest Deine Ideen und
                        Werte
                        unterstützen, egal wo auf der Welt sie vertreten werden – auch in Deutschland. Die Wahl ist
                        Deine
                        Chance dafür.</p>
                </div>

                <div className={`accordion__header ${activeIndex === 9 ? 'is-active' : ''}`} onClick={() => handleAccordionClick(9)}>
                    <h2><img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/10.png"/>10. Weil Du
                        nicht andere für Dich entscheiden lassen willst</h2>
                    <span className="accordion__toggle"></span>
                </div>
                <div className={`accordion__body ${activeIndex === 9 ? 'is-active' : ''}`}>
                    <p>Den meisten von uns ist es nicht egal, welchen
                        Gesetzen
                        sie unterworfen sind, in welche Richtung sich die Politik entwickelt oder wie Deutschland im
                        Ausland wahrgenommen wird. Nur wenn Du wählst, nimmst du an den Entscheidungsprozessen für
                        Dich und
                        Deine Familie teil.</p>
                </div>

            </div>

            <hr/>
            <p><strong>Ich kenne nicht die Kandidatinnen, Kandidaten und Programme. Wen soll ich wählen?</strong>
            </p>
            <p>Es ist leicht, die Übersicht über die deutsche Politik zu verlieren, wenn Du für mehrere Jahre im
                Ausland
                gelebt hast. Um Dich zu informieren, gibt es jedoch eine ganze Menge guter Angebote im Netz. So z.B.
                den
                <a href="http://www.bpb.de/politik/wahlen/wahl-o-mat/" target="_blank">Wahl-O-Mat der Bundeszentrale
                    für
                    politische Bildung</a> oder der <a href="http://www.bundeswahlkompass.de/"
                    target="_blank">"Bundeswahlkompass" der Universität Bamberg</a> Dort kannst Du leicht
                herausfinden,
                für welche Partei Dein Herz schlägt. Außerdem gibt es viele Zusammenfassungen der Programme, z.B.
                von <a href="http://bundestagswahl.me/wahlprogramme/" target="_blank">bundestagswahl.me</a>.
            </p>
        </div>
        <div className="section m-0 pt-3 mt-3 mb-3">
            <div className="container clearfix">
                <h4 className="mb-3 ls1 font-weight-bold font-BereitBold"> KEY DOCUMENTS:</h4>

                <div className="col-11 offset-1 justify-content-center mb-0">
                    <div className="key-documents">
                        <div className="key-documents__wrp swiper-wrapper">
                            <div className="key-documents__item swiper-slide">
                                <div className="key-documents__img">
                                    <a href="#">
                                        <img title=""
                                            src="https://gruene-weltweit.de/PublishingImages/Covers/cover_Infos%20Bundeswahlleiter%20Auslandsdeutsche%202021.jpg?RenditionID=12"/>
                                    </a>
                                </div>
                                <div className="key-documents__content">
                                    <img title="Infos Bundeswahlleiter Auslandsdeutsche 2021"
                                        src="https://www.gruene-washington.de/_layouts/15/images/icgen.gif?rev=23"/>
                                    <span className="key-documents__code ng-scope">
                                        <a target="_blank"
                                            href=" https://www.bundeswahlleiter.de/mitteilungen/bundestagswahlen/2021/20210121-formular-auslandsdeutsche.html"><span
                                                className="documentTitle">Infos Bundeswahlleiter Auslandsdeutsche 2021
                                            </span>
                                        </a>
                                    </span>

                                    <div className="key-documents__title">

                                    </div>
                                    <div className="key-documents__text">
                                        <span ng-bind-html="document.Item_x0020_Description | trustedHTML"
                                            className="ng-binding">
                                            <div className="toAlignListElmntOnPage"></div>
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
         </div>
        </section>
     </>
    );
}

export default WahlWeltweit;
