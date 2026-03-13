import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import MainScreen from "../app/main-screen";

test("viser hovedskjerm uten krasj for ikke-innlogget bruker", async () => {
  const { getByText } = render(<MainScreen />);
  await waitFor(() => {
    expect(getByText("Jobb notater")).toBeTruthy();
  });
});
