# Technical Base: Docker Registry — Image Storage and Distribution

## 1. Why a Private Registry?

### Security and Isolation
- **Network Privacy:** Images remain within the corporate VPC/VPN.
- **Access Control:** Granular RBAC (Role-Based Access Control) instead of "all or nothing" in public hubs.
- **Scanning:** Internal vulnerability scanning before images reach production.

### Speed and Reliability
- **Latency:** Pulling images from a local network is significantly faster than from Docker Hub.
- **Bandwidth:** Saves external traffic costs.
- **Availability:** No dependency on Docker Hub uptime or rate limits.

### Compliance and Control
- **Data Sovereignty:** Keeping images on-premise or in a specific cloud region for regulatory reasons.
- **Lifecycle Management:** Custom retention policies (e.g., delete images older than 30 days).

---

## 2. Deployment: `registry:2` via Docker Compose

### Directory Structure
```text
registry/
├── docker-compose.yml
├── auth/
│   └── htpasswd
├── certs/
│   ├── domain.crt
│   └── domain.key
└── data/
```

### `docker-compose.yml`
```yaml
services:
  registry:
    image: registry:2
    restart: always
    ports:
      - "443:5000"
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: "Registry Realm"
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
      REGISTRY_HTTP_TLS_KEY: /certs/domain.key
      REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /var/lib/registry
    volumes:
      - ./data:/var/lib/registry
      - ./auth:/auth
      - ./certs:/certs
```

---

## 3. TLS and Basic Auth Setup

### Step 1: Generate Basic Auth
```bash
mkdir auth
docker run --entrypoint htpasswd httpd:2.4 -Bbn user password > auth/htpasswd
```

### Step 2: Generate Self-Signed TLS (For Testing)
```bash
mkdir certs
openssl req -newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
  -x509 -days 365 -out certs/domain.crt \
  -subj "/CN=myregistry.local"
```
*Note: For production, use Let's Encrypt or corporate CA.*

---

## 4. Push/Pull Images

### Login
```bash
docker login myregistry.local:443 -u user -p password
```

### Tag and Push
```bash
# Build local image
docker build -t my-app:v1 .

# Tag for private registry
docker tag my-app:v1 myregistry.local:443/my-app:v1

# Push
docker push myregistry.local:443/my-app:v1
```

### Pull
```bash
docker pull myregistry.local:443/my-app:v1
```

---

## 5. Harbor: Enterprise-Grade Registry

### Key Features
- **RBAC:** Projects with different access levels for teams.
- **Vulnerability Scanning:** Integrated Trivy or Clair to scan images on push.
- **Content Trust:** Signing images with Notary.
- **Replication:** Syncing images between different registries (e.g., Harbor to ECR).
- **Helm Chart Repository:** Harbor acts as a Helm repo too.

### When to choose Harbor?
When you need more than just storage: audit logs, multi-tenancy, and security compliance.

---

## 6. Cloud Registries Comparison

| Feature | GHCR (GitHub) | AWS ECR | GitLab Registry |
|---------|---------------|---------|-----------------|
| **Integration** | Best for GitHub Actions | Best for EKS/ECS/Fargate | Best for GitLab CI |
| **Pricing** | Free for public, paid for private | Pay-per-GB storage/transfer | Part of GitLab tiers |
| **IAM** | GitHub PAT / Actions Token | AWS IAM Roles/Policies | GitLab Deploy Tokens |
| **Ease of Use** | Very High | Medium (IAM is complex) | High |

---

## 7. Registry Integration in CI

### GitHub Actions (Push to GHCR)
```yaml
name: Build and Push
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Log in to GHCR
        run: echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
      - name: Build and push
        run: |
          docker build -t ghcr.io/${{ github.repository }}/app:${{ github.sha }} .
          docker push ghcr.io/${{ github.repository }}/app:${{ github.sha }}
```

### GitLab CI (Push to GitLab Registry)
```yaml
build-image:
  image: docker:20.10.16
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

---

## 8. Best Practices & Anti-patterns

### Best Practices
- **Immutable Tags:** Use Git SHAs or Semantic Versioning instead of `latest`.
- **Cleanup Policies:** Automate deletion of old "feature-branch" images.
- **Layer Optimization:** Keep images small to speed up distribution.
- **Monitoring:** Track disk usage and pull rates of your registry.

### Anti-patterns
- ❌ **No TLS/Auth:** Running a registry on the open internet without protection.
- ❌ **Disk Full:** Forgetting to purge old layers, leading to registry downtime.
- ❌ **Bloated Images:** Including dev dependencies or secrets in images.
- ❌ **Manual Pushes:** Pushing images to production registry from a developer's laptop instead of CI.
