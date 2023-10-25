import ScrollAnimation from 'react-animate-on-scroll';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Web, sp } from 'sp-pnp-js';
import SliderComponent from './SliderComponent';
import { Link } from 'office-ui-fabric-react';
// import "./css/fonts.css"
import 'animate.css';
import './App.css';
import "./css/style.css"
import "./css/bootstrap.css"
// import "./css/font-icons.css"
import "./css/animate.css"
import "./css/custom.css"
import "./css/owl.carousel.min.css"
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import OwlCarousel from 'react-owl-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';


const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#000',
};

const logoStyles = {
    width: '100px',
};

const navStyles = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
};

const linkStyles = {
    textDecoration: 'none',
    color: '#000',
    marginRight: '20px',
};
const divStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100px',
    zIndex: '1',
    backgroundImage: 'url("your-image-url.jpg")',
    backgroundRepeat: 'no-repeat',
    transform: 'translateX(0)',
};
const customStyles = `
/* Add your CSS styles here */
.owl-carousel {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
}

.owl-stage {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.carousel-nav a {
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid #ccc;
  color: #333;
  margin-right: 10px;
  transition: all 0.3s;
}

.carousel-nav a.active {
  background-color: #007bff;
  color: #fff;
  border: 1px solid #007bff;
}

.media-29101 {
  flex: 0 0 auto;
  max-width: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
}

.media-29101 h4 {
  font-size: 20px;
  color: #333;
}

.media-29101 p {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}

.media-29101 img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
}
`;

