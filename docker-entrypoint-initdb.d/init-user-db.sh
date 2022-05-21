#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE app_testing;
	GRANT ALL PRIVILEGES ON DATABASE app_testing TO "$POSTGRES_USER";
EOSQL
