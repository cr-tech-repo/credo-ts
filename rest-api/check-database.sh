#!/bin/bash

# Script to check the database profiles and related information

# Database connection parameters
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_NAME="credo_wallets"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Function to execute a query and display results
execute_query() {
  local query="$1"
  local description="$2"
  
  echo -e "${GREEN}$description:${NC}"
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "$query"
  echo ""
}

# Check if psql is available
if ! command -v psql &> /dev/null; then
  echo -e "${RED}Error: psql command not found. Please install PostgreSQL client.${NC}"
  exit 1
fi

# Check if the database exists
if ! psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
  echo -e "${RED}Error: Database '$DB_NAME' does not exist.${NC}"
  exit 1
fi

print_header "Database Information"
execute_query "\l" "List of databases"

print_header "Profiles Table"
execute_query "SELECT * FROM profiles;" "Profiles in the database"

print_header "Items Table (Limited to 5 rows)"
execute_query "SELECT id, profile_id, kind, encode(category, 'hex') as category_hex, encode(name, 'hex') as name_hex, encode(substring(value, 1, 50), 'hex') as value_preview FROM items LIMIT 5;" "Items in the database (first 5 rows with hex-encoded values)"

print_header "Items by Profile"
execute_query "SELECT p.name as profile_name, COUNT(i.id) as item_count FROM profiles p LEFT JOIN items i ON p.id = i.profile_id GROUP BY p.name;" "Number of items per profile"

print_header "Items by Kind and Profile"
execute_query "SELECT p.name as profile_name, i.kind, COUNT(i.id) as item_count FROM profiles p LEFT JOIN items i ON p.id = i.profile_id GROUP BY p.name, i.kind ORDER BY p.name, i.kind;" "Number of items by kind per profile"

print_header "DIDs by Profile (if any)"
execute_query "SELECT p.name as profile_name, encode(i.name, 'hex') as did_hex FROM profiles p JOIN items i ON p.id = i.profile_id WHERE i.kind = 2 LIMIT 10;" "DIDs by profile (limited to 10)"

echo -e "${GREEN}Database check complete!${NC}"
