import * as React from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

var myarray3: any = [];
var myarray4: any = [];
export default function Sitecomposition({ props }: any) {
  const [Active, setIsActive] = React.useState(null);
  const [datak, setdatak] = React.useState([]);
  var item = props;
  const handleOpen3 = (item: any) => {
    setIsActive((current: any) => !current);
    setIsActive(true);
    item.showk = item.showk = item.showk == true ? false : true;
    setdatak((datak) => [...datak]);
  };
  var myarray: any = [];
  var myarray1: any = [];
  var myarray2: any = [];
  if (item != null) {
    if (item.Sitestagging != null) {
      myarray.push(JSON.parse(item.Sitestagging));
    }
    if (myarray.length != 0) {
      myarray[0].map((items: any) => {
        if (items.SiteImages != undefined && items.SiteImages != "") {
          items.SiteImages = items.SiteImages.replace(
            "https://www.hochhuth-consulting.de",
            "https://hhhhteams.sharepoint.com/sites/HHHH"
          );
          myarray1.push(items);
        }
      });
    }

    if (item.ClientCategory.results.length != 0) {
      item.ClientCategory.results.map((terms: any) => {
        //     if(myarray2.length!=0 && myarray2[0].title==terms.title){
        //                ""
        //     }else{
        //    myarray2.push(terms);
        // }
        myarray2.push(terms);
      });
    }
  }
//   remove duplicates
myarray4 = myarray1.reduce(function (previous: any, current: any) {
    var alredyExists =
      previous.filter(function (item: any) {
        return item.Title === current.Title;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  }, []);

  myarray3 = myarray2.reduce(function (previous: any, current: any) {
    var alredyExists =
      previous.filter(function (item: any) {
        return item.Id === current.Id;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  }, []);
//  For sort the array
  myarray3.sort((a: any, b: any) => a.Id - b.Id);

  
  return (
    <>
      {myarray4.length != 0 && (
        <dl className="Sitecomposition">
          <div className="dropdown">
            <a
              className="sitebutton  bg-fxdark  p-0"
              title="Tap to expand the childs"
              onClick={() => handleOpen3(item)}
            >
              <span className="sign">
                {item.showk ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
              </span>{" "}
              Site Composition
            </a>

            <>
              {item.showk && (
                <div className="spxdropdown-menu">
                  <ul>
                    {myarray4.map((items: any) => (
                      <li className="dropdown-item">
                        {items.Title != "Gender" && (
                          <>
                            <span>
                              <img
                                style={{ width: "22px" }}
                                title={items.Title}
                                src={items.SiteImages}
                                data-themekey="#"
                              />
                            </span>
                            <span>
                              {/* {{item.ClienTimeDescription.substring(0,2)}}% */}
                              {/* {data.map(item =><i>{item.ClienTimeDescription.substring(0,2)}%</i>)} */}
                              {items.ClienTimeDescription != undefined && (
                                <span className="ng-binding">
                                  {/* {item.ClienTimeDescription}% */}
                                  {/* <>
                                                    {parseInt(items.ClienTimeDescription).toFixed(2)}%
                                                </> */}
                                  {items.ClienTimeDescription.length ===
                                    undefined && (
                                    <>
                                      {items.ClienTimeDescription.toFixed(2)}%
                                    </>
                                  )}
                                  {(items.ClienTimeDescription.length <= 2 ||
                                    items.ClienTimeDescription.length > 2) && (
                                    <>
                                      {parseInt(
                                        items.ClienTimeDescription
                                      ).toFixed(2)}
                                      %
                                    </>
                                  )}
                                </span>
                              )}
                            </span>
                            {items.Title == "EPS" && (
                              <span>
                                {myarray3.length != 0
                                  ? myarray3.map((client: any) => {
                                      return (
                                        <div className="Members-Item">
                                          <div className="user-Member-img">
                                            {client.Id > 340 &&
                                              client.Id < 420 && (
                                                <span>{client.Title}</span>
                                              )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  : ""}
                              </span>
                            )}
                            {items.Title == "Education" && (
                              <span>
                                {myarray3.length != 0
                                  ? myarray3.map((client: any) => {
                                      return (
                                        <div className="Members-Item">
                                          <div className="user-Member-img">
                                            {client.Id > 609 &&
                                              client.Id < 631 && (
                                                <span>{client.Title}</span>
                                              )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  : ""}
                              </span>
                            )}
                            {items.Title == "EI" && (
                              <span>
                                {myarray3.length != 0
                                  ? myarray3.map((client: any) => {
                                      return (
                                        <div className="Members-Item">
                                          <div className="user-Member-img">
                                            {client.Id > 419 &&
                                              client.Id < 435 && (
                                                <span>{client.Title}</span>
                                              )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  : ""}
                              </span>
                            )}
                            {items.Title == "Migration" && (
                              <span>
                                {myarray3.length != 0
                                  ? myarray3.map((client: any) => {
                                      return (
                                        <div className="Members-Item">
                                          <div className="user-Member-img">
                                            {client.Id > 630 &&
                                              client.Id < 640 && (
                                                <span>{client.Title}</span>
                                              )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  : ""}
                              </span>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          </div>
        </dl>
      )}
    </>
  );
}

// Sitestagging is the important property that we need ,
// Please if you use , than pass the siteTagging property
