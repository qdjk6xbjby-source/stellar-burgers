import { selectUser } from '@slices';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
