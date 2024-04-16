import { useDispatch, useSelector } from "react-redux";
import {getAppFromState, getFilterFromState, ISolangState, setParam} from "../../store/solang.slice";
import { ISortState } from "../../filters/Sort";
import { ChangeEvent } from "react";

interface MyProps {
  appId: string;
  alias: string;
  inputName: string;
}

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SortRadio = ({appId, alias, inputName}: MyProps) => {

  const CLASS = 'solang-radio-options';
  const dispatch = useDispatch();
  const filterState = useSelector((state: ISolangState) => getFilterFromState(state.solang, appId, alias)) as ISortState;
  const defaultValue = useSelector((state: ISolangState) => getAppFromState(state.solang, appId).params[alias]);

  const updateHandler = (e: ChangeEvent) => {
    const el = e.currentTarget as HTMLSelectElement;
    dispatch(setParam({appId: appId, key: alias, value: el.value}));
  }

  return (
    <div className={CLASS}>
        { filterState.config.options.map((item, index) => (
            <span key={item.value} className={`${CLASS}__item`}>
              <label htmlFor={`${inputName}--${index}`} className={`${CLASS}__label`}>{item.label}</label>
              <input
                  type="radio"
                  id={`${inputName}--${index}`}
                  key={item.value}
                  value={item.value}
                  className={`${CLASS}__input`}
                  name={inputName}
                  checked={defaultValue === item.value}
                  onChange={updateHandler}
              ></input>
            </span>
        ))}
    </div>

  );

};

export default SortRadio;
