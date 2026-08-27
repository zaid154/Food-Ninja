import { render, screen, waitFor } from "@testing-library/react";  // Add waitFor
import "@testing-library/jest-dom";
import Cart from "../Cart";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import appStore from "../../utils/Store";
import { act } from "react";  

jest.mock("../useRecipes", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useRecipes from "../useRecipes";

// Mock data must match the structure the component expects
const mockData = {
  recipes: [  // Wrap in recipes object
    {
      id: 1,
      name: "Classic Margherita Pizza",  // Fixed typo: Margherita
      ingredients: ["Pizza dough", "Tomato sauce", "Fresh mozzarella cheese", "Fresh basil leaves", "Olive oil", "Salt and pepper to taste"],
      instructions: ["Bake it"],
      image: "test.jpg",
      rating: 4.5,
      caloriesPerServing: 300,
      cuisine: "Italian",
      mealType: ["Dinner"],
      cookTimeMinutes: 15,
      reviewCount: 98,
      difficulty: "Easy",
    },
  ],
};

beforeEach(() => {
  useRecipes.mockReturnValue(mockData); 
});

test("renders cart items from mocked useRecipes", async () => {
  await act(async () => {
    render(
      <Provider store={appStore}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );
  });

  await waitFor(() => {
    const item = screen.getByText(/classic margherita pizza/i);
    expect(item).toBeInTheDocument();
  });
}); 