import { render, screen } from "@testing-library/react";
import Header from "../Header";
import store from "../../utils/Store";
import { Provider } from "react-redux";
import React from "react";
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

    const loginbtn = screen.getByText("Login");
    expect(loginbtn).toBeInTheDocument();
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