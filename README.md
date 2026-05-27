# XPath Doctor

Analyze XPath expressions directly inside VSCode.

XPath Doctor helps developers identify fragile XPath selectors, understand what they do, and improve scraping reliability.

## Features

- XPath classification:
  - GOOD
  - REGULAR
  - FRAGILE

- Explains what the XPath does
- Detects fragile selectors
- Suggests improvements
- Integrated directly into VSCode

## Example

### XPath

```xpath
/html/body/div[2]/main/div[3]/span/text()
```

### Result

- Classification: FRAGILE
- Detects absolute path usage
- Detects fixed indexes
- Suggests more resilient selectors

## How to Use

1. Select an XPath
2. Right click
3. Click:

```txt
XPath Doctor: Analyze Selected XPath
```

## Supported Features

- Absolute path detection
- Fixed index detection
- Generic selector detection
- Class/id analysis
- XPath explanation engine

## Future Improvements

- Analyze all XPaths in file
- AI-powered XPath suggestions
- Scrapy integration
- CodeLens support
- HTML preview mode

## License

MIT