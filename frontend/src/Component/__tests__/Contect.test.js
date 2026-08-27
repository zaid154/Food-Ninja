import { render, screen } from "@testing-library/react";
import Contect from "../Contact";
import "@testing-library/jest-dom";

// mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        name: "Zaid",
        avatar_url: "test.jpg",
        created_at: "2020-01-01",
      }),
  })
);

describe("Input Box Test", () => {
  test("check input placeholder", () => {
    render(<Contect />);
    const check = screen.getByPlaceholderText("Enter your email");
    expect(check).toBeInTheDocument();
  });

  test("check number of inputs", () => {
    render(<Contect />);
    const check = screen.getAllByRole("textbox");
    expect(check.length).toBe(2); 
  });
});

describe("Button Test", () => {
  test("check button text", () => {
    render(<Contect />);
    const check = screen.getByText("Submit");
    expect(check).toBeInTheDocument();
  });

  test("check button role", () => {
    render(<Contect />);
    const check = screen.getByRole("button");
    expect(check).toBeInTheDocument();
  });
});