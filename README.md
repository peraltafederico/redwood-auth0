---
runme:
  id: 01HMANQWB9AN7ZHW9B6RCEJNVP
  version: v2.2
---

# Redwood Auth0

Start by installing dependencies:

```sh {"id":"01HMANQWB8GCARJBESGP6N8YQ8"}
yarn install
```

Then start the development server:

```sh {"id":"01HMANQWB8GCARJBESGQ9C82CF"}
yarn redwood dev
```

Run migrations:

```yaml {"id":"01HMANQWB9AN7ZHW9B6BXHHWYB"}
yarn rw prisma migrate dev
```

## Config Auth0

Create a new tenant in Auth0 and configure the following
