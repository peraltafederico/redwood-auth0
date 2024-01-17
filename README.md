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

Create a new tenant in Auth0

Inside applications, create a Single Page Application

Under settings, add the following and save changes:

- Allowed Callback URLs: `http://localhost:8910`
- Allowed Logout URLs: `http://localhost:8910`
- Allowed Web Origins: `http://localhost:8910`

Inside applications, create a new API and set a name and identifier

Under RBAC Settings enable the following and save changes:

- Enable RBAC
- Add Permissions in the Access Token

Inside Permissions, create a set of permissions for your application:

- create:posts
- read:posts
- delete:post
- edit:post

Inside APIs, go to Auth Management API and under Machine to Machine, enable access from the API you just created.

Once you have enabled access, select all permissions prefixed with `users` and save changes.

Inside User Management, go to Roles and create a new role called `admin` and select the permisssions of the API you created earlier.

Under Actions, select Flows and then Login. Lastly, create a new custom action called "create user in db".

Copy and paste the code under `auth0/login_action.js` into the code editor. You will notice two constants at the top of the file. Replace the values with your own.

- `SCOPE`` is the audience of the API you created earlier. You can find this under APIs > Auth Management API > Settings > Identifier
- `USER_SERVICE_BASE_URL` is the base url of your RedwoodJS application. You will need to configure ngrok - or a similar service - to target to your local development server at http://localhost:8910. To do this, run `ngrok http 8910` and copy the forwarding url into the constant. If you don't have ngrok installed, you can follow the instructions [here](https://ngrok.com/download).

Finally, install `axios`as dependency of the action and deploy.

Once you created the action, come back to Login and make sure the action is dropped between Start and Complete.

After this, go to your .env file, copy and paste the values from .env.example and replace with your own values. You're ready now to start the project in dev mode!