export default function HomeDefaultPage(props: any) {
    const [HomeContentCollection, setHomeContentCollection] = useState([]);
    const [homeArray, setHomeArray] = useState([]);
    const [howWeWorkArray, setHowWeWorkArray] = useState([]);
    const [whatWeOfferArray, setWhatWeOfferArray] = useState([]);
    const [whoWeAreArray, setWhoWeAreArray] = useState([]);
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/');
    const waveimage = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/wave2.png"



    const [scrollClass, setScrollClass] = useState('');

    useEffect(() => {
        // $(function () {
		// 	var owl = $('.owl-1');
		// 	owl.owlCarousel({
		// 		loop: false,
		// 		rewind: true,
		// 		margin: 0,
		// 		nav: true,
		// 		dots: false,
		// 		items: 1,
		// 		smartSpeed: 1000,
		// 		autoplay: false,
		// 		navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>']
		// 	});

		// 	var carousel_nav_a = $('.carousel-nav a');

		// 	carousel_nav_a.each(function (slide_index) {
		// 		var $this = $(this);
		// 		$this.attr('data-num', slide_index);
		// 		$this.click(function (e) {
		// 			owl.trigger('to.owl.carousel', [slide_index, 1500]);
		// 			e.preventDefault();
		// 		})
		// 	})

		// 	owl.on('changed.owl.carousel', function (event) {
		// 		carousel_nav_a.removeClass('active');
		// 		$(".carousel-nav a[data-num=" + event.item.index + "]").addClass('active');
		// 	})


		// })
        const handleScroll = () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercentage >= 4) {
                setScrollClass('sticky-header-shrink');
            } else {
                setScrollClass('');
            }
        };

        // Add a scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    useEffect(() => {
        loadHomeContentItems()
    }, []);
    const loadHomeContentItems = () => {
        const listName = 'Home Content';
        const columns = `Id,Title,Description,ItemType, ShortDescription,OtherDescription, Parent/Id, Parent/Title, DesignTemplate, SortOrder, Item_x0020_Cover, ClassName, SubDetails, Modified, Created, Author/Name,Author/Title,Editor/Name,Editor/Title, href, DisplayWidth, IsShowMore`;
        web.lists.getByTitle(listName).items.select(columns).expand("Author,Editor,Parent").getAll().then((data) => {
            let allHomeContent = data
            allHomeContent = data.map((item: any) => {
                item.Id = item.ID;
                item.SortOrder = parseInt(item.SortOrder);
                item.Created = item.Created;
                item.Modified = item.Modified;
                getChilds(item, allHomeContent);
                return item;
            });

            setHomeContentCollection(allHomeContent);
        })
            .catch((error) => {
                console.error(error);
            });
    }
    const getChilds = (item: any, items: any[]) => {
        item.childs = [];
        items.forEach((childItem: any) => {
            if (childItem.Parent != undefined && childItem.Parent.Id != undefined) {
                const ChildParentID = childItem.Parent.Id;
                if (ChildParentID === item.ID) {
                    if (childItem.Item_x0020_Cover) {
                        childItem.Item_x0020_Cover = childItem.Item_x0020_Cover.Url;
                    }
                    item.childs.push(childItem);
                }
            }
        });
    };
    const options = {
        loop: false,
        rewind: true,
        margin: 0,
        nav: true,
        dots: false,
        items: 1,
        smartSpeed: 1000,
        autoplay: false,
        navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>',
        ],

    }
    return (
        <body className="stretched">
            {/* Document Wrapper=============================================  */}
            <div id="wrapper" className="clearfix">
                {/* <!-- Header============================================= --> */}
                <header id="header" className={`full-header transparent-header sticky-header page-section ${scrollClass}`}>
                    <div id="header-wrap">
                        <div className="container">
                            <div className="header-row">
                                {/* <!-- Logo============================================= --> */}
                                <div id="logo">
                                    <a href="index.html" className="standard-logo" data-dark-logo="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/logo_image.png">
                                        <img
                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/logo@2x.png" alt="Logo" /></a>
                                    <a href="index.html" className="retina-logo" data-dark-logo="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/logo_image.png">
                                        <img
                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/logo.png" alt="Logo" /></a>
                                </div>
                                {/* <!-- #logo end --> */}
                                <div className="header-misc">
                                    {/* <!-- Top Search============================================= --> */}
                                    <div id="top-search" className="d-none header-misc-icon">
                                        <a href="#" id="top-search-trigger"><i className="icon-line-search"></i><i
                                            className="icon-line-cross"></i></a>
                                    </div>
                                    {/* <!-- #top-search end --> */}

                                    {/* <!-- LOG IN============================================= --> */}
                                    <div className="top-links d-none header-misc-icon logged-user ">
                                        <a className="login-text hreflink ng-scope"><i className="icon-user-circle1"></i>Sign
                                            In</a>
                                    </div>

                                </div>

                                <div id="primary-menu-trigger">
                                    <svg className="svg-trigger" viewBox="0 0 100 100">
                                        <path
                                            d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20">
                                        </path>
                                        <path d="m 30,50 h 40"></path>
                                        <path
                                            d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20">
                                        </path>
                                    </svg>
                                </div>

                                {/* <!-- Primary Navigation============================================= --> */}
                                <nav className="primary-menu">

                                    <ul className="menu-container one-page-menu" data-easing="easeInOutExpo" data-speed="1500">
                                        <li className="menu-item current"><a className="menu-link" href="index.html#"
                                            data-href="#header">
                                            <div>Home</div>
                                        </a></li>

                                        <li className="menu-item"><a className="menu-link" href="#" data-href="#section-whatweoffer">
                                            <div>What we offer</div>
                                        </a></li>
                                        <li className="menu-item"><a className="menu-link" href="#" data-href="#section-howwework">
                                            <div>How we work</div>
                                        </a></li>
                                        <li className="menu-item"><a className="menu-link" href="#" data-href="#section-whoweare">
                                            <div>Who we are</div>
                                        </a></li>
                                        <li className="menu-item"><a className="menu-link" href="#" data-href="#section-contact">
                                            <div>Contact</div>
                                        </a></li>
                                        <li className="menu-item"><a className="menu-link" href="career.html">
                                            <div>Careers</div>
                                        </a></li>
                                    </ul>

                                </nav>
                                {/* <!-- #primary-menu end --><!-- #primary-menu end --> */}

                                <form className="top-search-form" action="search.html" method="get">
                                    <input type="text" name="q" className="form-control" placeholder="Type &amp; Hit Enter.."
                                        autoComplete="off" />
                                </form>

                            </div>
                        </div>
                    </div>
                    <div className="header-wrap-clone"></div>
                </header>
                {/* <!-- #header end --> */}


                <section id="slider" className="slider-element min-vh-100 dark include-header mainpage">
                    <div className="slider-inner">
                        <div className="container">
                            <div className="slider-caption slider-caption-center">
                                {/* <h2 data-animate="fadeInDown">Hochhuth Consulting GmbH</h2> */}
                                <h2 className="animate__animated animate__fadeInDown">Hochhuth Consulting GmbH</h2>
                                {/* <p class="" data-animate="fadeInUp" data-delay="100">Making
                                SDGs work - Smart Digital Governance Solutions</p> */}
                                <p className="animate__animated animate__fadeInUp animate__delay-1s" >
                                    Making SDGs work - Smart Digital Governance Solutions
                                </p>
                            </div>
                        </div>
                        <div className="bg-overlay-bg op-05"></div>
                    </div>
                </section>

                {/* <!-- Page Sub Menu============================================= --> */}
                <div id="page-menu" className="dots-menu dots-menu-border">
                    <div id="page-menu-wrap">
                        <div className="container">
                            <div className="page-menu-row">
                                {/* <!-- <div class="page-menu-title">Explore <span>Foundation</span></div> --> */}
                                <nav className="page-menu-nav">
                                    <ul className="page-menu-container one-page-menu" data-offset="0">
                                        <li className="page-menu-item"><a href="#" data-href="#header">
                                            <div>Home</div>
                                        </a></li>
                                        <li className="page-menu-item"><a href="#" data-href="#section-whatweoffer">
                                            <div>What
                                                we offer</div>
                                        </a></li>
                                        <li className="page-menu-item"><a href="#" data-href="#section-ourPhilosophy">
                                            <div>Our Philosophy</div>
                                        </a></li>
                                        <li className="page-menu-item"><a href="#" data-href="#section-howwework">
                                            <div>How
                                                we work</div>
                                        </a></li>
                                        <li className="page-menu-item"><a href="#" data-href="#section-whoweare">
                                            <div>Who we are</div>
                                        </a></li>
                                        <li className="page-menu-item"><a href="#" data-href="#section-contact">
                                            <div>Contact</div>
                                        </a></li>
                                    </ul>
                                </nav>

                                <div id="page-menu-trigger"><i className="icon-reorder"></i></div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- #page-menu end --> */}

                {/* <!-- Content============================================= --> */}
                <section id="content">
                    {/* <!-- Wave Shape Divider============================================= --> */}
                    <div className="wave-bottom"
                        style={divStyle}>
                    </div>

                    <div className="content-wrap py-0">
                        <div className="promo promo-light promo-full p-5">
                            <div className="container clearfix">
                                <div className="row align-items-center">
                                    <div className="col-12 col-lg-12 text-center text-uppercase">
                                        <h1>We are <span>Hiring</span>! Join our team!</h1>
                                    </div>
                                    <div className="col-12 col-lg-12 text-center mt-3">
                                        <div>
                                            <a
                                                className="animate__animated animate__fadeInUp button button-border button-rounded button-fill fill-from-right button-blue m-0"
                                                href="career.html#section-positions"
                                            >
                                                <span>EXPLORE VACANCIES</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <section id="section-whatweoffer" className="page-section section bg-transparent">
                            <div className="vertical-middle">
                                {HomeContentCollection && HomeContentCollection.map((item: any) => {
                                    // <span>What we offer</span>
                                    if (item.Id == 77) {
                                        return (
                                            <div className="container clearfix">
                                                <div className="heading-block center">
                                                    <h2>{item.Title}</h2>
                                                    <span>We provide a wide range of Flexible & Useful Services.</span>
                                                </div>
                                                <div className="row">
                                                    {item.childs && item.childs.map((child: any, index: any) => {
                                                        return (
                                                            <div className="col-sm-6 col-lg-4" key={child.Id}>
                                                                <div>
                                                                    <div className="feature-box fbox-plain animate__animated animate__fadeIn">
                                                                        <div className="fbox-icon">
                                                                            <span className="fbox-text">0{index + 1}</span>
                                                                        </div>
                                                                        <div className="fbox-content">
                                                                            <h3>
                                                                                <a target="_blank">{child.Title}</a>
                                                                            </h3>
                                                                            <p dangerouslySetInnerHTML={{ __html: child.OtherDescription }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                        )
                                    }
                                })}

                            </div>
                        </section>
                        <section id="section-ourPhilosophy" className="page-section section bg-transparent m-0">
                            {HomeContentCollection && HomeContentCollection.map((item: any) => {
                                if (item.Id == 61) {
                                    return (
                                        <div className="container clearfix">
                                            <div className="heading-block center">
                                                <h2>{item.Title}</h2>
                                                <span>Introducing our work philosophy:<br />
                                                    client-focused, agile, and holistic digital solutions</span>
                                            </div>
                                            <div className="row justify-content-center mb-0">
                                                <div className="col-md-8 bottommargin">
                                                    <div className="border-bottom-0 text-justify bottommargin">
                                                        <p dangerouslySetInnerHTML={{ __html: item.OtherDescription }} />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                }
                            })}
                        </section>
                        {/* <section id="section-howwework" className="page-section section bg-transparent m-0">
                            {HomeContentCollection && HomeContentCollection.map((item: any) => {
                                if (item.Id == 78) {
                                    return (
                                        <div className="vertical-middle">
                                            <div className="container clearfix">
                                                <div className="heading-block center">
                                                    <h2>{item.Title}</h2>
                                                    <span>Our approach: adapting to target groups, working with different topics,<br />
                                                        implementing agile development and using technology</span>
                                                </div>

                                                <div className="row align-items-center">
                                                    <div className="col-lg-12">
                                                        <div className="owl-carousel owl-1">
                                                            {item.childs && item.childs.map((child: any, index: any) => {
                                                                return (
                                                                    <div className="media-29101 d-md-flex w-100">
                                                                        <div className="row align-items-center">
                                                                            <div className="col-lg-7 col-sm-7">
                                                                                <div className="heading-block">
                                                                                    <h4>{child.Title}</h4>
                                                                                </div>
                                                                                <p dangerouslySetInnerHTML={{ __html: item.OtherDescription }} />
                                                                            </div>
                                                                            <div className="col-lg-4 col-sm-5">
                                                                                <img src={child.Item_x0020_Cover} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="d-flex row justify-content-between carousel-nav">
                                                            <a className="col-lg-3 col-md-4 mt-2 active">
                                                                <div className="Slider-text">
                                                                    <div className="Sliderbox-text">01</div>
                                                                    <h3>TARGET <br /> GROUPS</h3>
                                                                </div>
                                                            </a>
                                                            <a className="col-lg-3 col-md-4 mt-2">
                                                                <div className="Slider-text">
                                                                    <div className="Sliderbox-text">02</div>
                                                                    <h3>TOPICS <br /> AND REGIONS</h3>
                                                                </div>
                                                            </a>
                                                            <a className="col-lg-3 col-md-4 mt-2">
                                                                <div className="Slider-text">
                                                                    <div className="Sliderbox-text">03</div>
                                                                    <h3>AGILE DEVELOPMENT <br /> APPROACH</h3>
                                                                </div>
                                                            </a>
                                                            <a className="col-lg-3 col-md-4 mt-2">
                                                                <div className="Slider-text">
                                                                    <div className="Sliderbox-text">04</div>
                                                                    <h3>SharePoint <br /> Solutions</h3>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                        </div>
                                    )
                                }
                            })}
                        </section> */}
                        <section id="section-howwework" className="page-section section bg-transparent m-0">
                            {/* Your existing React code */}
                            {HomeContentCollection && HomeContentCollection.map((item: any) => {
                                if (item.Id === 78) {
                                    return (
                                        <div className="vertical-middle" key={item.Id}>
                                            <div className="container clearfix">
                                                <div className="heading-block center">
                                                    <h2>{item.Title}</h2>
                                                    <span>Our approach: adapting to target groups, working with different topics,<br />
                                                        implementing agile development and using technology</span>
                                                </div>
                                                <OwlCarousel className="owl-theme" {...options}>
                                                    {item.childs
                                                        .filter((child: any) => child.Id !== 61) // Filter out items with Id equal to 61
                                                        .map((child: any, index: any) => (
                                                            <div key={index} className="media-29101 d-md-flex w-100">
                                                                <div className="row align-items-center">
                                                                    <div className="col-lg-7 col-sm-7">
                                                                        <div className="heading-block">
                                                                            <h4>{child.Title}</h4>
                                                                        </div>
                                                                        <p dangerouslySetInnerHTML={{ __html: child.Description }} />
                                                                    </div>
                                                                    <div className="col-lg-4 col-sm-5">
                                                                        <img src={child.Item_x0020_Cover} alt={child.Title} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </OwlCarousel>
                                                <div className="d-flex row justify-content-between carousel-nav">
                                                    {item.childs
                                                        .filter((child: any) => child.Id !== 61)
                                                        .map((child: any, index: any) => (
                                                            <a href={`#section-${index}`} className={`col-lg-3 col-md-4 mt-2 ${index === 0 ? 'active' : ''}`} key={index}>
                                                                <div className="Slider-text">
                                                                    <div className="Sliderbox-text">0{index + 1}</div>
                                                                    <h3>{child.Title}</h3>
                                                                </div>
                                                            </a>
                                                        ))
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </section>
                        <section id="section-whoweare" className="page-section section bg-transparent m-0">
                            {HomeContentCollection && HomeContentCollection.map((item: any) => {
                                if (item.Id == 76) {
                                    return (
                                        <div className="container clearfix">
                                            <div className="heading-block center">
                                                <h2>{item.Title}</h2>
                                                <span>Everything you need to know about us</span>
                                            </div>
                                            <div className="row justify-content-center mb-0">
                                                <div className="col-md-8 bottommargin">
                                                    <div className="border-bottom-0 text-justify bottommargin">
                                                        <p dangerouslySetInnerHTML={{ __html: item.OtherDescription }} />
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 topmargin pl-0 pr-0 pt-4">
                                                        <div className="founder-box">
                                                            <div className="founder-upper-box text-center">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/stefan.png" alt="founder-img" />
                                                            </div>
                                                            <div className="founder-description">
                                                                <h3 className="founder-title">Stefan Hochhuth</h3>
                                                                <p className="founder-subtitle">Founder at Hochhuth Consulting GmbH</p>
                                                                <div className="d-flex justify-content-center social-icons">
                                                                    <a href="https://www.linkedin.com/in/stefan-hochhuth-8678b37/"
                                                                        className="social-icon si-small si-borderless si-linkedin">
                                                                        <i className="icon-linkedin"></i>
                                                                        <i className="icon-linkedin"></i>
                                                                    </a>
                                                                    <a href="mailto:stefan.hochhuth@hochhuth-consulting.de"
                                                                        className="social-icon si-small si-borderless si-email3">
                                                                        <i className="icon-email3"></i>
                                                                        <i className="icon-email3"></i>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <p className="founder-desc-text">Stefan is an economist by trade, holding master's
                                                                degrees in both Economics and Social/Political Sciences. He has a particular
                                                                interest in topics related to digital governance, political economy, and
                                                                economic policy. With over 20 years of experience in international
                                                                development cooperation, he has worked for various institutions, including
                                                                GIZ, SDC, and the World Bank. Recognizing the potential of digitalization
                                                                for poverty reduction, he bridges the gap between development
                                                                economics/governance and digital solutions knowledge.</p>
                                                            <div className="">
                                                                <div className="text-end founder-check-position-btn">
                                                                    <div className="card-box-actionBtn">
                                                                        <a href="career.html#section-team" className="button button-border button-rounded button-fill fill-from-right button-blue"><span>Meet the Team</span></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                }
                            })}
                        </section>
                        <section id="section-contact" className="page-section section bg-transparent m-0">
                            <div className="container clearfix">
                                <div className="heading-block center">
                                    <h2>Contact</h2>
                                    <span>You have an interesting project in mind, want to enquire about our services or simply
                                        want to say hi? We always welcome your outreach! Simply send us a mail to <a
                                            href="mailto:info@hochhuth-consulting.de">info@hochhuth-consulting.de</a></span>
                                    <a href="mailto:info@hochhuth-consulting.de" className="mt-4 button button-border button-rounded button-fill fill-from-right button-blue"><span>Contact</span></a>

                                </div>
                            </div>
                        </section>
                    </div>
                </section>
                {/* <!-- #content end --> */}
                {/* <!-- Footer============================================= --> */}
                <footer id="footer">
                    {/* <!-- Copyrights============================================= --> */}
                    <div id="copyrights">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-4 text-center text-md-left">
                                    <address className="mb-0">
                                        <strong>Hochhuth Consulting GmbH</strong><br />
                                        Christinenstr 16<br />
                                        10119 Berlin, Germany
                                    </address>
                                </div>
                                <div className="col-md-4 text-center text-md-left">
                                    <div className="divider divider-center">
                                        <div className="social-icon-box">
                                            <a href="https://www.facebook.com/Hochhuth-Consulting-GmbH-100420612079192/"
                                                className="rounded-circle si-borderless si-facebook si-small social-icon">
                                                <i className="icon-facebook"></i>
                                                <i className="icon-facebook"></i>
                                            </a>
                                            <a href="#" className="social-icon si-small si-borderless si-linkedin">
                                                <i className="icon-linkedin"></i>
                                                <i className="icon-linkedin"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 text-center text-md-right">
                                    <p><a href="mailto:info@hochhuth-consulting.de"><i className="icon-envelope"></i>info@hochhuth-consulting.de</a></p>
                                    <div className="clear"></div>
                                    <p className="mb-0"><a href="tel:+4930868706600"><i className="icon-phone"></i>+49 (30) 868706600</a></p>
                                </div>
                            </div>
                            <div className="clear"></div>
                            <div className="row mt-5">
                                <div className="col-md-4 copyright-links justify-content-md-start">
                                    <a href="PrivacyPolicy.html">Privacy Policy</a> / <a href="Impress.html">Impress</a>
                                </div>
                                <div className="col-md-4 d-flex justify-content-center">
                                    © 2023 by Hochhuth Consulting GmbH
                                </div>

                            </div>

                        </div>
                    </div>
                    {/* <!-- #copyrights end --> */}

                </footer>
                {/* <!-- #footer end --> */}
            </div>
            {/* wrapper end */}

            {/* <!-- Go To Top============================================= --> */}
            <div id="gotoTop" className="icon-angle-up"></div>

        </body>

    );
};