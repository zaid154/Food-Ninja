import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "../Contact";
import "@testing-library/jest-dom";

// Mock fetch for GitHub profile fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        name: "Mohd Zaid",
        avatar_url: "https://github.com/zaid154.png",
        bio: "Full Stack Developer",
        html_url: "https://github.com/zaid154"
      })
  })
);

describe("Contact Component Tests", () => {
  test("renders contact form fields properly", () => {
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText(/Mohd Zaid/i);
    expect(nameInput).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    expect(emailInput).toBeInTheDocument();

    const messageInput = screen.getByPlaceholderText(/Write your message/i);
    expect(messageInput).toBeInTheDocument();
  });

  test("renders submit button with 'Send Message' text", () => {
    render(<Contact />);

    const submitBtn = screen.getByRole("button", { name: /Send Message/i });
    expect(submitBtn).toBeInTheDocument();
  });
});
