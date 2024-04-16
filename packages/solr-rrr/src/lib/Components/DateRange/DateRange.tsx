import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {getFilterFromState, ISolangState, setParam} from "../../store/solang.slice";
import {IDateRangeState} from "../../filters/DateRangeFilter";

interface MyProps {
  id?: string;
  appId: string;
  alias: string;
  type: 'date'|'month'|'datetime-local';
  minTo?: string;
  maxTo?: string;
  minFrom?: string;
  maxFrom?: string;
}

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @param type
 * @param minTo
 * @param maxTo
 * @param minFrom
 * @param maxFrom
 * @constructor
 */
const DateRange = ({appId, alias, type, minTo, maxTo, minFrom, maxFrom}: MyProps) => {

  const CLASS = 'solang-date-range';
  const dispatch = useDispatch();

  const filterState = useSelector((state: ISolangState) => getFilterFromState(state.solang, appId, alias)) as IDateRangeState;

  const handleFromChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    dispatch(setParam({appId: appId, key: `${alias}From`, value: value}));
  }
  const handleToChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    // setToValue(value);
    dispatch(setParam({appId: appId, key: `${alias}To`, value: value}));
  }

  const from = filterState.from;
  const to = filterState.to;

  const calcMaxFrom = (to?? '') > (maxFrom ?? '') ? maxFrom : to;
  const calcMinTo = (from ?? '') > (minTo ?? '') ? from : minTo;

  return (
    <div className={CLASS}>
      <label className={`{$CLASS}__label-from`} htmlFor={`${alias}-from`}>From</label>
      <input className={`${CLASS}__from`} id={`${alias}-from`}
             type={type} min={minFrom} max={calcMaxFrom}
             defaultValue={from}
             onChange={handleFromChange} />
      <label className={`{$CLASS}__label-to`} htmlFor={`${alias}-to`}>To</label>
      <input className={`${CLASS}__to`} id={`${alias}-to`}
             type={type} min={calcMinTo} max={maxTo}
             defaultValue={to}
             onChange={handleToChange}/>
    </div>
  );

}

export default DateRange;
