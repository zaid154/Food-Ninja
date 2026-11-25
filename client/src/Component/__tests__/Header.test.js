import { render, screen } from "@testing-library/react";
import Header from "../Header";
import store from "../../utils/Store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

test("Header component test", () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <Header />
      </Provider>
    </BrowserRouter>
  );

  const signInBtn = screen.getByText(/Sign In|Login/i);
  expect(signInBtn).toBeInTheDocument();
});

test("Cart link test", () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <Header />
      </Provider>
    </BrowserRouter>
  );

  const cartLink = screen.getByText(/Cart/i);
  expect(cartLink).toBeInTheDocument();
});
