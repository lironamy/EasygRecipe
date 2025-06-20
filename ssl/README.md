# SSL Certificate Setup

To enable HTTPS on your backend server, you need to place SSL certificates in this directory.

## Option 1: Self-Signed Certificate (for development/testing)

Generate a self-signed certificate using OpenSSL:

```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate certificate
openssl req -new -x509 -key private.key -out certificate.crt -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=52.23.246.251"
```

## Option 2: Let's Encrypt Certificate (for production)

1. Install Certbot:
```bash
sudo apt-get update
sudo apt-get install certbot
```

2. Generate certificate:
```bash
sudo certbot certonly --standalone -d your-domain.com
```

3. Copy the certificates:
```bash
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/private.key
sudo cp /etc/letsencrypt/live/your-domain.com/cert.pem ./ssl/certificate.crt
```

## Option 3: Commercial SSL Certificate

If you have a commercial SSL certificate:
1. Place your private key as `private.key`
2. Place your certificate as `certificate.crt`

## File Structure

```
ssl/
├── private.key    # Private key file
├── certificate.crt # Certificate file
└── README.md      # This file
```

## Security Notes

- Keep your private key secure and never commit it to version control
- Add `ssl/private.key` to your `.gitignore` file
- Use strong passwords and proper file permissions
- Consider using environment variables for sensitive data in production 