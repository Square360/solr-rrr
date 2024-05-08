import {ChangeEvent, useId, useState} from "react";
import { useDispatch } from 'react-redux'
import { setParam} from "../../store/solang.slice";
import {
  IFacetFilterState, IFormattedFacetOption
} from "../../filters/FacetFilter";
import FacetCheckboxItem from "./FacetCheckboxItem.tsx";


interface FacetCheckboxProps {
  appId: string;
  filterState: IFacetFilterState;
  facetCounts: IFormattedFacetOption[];
  expandable?: number;
  labelMap?: { [key: string]: string; };
}

/**
 * Provides Checkbox facet filter
 * @param appId
 * @param filterState
 * @param facetCounts
 * @param expandable
 * @param labelMap  Optional map to override labels for certain values.
 * @constructor
 */
const FacetCheckbox = ({appId, filterState, facetCounts, expandable, labelMap={}}: FacetCheckboxProps) => {

  const CLASS = 'solang-facet-cb';
  const dispatch = useDispatch();
  const [_isExpanded, setExpanded] = useState(false);
  const ariaId = useId();
  const alias = filterState.config.alias;
  const options = facetCounts || [];
  const optionsCount = options?.length ?? 0;
  const valuesCount = filterState.value?.length ?? 0;
  const expandableMin = Math.max(valuesCount, (expandable ?? 0));
  const isExpandable = expandable && (optionsCount > expandableMin);

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

  const expandClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setExpanded(!_isExpanded);
  }

  // Selected items listed first.
  const sortedOptions = [...options].sort((a, b) => {
    // If a selected & b not return a
    const aIsSelected = filterState.value.includes(a.value);
    const bIsSelected = filterState.value.includes(b.value);
    if ( aIsSelected && !bIsSelected) {
      return -1
    }
    else if (!aIsSelected && bIsSelected) {
      return 1
    }
    else {
      return a.value > b.value ? 1 : -1;
    }
  });

  // Reduce options to list of renderable items.
  const sliceOptions = (options: any[]) => {
    const expandableMax = isExpandable
      ? (_isExpanded ? -1 : Math.max(expandable, expandableMin))
      : options.length;
    return options.slice(0, expandableMax);
  }

  return (
    <div className={`${CLASS}`}>
      <fieldset className={`${CLASS}__wrapper`}>
        {filterState.config.label && <legend>{filterState.config.label}</legend>}
        <ul className={`${CLASS}__list`} id={ariaId}>
          { sortedOptions && sliceOptions(sortedOptions).map( (option, index) => {

            const label = labelMap[option.value] ?? option.value;
            return (
              <FacetCheckboxItem
                key={`${appId}--${alias}--${index}`}
                baseClass={CLASS}
                alias={alias}
                checked={filterState.value.includes(option.value)}
                option={option}
                label={label}
                changeHandler={changeHandler}>
              </FacetCheckboxItem>
            );
          })}
        </ul>

        { isExpandable && (
          <button onClick={expandClickHandler}
                  aria-expanded={_isExpanded}
                  aria-controls={ariaId}>
            { _isExpanded ? "View less" : "View all" }
          </button>
        )}

      </fieldset>
    </div>

  );
};


export default FacetCheckbox;
