import { expect, test } from '@playwright/test';

const mockIngredients = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  },
  {
    _id: 'main-1',
    name: 'Биокотлета из марсианской магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  },
  {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  },
];

test.describe('Конструктор бургеров и оформление заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/fixtures/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'fallback',
    });
  });

  test('добавление булки и ингредиента в конструктор', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const topBun = page.locator('[data-testid="constructor-bun-1"]');
    const bottomBun = page.locator('[data-testid="constructor-bun-2"]');
    await expect(topBun).toContainText('Краторная булка N-200i');
    await expect(bottomBun).toContainText('Краторная булка N-200i');

    const mainCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской магнолии',
    });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    const constructorIngredients = page.locator(
      '[data-testid="constructor-ingredients"]'
    );
    await expect(constructorIngredients).toContainText(
      'Биокотлета из марсианской магнолии'
    );
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.goto('/');

    const targetIngredient = mockIngredients[1];
    const ingredientCard = page.locator('li', {
      hasText: targetIngredient.name,
    });
    await ingredientCard.locator('a').click();

    const overlay = page.locator('[data-testid="modal-overlay"]');
    const modal = page.locator('#modals');

    await expect(overlay).toBeVisible();
    await expect(modal).toContainText(targetIngredient.name);
    await expect(
      modal.locator('li', { hasText: 'Калории, ккал' })
    ).toContainText(targetIngredient.calories.toString());
    await expect(
      modal.locator('li', { hasText: 'Белки, г' })
    ).toContainText(targetIngredient.proteins.toString());
    await expect(
      modal.locator('li', { hasText: 'Жиры, г' })
    ).toContainText(targetIngredient.fat.toString());
    await expect(
      modal.locator('li', { hasText: 'Углеводы, г' })
    ).toContainText(targetIngredient.carbohydrates.toString());

    const closeButton = page.locator('#modals button[aria-label="Закрыть"]');
    await closeButton.click();
    await expect(overlay).not.toBeVisible();

    await ingredientCard.locator('a').click();
    await expect(overlay).toBeVisible();

    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(overlay).not.toBeVisible();
  });

  test('оформление заказа авторизованным пользователем и очистка конструктора', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-token',
        url: 'http://localhost:4000',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR('tests/fixtures/user.har', {
      url: '**/api/auth/user',
      notFound: 'fallback',
    });

    await page.routeFromHAR('tests/fixtures/order.har', {
      url: '**/api/orders',
      notFound: 'fallback',
    });

    await page.goto('/');

    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской магнолии',
    });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('[data-testid="constructor-bun-1"]')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.locator('[data-testid="constructor-bun-2"]')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Биокотлета из марсианской магнолии');

    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    await orderButton.click();

    const overlay = page.locator('[data-testid="modal-overlay"]');
    await expect(overlay).toBeVisible();
    const orderNumber = page.locator('[data-testid="order-number"]');
    await expect(orderNumber).toHaveText('77777');

    const closeButton = page.locator('#modals button[aria-label="Закрыть"]');
    await closeButton.click();
    await expect(overlay).not.toBeVisible();

    await expect(page.locator('[data-testid="constructor-bun-1"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="constructor-bun-2"]')).not.toBeVisible();
    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).not.toContainText('Биокотлета из марсианской магнолии');
    await expect(page.locator('[data-testid="order-summ"]')).toContainText('0');
  });
});