# Auto Copyright

Automatically adds copyright headers to source code and text files in Visual Studio Code.

## Features

- Automatically inserts a copyright header when creating, opening, or saving files
- Supports many file types and frameworks (e.g. HTML, CSS, JS, PHP, Python, Vue, Blade, Markdown, and more)
- Intelligent detection of the correct comment format for each language
- No duplicate headers – checks if a copyright notice already exists
- Fully configurable: name, year, and text can be set in the settings

## Supported File Types

- HTML, XML, Markdown, Vue
- CSS, SCSS, SASS
- JavaScript, TypeScript, JSX, TSX
- PHP, Blade
- Python
- Java, C, C++
- Ruby, Go, Shellscript
- JSON, YAML

## Configuration

In VS Code settings under "Auto Copyright":
- **Name**: Name of the copyright holder
- **Year**: Copyright year
- **Text**: Additional copyright text (multi-line possible)

## Example

**JavaScript:**
```js
// Copyright (c) 2025 Max Mustermann.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
```

**HTML:**
```html
<!--
  Copyright (c) 2025 Max Mustermann.
  All rights reserved.
  Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
-->
```

**Python:**
```python
# Copyright (c) 2025 Max Mustermann.
# All rights reserved.
# Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
```

## Notes
- The extension automatically detects the correct comment format for each supported language.
- Existing copyright notices will not be overwritten.
- The settings can be changed at any time and will be used for new headers immediately.

---

**Enjoy using Auto Copyright!**
