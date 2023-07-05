import * as React from "react";

const ShowClintCatogory = (Item: any) => {
    let AllMetadata = Item?.AllMetadata;
    let data: any = Item?.clintData;
    // let FilterData:any=[];
    const [FilterData, setFilterData] = React.useState<any>({})
    let AllClintCatogry = AllMetadata?.filter((elem: any) => elem.TaxType == 'Client Category');
    const rerender = React.useReducer(() => ({}), {})[1];

    const ShowCatogroy = () => {
        // data.clintItemCatogery = [];
        if (AllClintCatogry != undefined) {
            AllClintCatogry?.map((ClintCat: any) => {
               data?.ClientCategory?.map((dataCat: any) => {
                    if (ClintCat?.Title == dataCat?.Title) {
                        dataCat.Color_x0020_Tag = ClintCat?.Color_x0020_Tag
                        // data.ClientCategory.push({ dataCat });
                        // data.clintItemCatogery.push(dataCat)
                    }
                })
            })
        }
        setFilterData(data);
        // rerender();
        // setFilterData(ClintCatogery)
    }
    React.useEffect(() => {
        ShowCatogroy();
    }, []);


    return (
        <>
            {FilterData && <div>
                {FilterData?.ClientCategory?.map((elem: any, index: any) => {
                    return (
                        <>
                            {" "}
                            {index <= 1 ? <span title={elem?.Title} className="ClientCategory-Usericon" style={{ backgroundColor: elem?.Color_x0020_Tag  }}>
                                {elem?.Title?.slice(0, 2).toUpperCase()}
                            </span> : ''}
                        </>
                    );
                })}
                {
                    FilterData?.ClientCategory != null && FilterData?.ClientCategory.length > 1 && FilterData?.ClientCategory?.slice(2)?.length != 0 ? (
                        <span className="position-relative user_Member_img_suffix2 ms-1 popover__wrapper " data-bs-toggle="tooltip" data-bs-placement="auto">
                            +{FilterData?.ClientCategory?.slice(2)?.length}
                            <span className="tooltiptext popover__content p-2" style={{ minWidth: "200px" }}>
                                <div>
                                    {FilterData?.ClientCategory.slice(2).map((rcData: any, i: any) => {
                                        return (
                                            <>
                                                <span className="team_Members_Item" style={{ padding: "2px" }}>
                                                    <span title={rcData?.Title} className="ClientCategory-Usericon" style={{ backgroundColor: rcData?.Color_x0020_Tag }}>
                                                        {rcData?.Title?.slice(0, 2).toUpperCase()}
                                                    </span>
                                                    <div className="mx-2">{rcData?.Title}</div>
                                                </span>
                                            </>
                                        );
                                    })}
                                </div>
                            </span>
                        </span>
                    ) : (
                        ""
                    )
                }
            </div>}
        </>
    )
}
export default ShowClintCatogory;