import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BlogForm from "./BlogForm";

/* Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created. */

describe("<BlogForm/>", () => {
  test("Test submit and contents", async () => {
    const mockHandleCreate = jest.fn();
    const user = userEvent.setup();

    const container = render(
      <BlogForm handleCreate={mockHandleCreate} />
    ).container;

    const title = container.querySelector("#title");
    const author = container.querySelector("#author");
    const url = container.querySelector("#url");

    const sendButton = screen.getByText("create");

    await user.type(title, "Title");
    await user.type(author, "Author");
    await user.type(url, "Url");

    await user.click(sendButton);

    expect(mockHandleCreate.mock.calls).toHaveLength(1);
    expect(mockHandleCreate.mock.calls[0][0].title).toBe("Title");
    expect(mockHandleCreate.mock.calls[0][0].author).toBe("Author");
    expect(mockHandleCreate.mock.calls[0][0].url).toBe("Url");
  });
});
