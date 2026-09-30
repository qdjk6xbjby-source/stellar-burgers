import {
  fetchOrderByNumber,
  selectFeedOrders,
  selectIngredients,
  selectOrderByNumber,
  selectUserOrders,
} from '@slices';
import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { AppDispatch } from '@services/store';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const orderByNumber = useSelector(selectOrderByNumber);

  const orderNum = Number(number);

  const orderData = useMemo(
    () =>
      feedOrders.find((order) => order.number === orderNum) ??
      userOrders.find((order) => order.number === orderNum) ??
      (orderByNumber?.number === orderNum ? orderByNumber : null),
    [feedOrders, userOrders, orderByNumber, orderNum]
  );

  useEffect(() => {
    if (!orderData && orderNum) {
      void dispatch(fetchOrderByNumber(orderNum));
    }
  }, [orderData, orderNum, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      <p className="text text_type_digits-default" style={{ textAlign: 'center' }}>
        #{String(orderInfo.number).padStart(6, '0')}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
