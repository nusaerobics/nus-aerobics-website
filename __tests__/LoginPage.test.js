/** @jest-environment jsdom */

import React from "react";
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import LoginPage from "../app/components/pages/LoginPage";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => [null, jest.fn()]),
}));

const mockHandleLogin = () => jest.fn();
const mockHandleSignUp = () => jest.fn();
const mockHandleForgotPassword = () => jest.fn();
const mockHandleClick = (view) => {
  switch (view) {
    case "login":
      return mockHandleLogin();
    case "signup":
      return mockHandleSignUp();
    case "forgot":
      return mockHandleForgotPassword();
  }
}

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
  it("renders message for login", async () => {
    renderPage();

    const topAction = await waitFor(() => screen.getByText("Welcome back"));
    const bottomAction = await waitFor(() => screen.getByText("Don't have an account?"));
    expect(topAction).toBeInTheDocument();
    expect(bottomAction).toBeInTheDocument();
  });

  it("renders inputs for login", async () => {
    renderPage();

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
  });

  // TODO: Check that relevant functions are called when buttons are clicked
  // TODO: Check that Toast messages are displayed depending on the scenario

  // sign-up
  it("renders message for sign-up", async () => {
    renderPage();
    const bottomButton = await waitFor(() => screen.getByTestId("bottomButton"));
    fireEvent.click(bottomButton);

    const topAction = await waitFor(() => screen.getByText("Create an account"));
    const bottomAction = await waitFor(() => screen.getByText("Already have an account?"));
    expect(topAction).toBeInTheDocument();
    expect(bottomAction).toBeInTheDocument();
  });

  it("renders inputs for sign-up", async () => {
    renderPage();
    const bottomButton = await waitFor(() => screen.getByTestId("bottomButton"));
    fireEvent.click(bottomButton);

    const nameInput = screen.getByText("Full name");
    const emailInput = screen.getByText("Email");
    const passwordInput = screen.getByText("Password");
    const confirmPasswordInput = screen.getByText("Confirm password");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  it("renders buttons for sign-up", async () => {
    renderPage();
    const bottomButton = await waitFor(() => screen.getByTestId("bottomButton"));
    fireEvent.click(bottomButton);

    const signUpButton = screen.getByRole("button", { name: "Sign-up" });
    const loginButton = screen.getByRole("button", { name: "Login" });

    expect(signUpButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("changes back to login from sign-up", async () => {
    renderPage();
    const bottomButton = await waitFor(() => screen.getByTestId("bottomButton"));
    fireEvent.click(bottomButton);
    fireEvent.click(bottomButton);

    const message = await waitFor(() => screen.getByText("Welcome back"));
    expect(message).toBeInTheDocument();
  });

  // forgot password
  it("renders message for forgot password", async () => {
    renderPage();
    const forgotButton = await waitFor(() => screen.getByTestId("forgotButton"));
    fireEvent.click(forgotButton);

    const topAction = await waitFor(() => screen.getByText("Forgot password"));
    const bottomAction = await waitFor(() => screen.getByText("Back to"));
    expect(topAction).toBeInTheDocument();
    expect(bottomAction).toBeInTheDocument();
  });

  it("renders inputs for forgot password", async () => {
    renderPage();
    const forgotButton = await waitFor(() => screen.getByTestId("forgotButton"));
    fireEvent.click(forgotButton);

    const emailInput = screen.getByText("Email");

    expect(emailInput).toBeInTheDocument();
  });

  it("renders buttons for forgot password", async () => {
    renderPage();
    const forgotButton = await waitFor(() => screen.getByTestId("forgotButton"));
    fireEvent.click(forgotButton);

    const continueButton = screen.getByRole("button", { name: "Continue" });
    const loginButton = screen.getByRole("button", { name: "login" });

    expect(continueButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("changes back to login from forgot password", async () => {
    renderPage();
    const forgotButton = await waitFor(() => screen.getByTestId("forgotButton"));
    fireEvent.click(forgotButton);

    const bottomButton = await waitFor(() => screen.getByTestId("bottomButton"));
    fireEvent.click(bottomButton);

    const message = await waitFor(() => screen.getByText("Welcome back"));
    expect(message).toBeInTheDocument();
  });
});
