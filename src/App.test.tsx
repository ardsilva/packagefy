import React from "react";
import { render } from "@testing-library/react";
import App from "./containers/App";

test("renders the landing page", () => {
  const { getByText } = render(<App />);
  const msg = getByText("PACKAGE ANALYZER");
  expect(msg).toBeInTheDocument();
});
