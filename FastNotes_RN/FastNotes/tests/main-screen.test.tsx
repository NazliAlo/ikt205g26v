import { supabase } from "@/lib/supabase";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import MainScreen from "../app/main-screen";


test("viser loader før notater lastes og skjuler den når data kommer", async () => {
  // Mock fetchNotes
  (supabase.from as jest.Mock).mockReturnValue({
  select: jest.fn().mockReturnValue({
    order: jest.fn().mockReturnValue({
      range: jest.fn().mockResolvedValue({
        data: [{ id: "1", title: "Test note", description: "Desc" }],
        error: null,
      }),
    }),
  }),
});

  const { getByTestId, queryByTestId, getByText } = render(<MainScreen />);

  // Loader skal være synlig først
  expect(getByTestId("loader")).toBeTruthy();

  // Vent til notatene er lastet og loaderen forsvinner
  await waitFor(() => {
    expect(queryByTestId("loader")).toBeNull();
    expect(getByText("Jobb notater")).toBeTruthy();
    expect(getByText("Test note")).toBeTruthy();
  });
});