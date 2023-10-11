import * as React from "react";

const ShowClintCatogory = (Item: any) => {
    let AllMetadata = Item?.AllMetadata;
    let data: any = Item?.clintData;
    // let FilterData:any=[];
    const [FilterData, setFilterData] = React.useState<any>({})
    let AllClintCatogry = AllMetadata?.filter((elem: any) => elem.TaxType == 'Client Category');
    const rerender = React.useReducer(() => ({}), {})[1];


    const getParentTitles = (parentId:any, titles:any = []) => {
        const matchingParent = AllClintCatogry.find((elem: any) => elem.Id === parentId);
        if (matchingParent) {
          titles.unshift(matchingParent.Title);
          if (matchingParent.Parent != null) {
            getParentTitles(matchingParent.Parent.Id, titles);
          }
        }
        return titles;
      };


    const ShowCatogroy = () => {
        if (AllClintCatogry !== undefined) {
          data?.ClientCategory?.map((dataCat: any) => {
            const matchingItem = AllClintCatogry.find((elem: any) => elem.Id === dataCat.Id);
            if (matchingItem) {
              const titles = [];
              if (matchingItem.Parent == null) {
                titles.push(matchingItem.Title);     // No parent, push the title directly
              } else {
                const parentTitles = getParentTitles(matchingItem.Parent.Id);     // Has parent, get the parent titles recursively
                titles.push(...parentTitles, matchingItem.Title);
              }
              dataCat.Titles = titles;     // Set the titles array to the dataCat
              dataCat.Color_x0020_Tag = matchingItem.Color_x0020_Tag;
            }
          });
        }
        setFilterData(data);
      }

    React.useEffect(() => {
        ShowCatogroy();
    }, []);

    return (
        <>
        {FilterData && (
          <div className="alignCenter">
            {FilterData?.ClientCategory?.length <= 3 ? (
              FilterData?.ClientCategory?.map((elem: any, index: any) => {
                return (
                  <span key={index}>
                    {" "}
                    {index <= 2 ? <span title={elem?.Titles.join(' > ')} className="ClientCategory-Usericon" style={{ backgroundColor: elem?.Color_x0020_Tag  }}>
                              {elem?.Title?.slice(0, 2).toUpperCase()}
                          </span> : ''}
                  </span>
                );
              })
            ) : (
            <>
              {FilterData?.ClientCategory?.map((elem: any, index: any) => {
                return (
                  <span key={index}>
                    {" "}
                    {index <= 1 ? <span title={elem?.Titles.join(' > ')} className="ClientCategory-Usericon" style={{ backgroundColor: elem?.Color_x0020_Tag  }}>
                              {elem?.Title?.slice(0, 2).toUpperCase()}
                          </span> : ''}
                  </span>
                );
              })}
              {FilterData?.ClientCategory != null && FilterData?.ClientCategory?.length > 1 && FilterData?.ClientCategory?.slice(2)?.length !== 0 ? (
                  <span className="position-relative user_Member_img_suffix2 popover__wrapper " data-bs-toggle="tooltip" data-bs-placement="auto">
                    +{FilterData?.ClientCategory?.slice(2)?.length}
                    <span className="tooltiptext popover__content p-2" style={{ minWidth: "200px" }}>
                      <div>
                        {FilterData?.ClientCategory.slice(2).map((rcData: any, i: any) => {
                          return (
                            <span key={i} className="team_Members_Item" style={{ padding: "2px" }}>
                              <span title={rcData?.Titles.join(' > ')} className="ClientCategory-Usericon" style={{ backgroundColor: rcData?.Color_x0020_Tag }}>
                                {rcData?.Title?.slice(0, 2).toUpperCase()}
                              </span>
                              <div className="mx-2">{rcData?.Title}</div>
                            </span>
                          );
                        })}
                      </div>
                    </span>
                  </span>
                ) : (
                  ""
                )}
            </>
            )}
            
          </div>
        )}
      </>
    )
}
export default ShowClintCatogory;