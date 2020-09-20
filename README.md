# 👨‍💻 tech_review_2020

Tech review of deno/hasura/keycloack/kongHQ on a kubernetes cluster

![alt text](https://github.com/sheepux/tech_review_2020/raw/master/doc/archi_poc.png "POC architecture")

## 🔖 Web sources

https://khaja.dev/posts/a-sane-starter-for-rapid-prototyping/

https://dev.to/singhcool/graphql-server-with-deno-and-oak-framwork-2cpn

https://github.com/timhall/svelte-apollo

https://github.com/rodolphocastro/deno-swapi (deno/oak/svelte)

https://www.nielsvandermolen.com/new-architecture-svelte-api-platform/


## 📚 Install docs

https://github.com/httpsOmkar/keycloak-hasura-connector

https://github.com/httpsOmkar/keycloak-hasura-connector/blob/master/docs/keycloak-client-configuration.md

https://github.com/httpsOmkar/keycloak-hasura-connector/blob/master/docs/hasura-config.md

http://www.mastertheboss.com/jboss-frameworks/keycloak/keycloak-with-docker

## Keycloack
### Realm Export
```
docker exec -it tech_review_2020_keycloak_1 /bin/bash

/opt/jboss/keycloak/bin/standalone.sh \
-Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.action=export \
-Dkeycloak.migration.provider=singleFile \
-Dkeycloak.migration.realmName=veilletechno2020 \
-Dkeycloak.migration.usersExportStrategy=REALM_FILE \
-Dkeycloak.migration.file=/tmp/my_realm.json

exit

docker cp tech_review_2020_keycloak_1:/tmp/my_realm.json ./myrealm.json
```
### Hasura role script
https://gist.github.com/webdeb/d8a99df9023f01b78e3e8ff580abe10b