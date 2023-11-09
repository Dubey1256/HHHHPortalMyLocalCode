import * as React from 'react';
import Tooltip from '../../Tooltip';
import { Panel, PanelType } from 'office-ui-fabric-react';
import CheckboxTree from 'react-checkbox-tree';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
const TeamSmartFavorites = (items: any) => {
    const onRenderCustomHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="alignCenter subheading">
                    <span className="siteColor">Smart Favorite</span>
                    <span className="ms-3"><Tooltip ComponentId={0} /></span>
                </div>
            </div>
        );
    };

    const setModalIsOpenToFalse = () => {
        items?.selectedFilterCallBack();
    };
    return (
        <>

            <Panel
                type={PanelType.custom}
                customWidth="1300px"
                isOpen={items?.isOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeader}
                isBlocking={items?.isOpen}
            >
                <div className="modal-body p-0 mt-2 mb-3">

                    <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <span>
                                    <label className="toggler full_width active">
                                        <span className='full-width'>
                                            <div className='alignCenter'>
                                                <span className='ms-2 f-16'>Sites</span>
                                            </div>
                                        </span>
                                    </label>
                                    <div className="togglecontent mb-3 ps-3  mt-1 pt-1">
                                        <div className="col-sm-12 pad0">
                                            <div className="togglecontent">
                                                <table width="100%" className="indicator_search">
                                                    <tr className=''>
                                                        {items?.allStites != null && items?.allStites.length > 0 &&
                                                            items?.allStites?.map((Group: any, index: any) => {
                                                                return (
                                                                    <td valign="top" style={{ width: '33.3%' }}>
                                                                        <fieldset className='pe-3 smartFilterStyle'>
                                                                            <legend className='SmartFilterHead'>
                                                                                <span className="mparent d-flex" style={{ borderBottom: "1.5px solid #D9D9D9", color: items?.portfolioColor }}>
                                                                                    <input className={"form-check-input cursor-pointer"}
                                                                                        style={Group?.values?.length === Group?.checked?.length ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                        type="checkbox"
                                                                                        checked={Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                        onChange={(e) => items?.handleSelectAll(index, e.target.checked, "filterSites")}
                                                                                        ref={(input) => {
                                                                                            if (input) {
                                                                                                const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.values?.length;
                                                                                                input.indeterminate = isIndeterminate;
                                                                                                if (isIndeterminate) { input.style.backgroundColor = items?.portfolioColor; input.style.borderColor = items?.portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                                </span>
                                                                            </legend>
                                                                            <div className="custom-checkbox-tree">
                                                                                <CheckboxTree
                                                                                    nodes={Group.values}
                                                                                    checked={Group.checked}
                                                                                    expanded={items?.expanded}
                                                                                    onCheck={checked => items?.onCheck(checked, index, "filterSites")}
                                                                                    onExpand={expanded => items?.setExpanded(expanded)}
                                                                                    nativeCheckboxes={false}
                                                                                    showNodeIcon={false}
                                                                                    checkModel={'all'}
                                                                                    icons={{
                                                                                        check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.checkIcons }} />),
                                                                                        uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.checkBoxIcon }} />),
                                                                                        halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.halfCheckBoxIcons }} />),
                                                                                        expandOpen: <SlArrowDown style={{ color: `${items?.portfolioColor}` }} />,
                                                                                        expandClose: <SlArrowRight style={{ color: `${items?.portfolioColor}` }} />,
                                                                                        parentClose: null,
                                                                                        parentOpen: null,
                                                                                        leaf: null,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </fieldset>
                                                                    </td>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div >
                    </section>
                    <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full-width'>
                                        <div className='alignCenter'>
                                            <span className='ms-2 f-16'>Categories and Status</span>
                                        </div>
                                    </span>
                                </label>
                                <div className="togglecontent mb-3 ps-3 " style={{ display: "block", borderTop: "1.5px solid #D9D9D9" }}>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    {items?.filterGroupsData != null && items?.filterGroupsData.length > 0 &&
                                                        items?.filterGroupsData?.map((Group: any, index: any) => {
                                                            return (
                                                                <td valign="top" style={{ width: '14.2%' }}>
                                                                    <fieldset className='smartFilterStyle pe-3'>
                                                                        <legend className='SmartFilterHead'>
                                                                            <span className="mparent d-flex" style={{ borderBottom: "1.5px solid #D9D9D9", color: items?.portfolioColor }}>
                                                                                <input className={"form-check-input cursor-pointer"}
                                                                                    style={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                    type="checkbox"
                                                                                    checked={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                    onChange={(e) => items?.handleSelectAll(index, e.target.checked, "FilterCategoriesAndStatus")}
                                                                                    ref={(input) => {
                                                                                        if (input) {
                                                                                            const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.ValueLength;
                                                                                            input.indeterminate = isIndeterminate;
                                                                                            if (isIndeterminate) { input.style.backgroundColor = items?.portfolioColor; input.style.borderColor = items?.portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                            </span>
                                                                        </legend>
                                                                        <div className="custom-checkbox-tree">
                                                                            <CheckboxTree
                                                                                nodes={Group.values}
                                                                                checked={Group.checked}
                                                                                expanded={items?.expanded}
                                                                                onCheck={checked => items?.onCheck(checked, index, "FilterCategoriesAndStatus")}
                                                                                onExpand={expanded => items?.setExpanded(expanded)}
                                                                                nativeCheckboxes={false}
                                                                                showNodeIcon={false}
                                                                                checkModel={'all'}
                                                                                icons={{

                                                                                    // check: (<AiFillCheckSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    // uncheck: (<AiOutlineBorder style={{ height: "18px", color: "rgba(0,0,0,.29)", width: "18px" }} />),
                                                                                    // halfCheck: (<AiFillMinusSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.checkIcons }} />),
                                                                                    uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.checkBoxIcon }} />),
                                                                                    halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.halfCheckBoxIcons }} />),
                                                                                    expandOpen: <SlArrowDown style={{ color: `${items?.portfolioColor}` }} />,
                                                                                    expandClose: <SlArrowRight style={{ color: `${items?.portfolioColor}` }} />,
                                                                                    parentClose: null,
                                                                                    parentOpen: null,
                                                                                    leaf: null,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </fieldset>
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </section>

                    <section className="smartFilterSection p-0 mb-1" >
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full-width'>
                                        <div className='alignCenter'>
                                            <span className='ms-2 f-16'>Client Category</span>
                                        </div>
                                    </span>
                                </label>
                                <div className="togglecontent mb-3 ps-3  pt-1 mt-1" style={{ display: "block", borderTop: "1.5px solid" + items?.portfolioColor }}>
                                    <div className="col-sm-12">
                                        <div className="togglecontent">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    <td valign="top" className='row'>
                                                        {items?.allFilterClintCatogryData != null && items?.allFilterClintCatogryData.length > 0 &&
                                                            items?.allFilterClintCatogryData?.map((Group: any, index: any) => {
                                                                return (
                                                                    <div className='col-sm-4 mb-3 ps-0'>
                                                                        <fieldset className='smartFilterStyle ps-2'>
                                                                            <legend className='SmartFilterHead'>
                                                                                <span className="mparent d-flex" style={{ borderBottom: "1.5px solid #D9D9D9", color: items?.portfolioColor }}>
                                                                                    <input className={"form-check-input cursor-pointer"}
                                                                                        style={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                        type="checkbox"
                                                                                        checked={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                        onChange={(e) => items?.handleSelectAll(index, e.target.checked, "ClintCatogry")}
                                                                                        ref={(input) => {
                                                                                            if (input) {
                                                                                                const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.ValueLength;
                                                                                                input.indeterminate = isIndeterminate;
                                                                                                if (isIndeterminate) { input.style.backgroundColor = items?.portfolioColor; input.style.borderColor = items?.portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                                </span>
                                                                            </legend>
                                                                            <div className="custom-checkbox-tree">
                                                                                <CheckboxTree
                                                                                    nodes={Group.values}
                                                                                    checked={Group.checked}
                                                                                    expanded={items?.expanded}
                                                                                    onCheck={checked => items?.onCheck(checked, index, "ClintCatogry")}
                                                                                    onExpand={expanded => items?.setExpanded(expanded)}
                                                                                    nativeCheckboxes={false}
                                                                                    showNodeIcon={false}
                                                                                    checkModel={'all'}
                                                                                    icons={{
                                                                                        check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.checkIcons }} />),
                                                                                        uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.checkBoxIcon }} />),
                                                                                        halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: items?.halfCheckBoxIcons }} />),
                                                                                        expandOpen: <SlArrowDown style={{ color: `${items?.portfolioColor}`, height: "1em", width: "1em" }} />,
                                                                                        expandClose: <SlArrowRight style={{ color: `${items?.portfolioColor}`, height: "1em", width: "1em" }} />,
                                                                                        parentClose: null,
                                                                                        parentOpen: null,
                                                                                        leaf: null,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </fieldset>
                                                                    </div>

                                                                )
                                                            })
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                    <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full_width'>
                                        <div className='alignCenter'>
                                            <span className='ms-2 f-16'>Team Members</span>
                                        </div>
                                    </span>
                                </label>
                                <div className="togglecontent mb-3 ps-3  mt-1 pt-1">
                                    <Col className='mb-2 '>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isSelectAll" checked={items?.isSelectAll} onChange={items?.handleSelectAllChangeTeamSection} /> Select All
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isCretaedBy" checked={items?.isCreatedBy} onChange={() => items?.setIsCreatedBy(!items?.isCreatedBy)} /> Created by
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isModifiedBy" checked={items?.isModifiedby} onChange={() => items?.setIsModifiedby(!items?.isModifiedby)} /> Modified by
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isAssignedBy" checked={items?.isAssignedto} onChange={() => items?.setIsAssignedto(!items?.isAssignedto)} /> Working Member
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isTeamLead" checked={items?.isTeamLead} onChange={() => items?.setIsTeamLead(!items?.isTeamLead)} /> Team Lead
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isTeamMember" checked={items?.isTeamMember} onChange={() => items?.setIsTeamMember(!items?.isTeamMember)} /> Team Member
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isTodaysTask" checked={items?.isTodaysTask} onChange={() => items?.setIsTodaysTask(!items?.isTodaysTask)} /> Working Today
                                        </label>
                                    </Col>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent mt-1">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    <td valign="top" className='row'>
                                                        {items?.TaskUsersData != null && items?.TaskUsersData.length > 0 &&
                                                            items?.TaskUsersData?.map((Group: any, index: any) => {
                                                                return (
                                                                    <div className='col-sm-3 mb-3 ps-0'>
                                                                        <fieldset className='smartFilterStyle ps-2'>
                                                                            <legend className='SmartFilterHead'>
                                                                                <span className="mparent d-flex" style={{ borderBottom: "1.5px solid #D9D9D9", color: items?.portfolioColor }}>
                                                                                    <input className={"form-check-input cursor-pointer"}
                                                                                        style={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                        type="checkbox"
                                                                                        checked={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                        onChange={(e) => items?.handleSelectAll(index, e.target.checked, "FilterTeamMembers")}
                                                                                        ref={(input) => {
                                                                                            if (input) {
                                                                                                const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.values?.length;
                                                                                                input.indeterminate = isIndeterminate;
                                                                                                if (isIndeterminate) { input.style.backgroundColor = items?.portfolioColor; input.style.borderColor = items?.portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                                </span>
                                                                            </legend>
                                                                            <div className="custom-checkbox-tree">
                                                                                <CheckboxTree
                                                                                    nodes={Group.values}
                                                                                    checked={Group.checked}
                                                                                    expanded={items?.expanded}
                                                                                    onCheck={checked => items?.onCheck(checked, index, 'FilterTeamMembers')}
                                                                                    onExpand={expanded => items?.setExpanded(expanded)}
                                                                                    nativeCheckboxes={false}
                                                                                    showNodeIcon={false}
                                                                                    checkModel={'all'}
                                                                                    icons={{
                                                                                        check: (<div dangerouslySetInnerHTML={{ __html: items?.checkIcons }} />),
                                                                                        uncheck: (<div dangerouslySetInnerHTML={{ __html: items?.checkBoxIcon }} />),
                                                                                        halfCheck: (<div dangerouslySetInnerHTML={{ __html: items?.halfCheckBoxIcons }} />),
                                                                                        expandOpen: <SlArrowDown style={{ color: `${items?.portfolioColor}` }} />,
                                                                                        expandClose: <SlArrowRight style={{ color: `${items?.portfolioColor}` }} />,
                                                                                        parentClose: null,
                                                                                        parentOpen: null,
                                                                                        leaf: null,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </fieldset>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div >
                    </section>



                    <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className="full-width">
                                        <div className='alignCenter'>
                                            <span className='ms-2 f-16'>Date</span>
                                        </div>
                                    </span>
                                </label>
                                <div className="togglecontent mb-3 ps-3 pt-1 mt-1" style={{ display: "block", borderTop: "1.5px solid" + items?.portfolioColor }}>
                                    <div className="col-sm-12">
                                        <Col className='mb-2 mt-2'>
                                            <label className="me-3">
                                                <input className="form-check-input" type="checkbox" value="isCretaedDate" checked={items?.isCreatedDateSelected} onChange={() => items?.setIsCreatedDateSelected(!items?.isCreatedDateSelected)} />{" "}
                                                Created Date
                                            </label>
                                            <label className="me-3">
                                                <input
                                                    className="form-check-input" type="checkbox" value="isModifiedDate" checked={items?.isModifiedDateSelected} onChange={() => items?.setIsModifiedDateSelected(!items?.isModifiedDateSelected)} />{" "}
                                                Modified Date
                                            </label>
                                            <label className="me-3">
                                                <input className="form-check-input" type="checkbox" value="isDueDate" checked={items?.isDueDateSelected} onChange={() => items?.setIsDueDateSelected(!items?.isDueDateSelected)} />{" "}
                                                Due Date
                                            </label>
                                        </Col>
                                    </div>
                                </div>

                            </div>
                        </div >
                    </section>
                </div>
                <footer>
                    <button type="button" className="btn btn-default pull-right">
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary mx-1 pull-right">
                        Add SmartFavorite
                    </button>

                </footer>
            </Panel>

        </>
    )
}
export default TeamSmartFavorites;