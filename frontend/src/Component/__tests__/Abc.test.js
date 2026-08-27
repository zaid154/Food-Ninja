import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import store from "../../utils/Store";
import { Provider } from "react-redux";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Cart from "../Cart";
import data from "../../mockData/cartMock.json";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(data),
  })
);

test("Header component test", async () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <Header />
        <Cart />
      </Provider>
    </BrowserRouter>
  );

  const cartBtn = await screen.findAllByRole("button", {
    name: /Add to cart/i,
  });

  fireEvent.click(cartBtn[0]);
});