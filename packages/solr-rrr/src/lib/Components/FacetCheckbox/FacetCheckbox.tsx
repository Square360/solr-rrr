import { ChangeEvent } from "react";
import { useDispatch } from 'react-redux'
import { setParam} from "../../store/solang.slice";
import {
  IFacetFilterState, IFormattedFacetOption
} from "../../filters/FacetFilter";

// import './FacetCheckbox.scss';

interface MyProps {
  appId: string,
  filterState: IFacetFilterState,
  facetCounts: IFormattedFacetOption[],
}

/**
 * Provides Checkbox facet filter
 * @param appId
 * @param filterState
 * @param facetCounts
 * @constructor
 */
const FacetCheckbox = ({appId, filterState, facetCounts}: MyProps) => {

  const CLASS = 'solang-facet-cb';
  const dispatch = useDispatch();
  const alias = filterState.config.alias;

  const options = facetCounts || [];

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {

    let newState = [...filterState.value];
    let value = e.target.value;

    if (e.target.checked && !newState.includes(value)) {
      newState.push(value);
      dispatch(setParam({appId: appId, key: alias, value: newState}));
    }
    else if (!e.target.checked && newState.includes(value)) {
      dispatch(setParam({appId: appId, key: alias, value: newState.filter(v => v !== value)}));
    }
  }


  return (
    <div className={`${CLASS}`}>
      <fieldset className={`${CLASS}__wrapper`}>
        {filterState.config.label && <legend>{filterState.config.label}</legend>}

        <ul className={`${CLASS}__list`}>
          { options && options.map( (option, index) => (
            <li className={`${CLASS}__list-item`} key={`${appId}--${alias}--${index}`}>
              <label  className={`${CLASS}__label`}>
                <input
                  type="checkbox"
                  className={`${CLASS}__input`}
                  checked={filterState.value.includes(option.value)}
                  onChange={changeHandler}
                  value={option.value}
                  name={alias}/>
                <span className={`${CLASS}__desc`}>
                  <span className={`${CLASS}__value`} dangerouslySetInnerHTML={{__html: option.value}}></span>
                  <span className={`${CLASS}__count`} aria-label={`${option.count} results`}>{option.count}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>

      </fieldset>
    </div>

  );
};


export default FacetCheckbox;
