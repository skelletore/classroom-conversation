# The app
The app consist of a Django app for admins also serving as an API, as well as a React app (frontend, web). The traffic to the API and the Web UI is handled by `nginx`, serving as a reverse proxy.

- `/admin`--> The admin panel to handle users and data
- `/upload` --> Upload new conversation (.graphml)
- `/upload/list` --> Look at all uploaded conversations
- `/upload/illustration` --> Upload new illustration (image)
- `/illustration/list` --> Look at all uploaded illustrations
- `/`--> The landing page of the react app
- `/browse` --> Browse the conversations to start
- `/conversation/<uui>/start` --> Start conversation (the main entry to the app)

# Running / Deployment
## Requirements (Ubuntu)
- `docker.io` >= 19.03
- `docker compose` >= 1.26
## 1. Change environment variables in env files:
### Backend:
- Production: [backend-prod-template.env](backend-prod-template.env)
- Locally: [backend-prod-template.env](backend-dev-template.env)

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
### Production
#### Requirements
- Make sure ports 443 and 80 are open

#### Run containers:
_**NB:** you might have to run your docker commands using sudo_

Start: `docker-compose -f docker-compose.yml up -d --build`

Initialize the backend (API):
- `docker-compose exec backend python manage.py collectstatic`
- `docker-compose exec backend python manage.py migrate --noinput`
- `docker-compose exec backend python manage.py createsuperuser`

### Development / Running locally
_**NB:** you might have to run your docker commands using sudo_

Start: `docker-compose up -d --build`

Initialize the backend (API):
- docker-compose exec backend python manage.py collectstatic
- docker-compose exec backend python manage.py migrate --noinput
- docker-compose exec backend python manage.py createsuperuser

End: `docker-compose down`

Visit the application by navigating to "http://localhost:8080" in the browser


# Django i18n

Update textfiles with new text keys:

`docker-compose exec backend python manage.py makemessages --locale nn`
`docker-compose exec backend python manage.py makemessages --locale nb`

Added text for new text keys

`docker-compose exec backend python manage.py compilemessages`
