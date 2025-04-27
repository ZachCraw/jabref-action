# JabRef action

> BibTeX GitHub Action

Currently executing JabRef's consistency check.

## Development

### NodeJS

`node index.js` runs the action.

One needs to have `/home/actions` rw for the current user.

### act

Requires `npm run build`.

     act --rm --platform ubuntu-latest=fwilhe2/act-runner:latest -W .github/workflows/check.yml

Powered by [act](https://github.com/nektos/act)
