import { fetchUserOrders, selectUserOrders } from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
