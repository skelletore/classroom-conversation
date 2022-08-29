ARG APP_ROOT=/app
ARG POETRY_INSTALL_ARGS="--no-interaction --no-ansi"
ARG VENV_PATH=$APP_ROOT/.venv
ARG APT_INSTALL_ARGS="-qq --no-install-recommends -o Dpkg::Use-Pty=0"
ARG RUN_AS_USER_NAME="abc"
ARG RUN_AS_USER_UID="1000"

FROM python:3.10-slim AS base
ARG APP_ROOT \
    VENV_PATH
# Set environment variables
ENV VENV_PATH=$VENV_PATH \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=$APP_ROOT \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    DEBIAN_FRONTEND=noninteractive
ENV PATH="$VENV_PATH/bin:$PATH"

WORKDIR $APP_ROOT
CMD ["gunicorn", "classroomconversation.wsgi:application", "--bind", "0.0.0.0:8000"]

COPY pyproject.toml poetry.lock ./
COPY classroomconversation ./

# Install packages and dependencies
FROM base AS base-deps
## Install required OS packages
### Install Poetry
RUN pip install -q --upgrade pip && \
    pip install -q poetry && \
    poetry config virtualenvs.in-project true

### dev stage ###
FROM base-deps AS app-dev
ARG POETRY_INSTALL_ARGS
## Install dependencies
RUN poetry install $POETRY_INSTALL_ARGS

FROM base AS development
ARG APP_ROOT \
    VENV_PATH \
    APT_INSTALL_ARGS

RUN apt-get update -qq && \
    apt-get install $APT_INSTALL_ARGS gettext && \
    rm -rf "/var/cache/apt/*" "/var/lib/apt/lists/*"

COPY --from=app-dev $VENV_PATH/ $VENV_PATH/
COPY .flake8 .bandit ./
VOLUME [ "$VENV_PATH" ]
VOLUME [ "$APP_ROOT" ]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
### END dev stage ###

### prod stage ###
FROM base-deps AS app-prod
ARG POETRY_INSTALL_ARGS
RUN poetry install $POETRY_INSTALL_ARGS --no-dev

FROM base AS production
ARG VENV_PATH \
    APP_ROOT \
    RUN_AS_USER_NAME \
    RUN_AS_USER_UID
COPY --from=app-prod $VENV_PATH $VENV_PATH

# Set up user and permissions
RUN useradd -Ms /bin/bash -u $RUN_AS_USER_UID $RUN_AS_USER_NAME
RUN chown -R $RUN_AS_USER_NAME:$RUN_AS_USER_NAME $APP_ROOT
RUN chmod 755 $APP_ROOT

USER $RUN_AS_USER_NAME
### END prod stage ###
