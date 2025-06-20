#!/bin/bash

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate private key
echo "Generating private key..."
openssl genrsa -out ssl/private.key 2048

# Generate self-signed certificate
echo "Generating self-signed certificate..."
openssl req -new -x509 -key ssl/private.key -out ssl/certificate.crt -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=52.23.246.251"

echo "SSL certificate generated successfully!"
echo "Files created:"
echo "  - ssl/private.key"
echo "  - ssl/certificate.crt"
echo ""
echo "Note: This is a self-signed certificate for testing only."
echo "For production, use a proper SSL certificate from a trusted CA." 