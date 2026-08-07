import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LocaleProvider, useTranslation } from "./LocaleProvider";

function Probe() {
  const { t, locale, setLocale } = useTranslation();
  return (
    <div>
      <span data-testid="heading">{t("hero.titleAnything")}</span>
      <span data-testid="missing">{t("this.key.does.not.exist")}</span>
      <span data-testid="dir">{document.documentElement.dir}</span>
      <button onClick={() => setLocale("ar")}>ar</button>
      <button onClick={() => setLocale("zh")}>zh</button>
      <span data-testid="locale">{locale}</span>
    </div>
  );
}

describe("LocaleProvider / useTranslation", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to English", () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByTestId("heading")).toHaveTextContent("Anything");
  });

  it("falls back to the key itself when a translation is missing everywhere", () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByTestId("missing")).toHaveTextContent("this.key.does.not.exist");
  });

  it("switches locale and updates translated text plus document direction", () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    fireEvent.click(screen.getByText("zh"));
    expect(screen.getByTestId("locale")).toHaveTextContent("zh");
    expect(screen.getByTestId("heading")).toHaveTextContent("任何货物");
    expect(screen.getByTestId("dir")).toHaveTextContent("ltr");

    fireEvent.click(screen.getByText("ar"));
    expect(screen.getByTestId("heading")).toHaveTextContent("أي شيء");
    expect(screen.getByTestId("dir")).toHaveTextContent("rtl");
  });
});
