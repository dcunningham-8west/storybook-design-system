# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# storybook-design-system

## Radio Controls

`Radio` is the shared radio-button primitive and accepts native radio input props,
including `checked`, `defaultChecked`, `onChange`, `disabled`, and ARIA attributes.
Provide an accessible name with a wrapping label, `aria-label`, or `aria-labelledby`.
Labels, descriptions, and group layout belong to the consuming component.

`ChoiceTile` is a single selectable tile built on `Radio`. It adds `label` and
optional `description` props alongside native radio props such as `checked`,
`onChange`, `name`, `value`, and `disabled`. Its Storybook entry under
Components shows one tile with editable controls.

`ChoiceTileGroup` composes `ChoiceTile` instances and owns the group legend,
hint, options, and selection callback. Its grouped examples appear under
Patterns in Storybook. The existing group API remains available. The former `RadioGroup`,
`RadioGroupProps`, and `RadioOption` exports have been removed; use
`ChoiceTileGroup`, `ChoiceTileGroupProps`, and `ChoiceTileOption` instead.
