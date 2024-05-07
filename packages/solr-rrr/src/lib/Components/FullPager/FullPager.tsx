import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {getAppFromState, getFilterFromState, ISolangState, setParam} from "../../store/solang.slice";
import { getCountFromResponse } from "../../filters/SimplePager";

interface MyProps {
  appId: string;
  alias: string;
  text?: {
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  }
  handleClick?: (arg0: React.MouseEvent<Element, MouseEvent>) => void;
}

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @param text
 * @param handleClick Optional function to trigger on click (eg for scroll)
 * @constructor
 */
const FullPager = ({appId, alias, text={}, handleClick}: MyProps) => {

  const CLASS = 'solang-pager';
  const dispatch = useDispatch();

  const filterState = useSelector((state: ISolangState) => getFilterFromState(state.solang, appId, alias));
  const numFound = useSelector((state: ISolangState) => getCountFromResponse(state.solang, appId));

  const defaultValue = useSelector((state: ISolangState) => getAppFromState(state.solang, appId).params['alias']) ?? 0;

  const currentPageValue = filterState.value || defaultValue;
  const currentPage = currentPageValue + 1;

  const numPages = Math.ceil(numFound / filterState.config.rows);

  const pagerSize = 2;
  let pagerFrom: number;
  let pagerTo: number;
  const pages = [];

  let beforeNum =
    (pagerSize > numPages - currentPage ) ?
      pagerSize + pagerSize - (numPages - currentPage) :
      pagerSize;

  let afterNum  = ( pagerSize > (currentPage - 1) )
    ? pagerSize + (pagerSize - currentPage + 1)
    : pagerSize;

  beforeNum = currentPage - beforeNum;
  afterNum = currentPage + afterNum;

  pagerFrom = beforeNum < 1 ? 1 : beforeNum;
  pagerTo = afterNum > numPages ? numPages : afterNum;

  for ( let i = pagerFrom; i <= pagerTo;  i++ ) {
    pages.push(i);
  }

  const showStart = pagerFrom > 1; //currentPage <= 0;
  const showPrev = currentPage > 1;
  const showNext = currentPage < numPages;
  const showEnd = pagerTo < numPages; // currentPage >= (numPages-1);

  const setPageHandler = (e: React.MouseEvent<Element, MouseEvent>, page: number) => {
    e.preventDefault();
    console.log(page);
    if (page < 1 ) page = 1;
    if (page > numPages ) page = numPages;
    const val = (page-1).toString() ;
    dispatch(setParam({appId: appId, key: alias, value: val }));
    if (handleClick) {
      handleClick(e);
    }
  }

  return (
    <div className={CLASS}>

      { showStart && (
        <button className={`${CLASS}__first`} onClick={(e)=>setPageHandler(e, 1)}>{text.first ?? 'First'}</button>
      )}
      { showPrev && (
        <button className={`${CLASS}__prev`} onClick={(e)=>setPageHandler(e, currentPage-1)}>{text.prev ?? 'Previous'}</button>
      )}

      { pages.map((pageNum,) => (
        <button className={`${CLASS}__page` + (currentPage == pageNum ? ` ${CLASS}__page-active` : '')}
                disabled={currentPage == pageNum}
                onClick={(e)=>setPageHandler(e, pageNum)}>{pageNum}</button>
      ))}

      { showNext && (
        <button className={`${CLASS}__next`} onClick={(e)=>setPageHandler(e, currentPage+1)}>{text.next ?? 'Next'}</button>
      )}
      { showEnd && (
        <button className={`${CLASS}__last`} onClick={(e)=>setPageHandler(e, numPages)}>{text.last ?? 'Last'}</button>
      )}

    </div>

  );

}

export default FullPager;
