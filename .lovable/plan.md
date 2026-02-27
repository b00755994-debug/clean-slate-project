

## Fix left padding on Slack "Select" badge

The Slack logo touches the left border because `pl-1.5` is too tight. Increase to `pl-2` to match the test page's "Outline + Arrow" visual spacing shown in the screenshot.

### Change in `src/pages/Dashboard.tsx` (line 834)

Change `pl-1.5` to `pl-2` in the Badge className.

