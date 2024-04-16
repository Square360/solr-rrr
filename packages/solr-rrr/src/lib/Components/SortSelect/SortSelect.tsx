import { useDispatch, useSelector } from "react-redux";
import {getAppFromState, getFilterFromState, ISolangState, setParam} from "../../store/solang.slice";
import { ISortState } from "../../filters/Sort";
import { ChangeEvent } from "react";

interface MyProps {
  id?: string;
  appId: string
  alias: string
  next?: string;
  prev?: string;
}

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SortSelect = ({appId, alias, id}: MyProps) => {

  const CLASS = 'solang-sort-select';
  const dispatch = useDispatch();
  const filterState = useSelector((state: ISolangState) => getFilterFromState(state.solang, appId, alias)) as ISortState;
  const defaultValue = useSelector((state: ISolangState) => getAppFromState(state.solang, appId).params[alias]);

  const updateHandler = (e: ChangeEvent) => {
    const el = e.currentTarget as HTMLSelectElement;
    dispatch(setParam({appId: appId, key: alias, value: el.value}));
  }

  return (
    <div className={CLASS}>
      <select id={id} className={`${CLASS}__input`} value={defaultValue} onChange={updateHandler}>
        { filterState.config.options.map(item => (
            <option key={item.value} value={item.value} className={`${CLASS}__option`}>{item.label}</option>
        ))}
      </select>
    </div>

  );

};

export default SortSelect;
