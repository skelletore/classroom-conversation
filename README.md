# The app
The app consist of a Django app for admins also serving as an API, as well as a React app (frontend, web). The traffic to the API and the Web UI is handled by `nginx`, serving as a reverse proxy.

- `/admin`--> The admin panel to handle users and data
- `/upload` --> Upload new conversation (.graphml)
- `/upload/list` --> Look at all uploaded conversations
- `/upload/illustration` --> Upload new illustration (image)
- `/illustration/list` --> Look at all uploaded illustrations
- `/illustration/<image_name>` --> View an illustration by name
- `/`--> The landing page of the react app
- `/browse` --> Browse the conversations to start
- `/conversation/<uuid>/start` --> Start conversation (the main entry to the app)

# Running / Deployment
## Requirements (Ubuntu)
- `docker.io` >= 19.03
- `docker compose` >= 1.26
## 1. Change environment variables in env files:
### Backend:
- Production: [backend-prod-template.env](backend-prod-template.env)
- Locally: [backend-dev-template.env](backend-dev-template.env)

1. Copy the template environment file:
  - If running locally (development or testing): `cp backend-dev-template.env backend.env`
  - If deploying to production: `cp backend-prod-template.env backend.env`
2. Change the following:
  - _Production only:_
    - `CERT_PATH` (where you store your .cert and .key)
  - Production and locally:
    - Generate a new secret key by running: `python backend/generate-secret-key.py`
    - Set the value of `SECRET_KEY` to the output from the script above

### [db-template.env](db-template.env):
Docker compose sets up a database named `postgres` with the user `postgres`.

1. Copy the template environment file: `cp db-template.env db.env`
2. Set the value of the `POSTGRES_PASSWORD`:
- `POSTGRES_PASSWORD=someSuperSecretPassword`

## 2. Running the services

> _**NB:** you may need to run your docker commands using `sudo`_

### Production
#### Requirements
- Make sure ports 443 and 80 are open

#### Run containers:

1. Start the containers: `docker-compose -f docker-compose.yml up -d --build`
2. Run the commands specified in [Initialize the backend (API)](#initialize-the-backend-api) below

### Development / Running locally


1. Start the containers: `docker-compose up -d --build`
2. Run the commands specified in [Initialize the backend (API)](#initialize-the-backend-api) below

### Initialize the backend (API)
```bash
docker-compose exec backend python manage.py collectstatic
docker-compose exec backend python manage.py migrate --noinput
docker-compose exec backend python manage.py createsuperuser
```

### Stop the containers
`docker-compose down`

Visit the application by navigating to "http://localhost:8080" in the browser

# Django i18n
If you need to update the internationalization files, do the following:
1. Add the newly defined messages to the locale files
```
docker-compose exec backend python manage.py makemessages --locale nn
docker-compose exec backend python manage.py makemessages --locale nb
```
2. Modify the i18n-files, adding the `msgstr`:
- NB: `backend/classroomconversation/locale/nb/LC_MESSAGES/django.po`
- NN: `backend/classroomconversation/locale/nn/LC_MESSAGES/django.po`

E.g., to set the translation for `nb` for the label `form.label.uniform_probability`:
```
#: conversation/forms.py:52
msgid "form.label.uniform_probability"
msgstr "Uniform sannsynlighet"
```

3. Once you're done editing the messages, compile the files: `docker-compose exec backend python manage.py compilemessages`
