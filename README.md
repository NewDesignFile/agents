# New UI Agents
Generate AI agent policy files (`ai-policy.json`, `agents.json`, `llms.txt`) for web apps and sites.

- Generate AI agent policy files with a single command.
- Validate generated files against JSON schemas.
- Customize output directory and file selection.
- Integrate into your project's build or setup process.

### Installation
Install the package locally in your project:
```bash
npm install @new-ui/agents --save-dev
```

### Usage
Add a Script to `package.json` to easily generate policy files:

```json
{
  "scripts": {
    "generate-policies": "agents init"
  }
}
```

### Generate Policy Files
```bash
npm run generate-policies
```

### Customize Output Directory
```bash
npm run generate-policies -- --dir public/ai-config
```

### Generate Specific Files
```bash
npm run generate-policies -- --files ai-policy.json,llms.txt
```

### Disable Validation
```bash
npm run generate-policies -- --no-validate
```