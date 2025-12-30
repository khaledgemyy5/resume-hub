# Security Documentation

This document outlines the threat model, security measures, and security checklist for the Ammar Resume application.

## Threat Model

### Assets to Protect
1. **Admin Credentials** - Single admin user with full dashboard access
2. **Site Content** - Projects, writing items, settings managed by admin
3. **Analytics Data** - User interaction events (page views, clicks)
4. **Session Tokens** - JWT tokens used for admin authentication

### Threat Actors
1. **Opportunistic Attackers** - Automated bots scanning for vulnerabilities
2. **Targeted Attackers** - Individuals attempting to deface/modify the portfolio
3. **Credential Stuffers** - Attackers using leaked credentials databases

### Attack Vectors

| Vector | Mitigation |
|--------|------------|
| Brute Force Login | Rate limiting (5 attempts/15min), strong password requirements |
| XSS | Helmet CSP headers, no dangerouslySetInnerHTML, React's default escaping |
| CSRF | Double-submit cookie pattern with x-csrf-token header |
| Session Hijacking | httpOnly cookies, secure flag, strict sameSite |
| SQL Injection | Prisma ORM parameterized queries |
| DoS | Rate limiting, request size limits |
| Credential Exposure | Environment variables, no secrets in code |
| Man-in-the-Middle | HTTPS required in production, secure cookies |

## Security Measures

### API Security

#### Authentication
- **JWT-based sessions** stored in httpOnly cookies
- **Token expiration** configurable via JWT_EXPIRES_IN (default: 24h)
- **Password hashing** using scrypt with random salt
- **Password strength requirements**:
  - Minimum 12 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - Not in common password list

#### CSRF Protection
- Double-submit cookie pattern
- csrf_token cookie set on login
- All state-changing requests require x-csrf-token header matching cookie
- Applies to all POST/PUT/PATCH/DELETE on /admin/* routes

#### Rate Limiting
| Endpoint | Window | Max Requests |
|----------|--------|--------------|
| /auth/* | 15 min | 5 |
| /public/events | 1 min | 30 |
| General | 15 min | 100 |

#### HTTP Security Headers (Helmet)
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Strict-Transport-Security (HTTPS only)
- Referrer-Policy

#### Input Validation
- All request bodies validated with Zod schemas
- Path parameters validated
- Query parameters validated where applicable
- File upload restrictions (future)

#### Error Handling
- No stack traces exposed in production
- Standardized error response format
- Errors logged server-side only

### Web Application Security

#### No Dangerous Patterns
- ✅ No dangerouslySetInnerHTML usage
- ✅ No eval() or new Function()
- ✅ No inline script execution

#### Cookie Handling
- CSRF token read from cookies for admin requests
- Credentials included in fetch for auth cookies

#### Content Security
- React's built-in XSS protection via JSX escaping
- External links use rel="noopener noreferrer"

### Infrastructure Security

#### Docker Compose Configuration
- All services bound to 127.0.0.1 (localhost only)
- No public port exposure
- Access via SSH tunnel only
- Internal Docker network for service communication

#### Environment Variables
Required secrets (never commit these):
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Strong admin password (12+ chars)
- `JWT_SECRET` - Random 256-bit secret for JWT signing
- `POSTGRES_PASSWORD` - Database password

## Security Checklist

### Pre-Deployment
- [ ] Set strong ADMIN_PASSWORD (12+ chars, mixed case, numbers)
- [ ] Generate random JWT_SECRET (`openssl rand -base64 32`)
- [ ] Set unique POSTGRES_PASSWORD
- [ ] Verify CORS_ORIGIN matches your domain
- [ ] Enable HTTPS (via reverse proxy/load balancer)
- [ ] Configure firewall (SSH only, no direct DB/API access)

### Code Review
- [ ] No secrets in source code
- [ ] No console.log of sensitive data
- [ ] No dangerouslySetInnerHTML usage
- [ ] All user inputs validated with Zod
- [ ] All admin routes protected with requireAuth middleware
- [ ] All admin write routes protected with verifyCsrf middleware

### Dependency Management
- [ ] Run `pnpm audit` regularly
- [ ] Update dependencies monthly
- [ ] Review changelogs for security patches

### Monitoring
- [ ] Set up log aggregation
- [ ] Monitor failed login attempts
- [ ] Set up alerting for unusual traffic patterns

## Incident Response

### If Credentials Compromised
1. Immediately change ADMIN_PASSWORD via environment variable
2. Restart API service to invalidate all sessions
3. Generate new JWT_SECRET
4. Review analytics for suspicious activity
5. Check content for unauthorized changes

### If Session Token Leaked
1. Generate new JWT_SECRET
2. Restart API service
3. All existing sessions will be invalidated

### If Database Compromised
1. Rotate POSTGRES_PASSWORD
2. Review and restore from backup if needed
3. Change ADMIN_PASSWORD (re-hash will occur)
4. Audit all content for modifications

## Security Testing

### Automated Scans
Run OWASP ZAP baseline scan:
```bash
./scripts/security_zap_baseline.sh
```

Reports are generated in `./reports/` directory.

### Manual Testing Checklist
- [ ] Test login with invalid credentials (should rate limit after 5 attempts)
- [ ] Test admin routes without authentication (should 401)
- [ ] Test admin write routes without CSRF token (should 403)
- [ ] Test with malformed JSON payloads (should 400)
- [ ] Test with oversized payloads (should reject)
- [ ] Verify cookies have httpOnly and secure flags
- [ ] Verify no sensitive data in error responses

## Compliance Notes

This application is designed for personal portfolio use. For business applications handling PII or payment data, additional measures would be required:
- GDPR compliance (data deletion, export)
- PCI-DSS compliance (payment processing)
- SOC 2 controls (enterprise security)

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by emailing the repository owner directly. Do not open public issues for security concerns.
