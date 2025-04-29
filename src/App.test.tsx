import { App } from "./App"
import { renderWithProviders } from "./utils/test-utils"

test("App should render correctly", () => {
  renderWithProviders(<App />);

  const firstCell = document.getElementById("cell-0-0");

  // The app should be rendered correctly
  expect(firstCell).toBeInTheDocument();
  expect(firstCell?.textContent).toBe("");
})
