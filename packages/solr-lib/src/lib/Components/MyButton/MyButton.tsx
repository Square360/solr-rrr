import { FunctionComponent } from 'react';

interface OwnProps {
  title?: string;
}

type Props = OwnProps;

const MyButton: FunctionComponent<Props> = (props) => {

  return (
    <button>{props.title ?? 'MyButton'}</button>
  );
};

export default MyButton;
