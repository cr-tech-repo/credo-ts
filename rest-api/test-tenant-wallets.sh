#!/bin/bash

# Test script for tenant-based user wallet endpoints

# Base URL for the API
API_URL="http://localhost:3003/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Function to make API requests and display results
api_request() {
  local method=$1
  local endpoint=$2
  local data=$3
  
  echo -e "${GREEN}Request:${NC} $method $endpoint"
  if [ -n "$data" ]; then
    echo -e "${GREEN}Data:${NC} $data"
    echo -e "${GREEN}Response:${NC}"
    curl -s -X $method -H "Content-Type: application/json" -d "$data" "$API_URL$endpoint" | jq .
  else
    echo -e "${GREEN}Response:${NC}"
    curl -s -X $method "$API_URL$endpoint" | jq .
  fi
  echo ""
}

# Check if the API is running
print_header "Checking API Health"
api_request "GET" "/health"

# Create a wallet for Alice
print_header "Creating Wallet for Alice"
api_request "POST" "/tenants/create" '{"userId": "alice", "key": "alice-key"}'

# Create a wallet for Bob
print_header "Creating Wallet for Bob"
api_request "POST" "/tenants/create" '{"userId": "bob", "key": "bob-key"}'

# Create a DID for Alice
print_header "Creating DID for Alice"
api_request "POST" "/tenants/alice/did/create" '{"key": "alice-key", "method": "key", "keyType": "ed25519"}'

# Create a DID for Bob
print_header "Creating DID for Bob"
api_request "POST" "/tenants/bob/did/create" '{"key": "bob-key", "method": "key", "keyType": "ed25519"}'

# List DIDs for Alice
print_header "Listing DIDs for Alice"
api_request "GET" "/tenants/alice/did/list?key=alice-key"

# List DIDs for Bob
print_header "Listing DIDs for Bob"
api_request "GET" "/tenants/bob/did/list?key=bob-key"

print_header "Test Complete"
echo -e "${GREEN}All tests completed successfully!${NC}"
