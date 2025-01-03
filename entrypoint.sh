#!/bin/bash

IFS=$'\n'
#Use when espcase whitespace parse key/value 
if [ -n "${VAULT_HOST}" ]  ; then
  TOKEN=$(curl -ss -X POST -d "{ \"role_id\":\"${VAULT_ROLE_ID}\",\"secret_id\":\"${VAULT_SECRET_ID}\" }" "${VAULT_HOST}/v1/auth/approle/login"  | jq .auth.client_token | sed 's/"//g')
  if [ "$TOKEN" == "null" ]; then
    echo "TOKEN is null"
  else
    for s in $(curl -ss -H "X-Vault-Token: ${TOKEN}" ${VAULT_HOST}/v1/${ENV}/data/${VAULT_PATH} | jq .data.data | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do
      export $s;
    done
      envsubst < "${CONFIG_SOURCE}" > "${CONFIG_DESTINATION}"
  fi
else
  echo "Missing ENV"
fi
exec "$@"
