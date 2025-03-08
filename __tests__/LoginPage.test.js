/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { fireEvent, getByPlaceholderText, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from "../app/components/pages/LoginPage";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => [null, jest.fn()]),
}));

describe("LoginPage", () => {
  const renderPage = () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path={ "/" } element={ <LoginPage/> }/>
        </Routes>
      </MemoryRouter>
    );
  };

  // login
  it("renders message", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path={ "/" } element={ <LoginPage/> }/>
        </Routes>
      </MemoryRouter>
    );

    const message = screen.getByText("Welcome back");
    expect(message).toBeInTheDocument();
  });

  it("renders inputs for login", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path={ "/" } element={ <LoginPage/> }/>
        </Routes>
      </MemoryRouter>
    );

    const emailInput = screen.getByText("Email");
    const passwordInput = screen.getByText("Password");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("renders buttons for login", async () => {
    renderPage();

    const loginButton = screen.getByRole("button", { name: "Login" });
    const forgotPasswordButton = screen.getByRole("button", { name: "Forgot password?" });
    const signUpButton = screen.getByRole("button", { name: "Sign-up" });

    expect(loginButton).toBeInTheDocument();
    expect(forgotPasswordButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();

    // TODO: Check that relevant functions are called when fireEvent.click(button)
  });
});
