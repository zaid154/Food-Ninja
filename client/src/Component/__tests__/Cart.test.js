import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartPage from "../CartPage";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import appStore from "../../utils/Store";
import { addCart, clearCart } from "../../utils/cartSlice";

describe("Cart Component Tests", () => {
  beforeEach(() => {
    appStore.dispatch(clearCart());
  });

  test("renders empty cart state when no items exist", () => {
    render(
      <Provider store={appStore}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const emptyMsg = screen.getByText(/Your Cart is Empty/i);
    expect(emptyMsg).toBeInTheDocument();
  });

  test("renders added dish in cart when item is in Redux store", () => {
    appStore.dispatch(
      addCart({
        id: 1,
        name: "Classic Margherita Pizza",
        price: 299,
        quantity: 1,
        image: "https://example.com/pizza.jpg"
      })
    );

    render(
      <Provider store={appStore}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const dishName = screen.getByText(/Classic Margherita Pizza/i);
    expect(dishName).toBeInTheDocument();
  });
});
