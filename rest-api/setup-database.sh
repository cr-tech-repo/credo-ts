#!/bin/bash

# Create the database for all wallets
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE credo_wallets;"

echo "Database 'credo_wallets' created successfully."
