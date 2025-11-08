# Settings Keys Exclusion System

## Overview

The module-manager now supports excluding automatically generated settings steps when custom steps already cover those settings. This prevents duplicate steps and provides better control over the installation flow.

## How It Works

### 1. Custom Steps with Settings Keys

When creating custom installation steps that inherit from `InstallStepAbstract`, you can specify which settings keys this step will handle:

```typescript
import InstallStepAbstract from "../installStepper/InstallStepAbstract";

export default class MyCustomStep extends InstallStepAbstract {
    // ... other required properties ...

    // Specify which settings this step will handle
    public settingsKeys: string[] = ['MY_CUSTOM_SETTING', 'ANOTHER_SETTING'];

    // ... rest of implementation ...
}
```

### 2. Automatic Exclusion

When `SettingsStepGenerator.newStep()` is called, it:

1. Gets all existing steps from the `InstallStepper`
2. Collects all `settingsKeys` from custom steps using `getCoveredSettingsKeys()`
3. Filters out settings that are already covered by custom steps
4. Only generates steps for uncovered settings

### 3. Benefits

- **No Duplicate Steps**: Prevents the same setting from appearing in multiple steps
- **Better UX**: Custom steps take precedence over auto-generated ones
- **Flexible Control**: Developers can override default behavior for specific settings
- **Backward Compatible**: Existing code continues to work unchanged

## Implementation Details

### InstallStepper.getCoveredSettingsKeys()

```typescript
/** Get all settings keys that are already covered by existing custom steps */
public getCoveredSettingsKeys(): string[] {
    const coveredKeys: string[] = [];
    for (const step of this.steps) {
        if (step.settingsKeys && step.settingsKeys.length > 0) {
            coveredKeys.push(...step.settingsKeys);
        }
    }
    // Remove duplicates
    return [...new Set(coveredKeys)];
}
```

### SettingsStepGenerator Filtering

```typescript
static newStep(stepperId: string = "project") {
    const installStepper = ensureInstallStepper(stepperId);
    const coveredSettingsKeys = installStepper.getCoveredSettingsKeys();

    // Filter out settings that are already covered by custom steps
    const uncoveredSettings = this.settings.filter(setting =>
        !coveredSettingsKeys.includes(setting.key)
    );

    // Process only uncovered settings...
}
```

## Usage Example

### Before (Without Custom Steps)

```typescript
// SettingsStepGenerator would create steps for ALL settings:
// - DATABASE_HOST
// - DATABASE_PORT
// - CUSTOM_API_KEY
// - LOG_LEVEL
```

### After (With Custom Steps)

```typescript
// Custom step handles database settings
class DatabaseConfigStep extends InstallStepAbstract {
    public settingsKeys: string[] = ['DATABASE_HOST', 'DATABASE_PORT'];
    // ... implementation ...
}

// SettingsStepGenerator will only create steps for:
// - CUSTOM_API_KEY
// - LOG_LEVEL
//
// DATABASE_HOST and DATABASE_PORT are excluded because they're
// handled by the custom DatabaseConfigStep
```

## Migration Guide

### For Custom Step Developers

1. **Identify Settings**: Determine which settings your custom step handles
2. **Set settingsKeys**: Add the `settingsKeys` array to your step class:

```typescript
export default class MyCustomStep extends InstallStepAbstract {
    public settingsKeys: string[] = ['SETTING_KEY_1', 'SETTING_KEY_2'];

    // ... rest of implementation ...
}
```

3. **Test**: Verify that auto-generated steps for those settings are no longer created

### For Module Developers

No changes required! The system automatically detects and respects custom steps.

## Best Practices

### 1. Be Specific
Only include settings that your step actually handles:

```typescript
// ✅ Good
public settingsKeys: string[] = ['API_ENDPOINT', 'API_TIMEOUT'];

// ❌ Avoid
public settingsKeys: string[] = ['ALL_API_SETTINGS']; // Too vague
```

### 2. Use Exact Keys
Make sure the keys match exactly with the settings in the database:

```typescript
// ✅ Good - matches Settings.key
public settingsKeys: string[] = ['SMTP_HOST', 'SMTP_PORT'];

// ❌ Avoid - case sensitive
public settingsKeys: string[] = ['smtp_host', 'smtp_port'];
```

### 3. Document Coverage
Add comments to explain which settings are covered:

```typescript
export default class EmailConfigStep extends InstallStepAbstract {
    // Handles all SMTP-related settings for email configuration
    public settingsKeys: string[] = [
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USERNAME',
        'SMTP_PASSWORD',
        'SMTP_ENCRYPTION'
    ];
}
```

## Testing

### Verify Exclusion Works

```typescript
// Add a custom step
const customStep = new MyCustomStep();
customStep.settingsKeys = ['CUSTOM_SETTING'];
installStepper.addStep(customStep);

// Add settings
SettingsStepGenerator.addSetting({ key: 'CUSTOM_SETTING', ... });
SettingsStepGenerator.addSetting({ key: 'OTHER_SETTING', ... });

// Generate steps
SettingsStepGenerator.newStep();

// Check results
const steps = installStepper.getSteps();
console.log(steps.length); // Should be 2 (custom + auto-generated for OTHER_SETTING)
```

### Check Covered Keys

```typescript
const coveredKeys = installStepper.getCoveredSettingsKeys();
console.log(coveredKeys); // ['CUSTOM_SETTING']
```

## Troubleshooting

### Steps Still Generated
- Check that `settingsKeys` is properly set in your custom step
- Verify the keys match exactly (case-sensitive)
- Ensure the custom step is added to the stepper before `newStep()` is called

### Custom Step Not Working
- Verify your step extends `InstallStepAbstract`
- Check that `settingsKeys` is a public array property
- Ensure the step is properly instantiated and added

### Performance Issues
- The filtering happens only during step generation
- No impact on runtime performance
- Minimal memory overhead for storing covered keys

## API Reference

### InstallStepAbstract.settingsKeys
```typescript
public settingsKeys: string[] = [];
```
Array of setting keys that this step handles. Used by `SettingsStepGenerator` to exclude auto-generated steps.

### InstallStepper.getCoveredSettingsKeys()
```typescript
public getCoveredSettingsKeys(): string[]
```
Returns all settings keys that are covered by existing custom steps.

### SettingsStepGenerator.newStep()
```typescript
static newStep(stepperId: string = "project"): void
```
Generates settings steps, automatically excluding keys covered by custom steps.

## Future Enhancements

- **Validation**: Warn if custom steps claim non-existent settings
- **Conflicts**: Detect when multiple steps claim the same setting
- **Dependencies**: Support for step dependencies based on settings
- **UI Indicators**: Show which settings are covered in admin interface</content>
<parameter name="filePath">/prj/backend_24/@webresto/module-manager/docs/settings-keys-exclusion.md