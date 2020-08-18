#!/bin/sh

if [[ $NODE_ENV == "production" ]];
then
  cp -r /cache/. /app/
  npm run prod

  if [[ $MODE == "EDIT" ]];
  then
    echo 'Service starting in production (edit mode)'
    npm run prod-edit

    exit 0
  else
    echo 'Service starting in production'
    npm run prod

    exit 0
  fi
elif [[ $NODE_ENV == "development" ]];
then
  echo 'Service starting in development'

  cp -r /cache/. /app/
  npm run dev

  exit 0
else
  echo 'NODE_ENV not set'
  echo 'Service not starting'

  exit 1
fi
