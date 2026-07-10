import postcss from "postcss";

function scopeSelector(selector: string, scope: string, dark = false) {
  const trimmedSelector = selector.trim();

  if (!trimmedSelector) return selector;

  if (dark) {
    if (trimmedSelector.startsWith(".dark ")) {
      return `.dark ${scope} ${trimmedSelector.slice(6)}`;
    }

    return `.dark ${scope} ${trimmedSelector}`;
  }

  if (trimmedSelector.startsWith(".dark ")) {
    return `.dark ${scope} ${trimmedSelector.slice(6)}`;
  }

  return `${scope} ${trimmedSelector}`;
}

export async function scopePortfolioTheme(
  css: string,
  scopeId: string,
  dark = false,
) {
  const scope = `[data-portfolio-theme="${scopeId}"]`;
  const root = postcss.parse(css);

  root.walkRules((rule) => {
    if (!rule.selectors?.length) return;

    const parentName = rule.parent?.type === "atrule" ? rule.parent.name : undefined;
    if (parentName && /keyframes$/i.test(parentName)) return;

    rule.selectors = rule.selectors.map((selector) =>
      scopeSelector(selector, scope, dark),
    );
  });

  return root.toString();
}
