# Environment Setup Guide

This guide explains how to configure environment variables for local development and production deployment.

## Quick Start (Demo Mode)

For local testing with demo data, the project works out of the box with minimal configuration:

1. **Copy environment template**
   ```bash
   cp .env .env.local  # If .env doesn't exist, create it
   ```

2. **Required variables for demo mode**
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/health_dashboard
   JWT_SECRET=demo-jwt-secret-change-in-production
   DEMO_MODE=true
   ```

3. **Run database setup**
   ```bash
   pnpm db:push
   pnpm seed:demo
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Login with demo account**
   - Email: `health.demo@manus.im`
   - OAuth handled automatically in demo mode

---

## Environment Variables Reference

### Database Configuration

```env
DATABASE_URL=mysql://user:password@localhost:3306/health_dashboard
```

**Description**: MySQL/TiDB connection string for storing patient data, exam history, and user information.

**Local Development**:
- Install MySQL locally or use Docker:
  ```bash
  docker run --name health-db -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=health_dashboard -p 3306:3306 -d mysql:8
  ```
- Update connection string with your credentials

**Production**:
- Use a managed database service (AWS RDS, PlanetScale, TiDB Cloud)
- Enable SSL/TLS connections
- Use strong passwords and restrict access

---

### Authentication & Security

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Description**: Secret key for signing JWT tokens used in session management.

**Generation**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Security**:
- ⚠️ **NEVER** commit this to version control
- Use different secrets for dev/staging/production
- Rotate periodically (every 90 days recommended)

---

### OAuth Configuration (Manus)

```env
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-manus-app-id
```

**Description**: Manus OAuth integration for user authentication.

**Demo Mode**: Pre-configured, no changes needed

**Production**:
1. Register your application at [Manus Developer Portal](https://manus.im/developers)
2. Obtain your `VITE_APP_ID`
3. Configure callback URLs

---

### Owner Information

```env
OWNER_OPEN_ID=demo-user-open-id-12345
OWNER_NAME=Demo User
```

**Description**: Default owner account for demo mode and admin access.

**Demo Mode**: Use the provided demo values

**Production**: Set to your actual admin account credentials

---

### Medical Analysis Service

```env
MEDICAL_ANALYSIS_DEPLOYMENT_MODE=internal
```

**Description**: Deployment mode for medical analysis service.

**Options**:
- `internal` (default): Direct function calls, no external dependencies
- `mcp`: Model Context Protocol server (requires additional setup)

**When to use MCP**:
- External integrations need access to medical analysis
- Microservices architecture
- Multiple applications consuming the same service

---

### LLM Integration (Manus Built-in)

```env
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your-manus-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
```

**Description**: Manus Forge API for LLM-powered medical analysis generation.

**Demo Mode**: Pre-configured with demo credentials

**Production**:
1. Obtain API keys from [Manus Dashboard](https://manus.im/dashboard)
2. Set appropriate rate limits and quotas
3. Monitor usage and costs

---

### Analytics (Optional)

```env
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

**Description**: Analytics tracking for usage insights and performance monitoring.

**Recommended Services**:
- Plausible Analytics (privacy-friendly)
- Umami (self-hosted)
- Google Analytics (if GDPR compliant)

**Demo Mode**: Can be omitted

---

### Application Branding

```env
VITE_APP_TITLE=Health Dashboard
VITE_APP_LOGO=/logo.png
```

**Description**: Customizable application title and logo.

**Customization**:
- Place logo file in `client/public/`
- Update `VITE_APP_LOGO` with the file path
- Logo should be square (recommended: 512x512px)

---

## Production Deployment Checklist

Before deploying to production, ensure:

- [ ] `JWT_SECRET` is a strong, randomly generated value
- [ ] `DATABASE_URL` uses SSL/TLS connection
- [ ] `DEMO_MODE` is set to `false` or removed
- [ ] OAuth credentials are production-ready
- [ ] LLM API keys have appropriate rate limits
- [ ] Analytics is configured (if desired)
- [ ] All secrets are stored securely (not in code)
- [ ] Environment variables are set in hosting platform
- [ ] Database backups are configured
- [ ] SSL certificates are valid

---

## Troubleshooting

### Database Connection Errors

**Error**: `ER_ACCESS_DENIED_ERROR: Access denied for user`

**Solution**:
1. Verify `DATABASE_URL` credentials
2. Check database user permissions
3. Ensure database exists: `CREATE DATABASE health_dashboard;`

### OAuth Login Fails

**Error**: `OAuth callback failed`

**Solution**:
1. Verify `VITE_APP_ID` is correct
2. Check callback URL configuration in Manus portal
3. Ensure `OAUTH_SERVER_URL` is accessible

### LLM Analysis Not Working

**Error**: `Failed to generate medical analysis`

**Solution**:
1. Verify `BUILT_IN_FORGE_API_KEY` is valid
2. Check API rate limits and quotas
3. Ensure `MEDICAL_ANALYSIS_DEPLOYMENT_MODE=internal`
4. Review server logs for detailed error messages

---

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use different secrets per environment** - Dev, staging, production
3. **Rotate secrets regularly** - Every 90 days minimum
4. **Restrict database access** - Use firewall rules and VPCs
5. **Enable audit logging** - Track all data access
6. **Encrypt sensitive data** - Use database encryption at rest
7. **Monitor for breaches** - Set up security alerts

---

## Need Help?

- **Documentation**: [GitHub Wiki](https://github.com/YOUR_USERNAME/health-dashboard/wiki)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/health-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/health-dashboard/discussions)
- **Email**: health.dashboard@example.com
