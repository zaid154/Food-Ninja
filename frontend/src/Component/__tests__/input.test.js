import { render, screen } from "@testing-library/react";
import Cart from "../Cart";
import data from "../../mockData/cartMock.json";
import "@testing-library/jest-dom";

// mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(data),
  })
);

it("should render Search button", async () => {
  render(<Cart />);

  const searchbtn = await screen.findByRole("button", {
    name: "Search",
  });

  expect(searchbtn).toBeInTheDocument();
});