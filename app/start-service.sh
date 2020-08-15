#!/bin/sh

if [[ $NODE_ENV == "production" ]];
then
  echo 'Service starting in production'

  cp -r /cache/. /app/
  npm run prod

  exit 0
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
