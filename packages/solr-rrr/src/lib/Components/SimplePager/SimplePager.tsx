import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {getAppFromState, getFilterFromState, ISolangState, setParam} from "../../store/solang.slice";
import { getCountFromResponse } from "../../filters/SimplePager";

interface MyProps {
  appId: string;
  alias: string;
  next?: string;
  prev?: string;
  handleClick?: (arg0: React.MouseEvent<Element, MouseEvent>) => void;
}

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @param next
 * @param prev
 * @param handleClick Optional function to trigger on click
 * @constructor
 */
const SimplePager = ({appId, alias, next='Next', prev='Previous', handleClick}: MyProps) => {

  const CLASS = 'solang-pager';
  const dispatch = useDispatch();

  const filterState = useSelector((state: ISolangState) => getFilterFromState(state.solang, appId, alias));
  const numFound = useSelector((state: ISolangState) => getCountFromResponse(state.solang, appId));

  const defaultValue = useSelector((state: ISolangState) => getAppFromState(state.solang, appId).params['alias']) ?? 0;
  const currentPage = filterState.value || defaultValue;
  const numPages = Math.ceil(numFound / filterState.config.rows);

  const isEnd = currentPage >= (numPages-1);
  const isStart = currentPage <= 0;

  const nextHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
    const newPage = (currentPage < numPages) ? parseInt(currentPage) + 1 : numPages;
    const val = newPage.toString();
    dispatch(setParam({appId: appId, key: alias, value: val}));
    if (handleClick) {
      handleClick(e);
    }
  }

  const prevHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
    const newPage = (currentPage > 0) ? currentPage-1 : 0;
    const val = newPage.toString() ;
    dispatch(setParam({appId: appId, key: alias, value: val}));
    if (handleClick) {
      handleClick(e);
    }
  }

  return (
    <div className={CLASS}>

      <button disabled={isStart} className={`${CLASS}__prev`} onClick={prevHandler}>{prev}</button>
      <button disabled={isEnd} className={`${CLASS}__next`} onClick={nextHandler}>{next}</button>

    </div>

  );

}

export default SimplePager;
