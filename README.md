# Get the reviewers ranking of your repository !

## How to use :

- `npm install -g github-reviews-ranking`

- `ACCESS_TOKEN=XXX REPO=xxx github-reviews-ranking`

With ACCESS_TOKEN your github token and REPO the name of your repository (including your own name) :

Ex : `ACCESS_TOKEN=super_secret REPO=thibautsabot/github-reviews-ranking github-reviews-ranking`

### Change the number of pull request to fetch

You can also add a "PAGES" environment variable to change the number of Pull requests that need to be fetched.

One page is 30 Pull requests so PAGES=5 will fetch 150 Pull Request. (default value is 10 = 300 PR)

### Enterprise

For entreprise accounts you can use the "CUSTOM_DOMAIN" parameters with the end of github your URL.

Ex: If you go to github.mycompany.io use CUSTOM_DOMAIN=mycompany.io

## The output looks like this :

![output](./output.png)
