import {ISolangApp, ISolangParamList} from "../solang.types";
import {getFilterFromApp} from "../store/solang.slice";

interface IOptionsListOption {
  key: string;
  label: string;
  value: string;
}
export interface IOptionsListState {
  config: {
    map: { [key: string]: string; };
    exclude?: string[];
  };
  activeOptions?: IOptionsListOption[];
}

export function optionsListProcessParams(app: ISolangApp, filterId: string, params: ISolangParamList) {

  const filter = getFilterFromApp(app, filterId) as IOptionsListState;
  const activeOptions: IOptionsListOption[] = [];

  Object.keys(params).forEach( key => {
    const excludeList = filter.config.exclude ?? [];
    const exclude = !(excludeList.indexOf(key) === -1);
    const label = filter.config.map[key];
    if ( !exclude && label ) {
      let values: string[];
      if (Array.isArray(params[key])) {
        values = params[key] as string[];
      }
      else {
        values = [params[key]] as string[];
      }
      values.forEach( item => {
        if (item.length) {
          activeOptions.push({
            key: key,
            label: label,
            value: item
          });
        }
      });
    }
  });
  filter.activeOptions = activeOptions;

}
