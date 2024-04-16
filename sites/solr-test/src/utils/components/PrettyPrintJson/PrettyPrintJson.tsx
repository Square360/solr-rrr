import * as React from "react"
import './PrettyPrintJson.scss';

const PrettyPrintJson = (props: any) => {
    return (
        <div className={'PrettyPrintJson'}>
          {props.data && (
            <pre>{ JSON.stringify(props.data, null, 2) }</pre>
          )}
        </div>
  );
}

export default PrettyPrintJson;
