import { useDispatch, useSelector } from "react-redux";
import { getAppFromState, getFilterFromApp, ISolangState, setParam } from "../../store/solang.slice";
import { IOptionsListState } from "../../filters/OptionsList";

interface MyProps {
  appId: string;
  alias: string;
}
const OptionsList = ({appId}: MyProps) => {

  const CLASS = 'solang-radio-options';
  const app = useSelector((state: ISolangState) => getAppFromState(state.solang, appId));
  const filterState = getFilterFromApp(app, 'options') as IOptionsListState;
  const dispatch = useDispatch();

  const cancelOption = (key:string, value:string) => {
    if (Array.isArray(app.params[key])) {
      const values = (app.params[key] as string[]).filter((v) => v !== value);
      dispatch(setParam({appId: appId, key: key, value: values}));
    }
    else {
      dispatch(setParam({appId: appId, key: key, value: ''}));
    }
  }

  return (
    <div className={CLASS}>
      <ul className={`${CLASS}__list`} aria-label="Active search filters">
        { filterState.activeOptions?.map( (option, k) => (
          <li key={k} className={`${CLASS}__list-item`}>
            <button
              className={`${CLASS}__btn`}
              aria-label={`Remove option ${option.value} from ${option.label} filter`}
              onClick={()=>cancelOption(option.key, option.value)}>
                {option.label}: {option.value}

            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default OptionsList;