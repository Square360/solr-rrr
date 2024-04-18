import {IFormattedFacetOption} from "../../filters/FacetFilter.ts";
import {ChangeEvent} from "react";

interface MyProps {
  baseClass: string,
  alias: string,
  checked: boolean
  option: IFormattedFacetOption,
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Provides Checkbox facet filter
 */
const FacetCheckboxItem = ({option, baseClass, alias, checked, changeHandler}: MyProps) => {
  return (
    <li className={`${baseClass}__list-item`}>
      <label  className={`${baseClass}__label`}>
        <input
          type="checkbox"
          className={`${baseClass}__input`}
          checked={checked}
          onChange={changeHandler}
          value={option.value}
          name={alias}/>
          <span className={`${baseClass}__desc`}>
                    <span className={`${baseClass}__value`} dangerouslySetInnerHTML={{__html: option.value}}></span>
                    <span className={`${baseClass}__count`} aria-label={`${option.count} results`}>{option.count}</span>
                  </span>
      </label>
    </li>
)

}

export default FacetCheckboxItem;