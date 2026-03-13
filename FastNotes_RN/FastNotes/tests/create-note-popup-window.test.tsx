import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import CreateNoteWindow from "../components/create-note-popup-window";

test("oppretter notat og kaller onSave", async () => {

  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const { getByPlaceholderText, getByText } = render(
    <CreateNoteWindow
      visible={true}
      onClose={mockOnClose}
      onSave={mockOnSave}
    />
  );

  const titleInput = getByPlaceholderText("Title");
  const descriptionInput = getByPlaceholderText("Write your note...");
  const saveButton = getByText("Save");

  fireEvent.changeText(titleInput, "Test title");
  fireEvent.changeText(descriptionInput, "Test description");

  fireEvent.press(saveButton);

  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalled();
  });
});