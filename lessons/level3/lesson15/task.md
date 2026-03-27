# ТЗ для devops-writer: Урок 15 — DevSecOps: безопасность в CI/CD

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 15 из 15 |
| **Тема** | DevSecOps: встраиваем безопасность в CI/CD пайплайн |
| **Хэштеги** | `#devsecops` `#security` `#cicd` `#sast` `#dast` `#trivy` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель выстроит полноценный DevSecOps пайплайн: SAST, SCA, DAST, сканирование образов, IaC-анализ и управление секретами в CI/CD.

## Целевая аудитория
Senior DevOps / Security Engineer.

## Пререквизиты
- Level 2 уроки 11–12: GitHub Actions, GitLab CI, Level 3 урок 7: Vault

## Технический стек
- **SAST:** Semgrep, Bandit, SonarQube
- **SCA:** OWASP Dependency-Check, Snyk
- **Container scan:** Trivy, Grype
- **IaC scan:** Checkov, tfsec
- **DAST:** OWASP ZAP
- **Secrets:** gitleaks, detect-secrets

## Требования к контенту
- [ ] Shift Left Security: безопасность с самого начала
- [ ] SAST (Static Analysis): анализ кода без запуска
- [ ] SCA (Software Composition Analysis): уязвимые зависимости
- [ ] Container scanning: Trivy в CI
- [ ] IaC Security: Checkov для Terraform и K8s манифестов
- [ ] Secret detection: gitleaks для pre-commit и CI
- [ ] DAST (Dynamic Analysis): OWASP ZAP
- [ ] Security Gates: блокировка пайплайна при critical уязвимостях

## Структура статьи

### H1: DevSecOps: безопасность без тормозов в CI/CD
### H2: Shift Left: почему дешевле найти ошибку в PR чем в production
### H2: Полный DevSecOps пайплайн
```yaml
# GitHub Actions: DevSecOps pipeline
jobs:
  sast:
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep SAST
        uses: semgrep/semgrep-action@v1
        with:
          config: auto

  sca:
    steps:
      - name: Snyk SCA
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  container-scan:
    needs: [sast, sca]
    steps:
      - name: Build image
        run: docker build -t $IMAGE .
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.IMAGE }}
          severity: CRITICAL,HIGH
          exit-code: 1

  iac-scan:
    steps:
      - name: Checkov IaC scan
        uses: bridgecrewio/checkov-action@master
        with:
          directory: terraform/
          framework: terraform

  secret-scan:
    steps:
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
```
### H2: Security Gates — как блокировать неблагонадёжный код
### H2: Pre-commit hooks: безопасность до push
### H2: Отчёты и метрики безопасности в дашборде

## KPI качества
- Полный DevSecOps GitHub Actions workflow (5 стадий)
- Pre-commit конфигурация: gitleaks + detect-secrets
- Таблица: инструмент | тип | что проверяет | как интегрировать

## Антипаттерны
- ❌ Security scan только при деплое в production
- ❌ Ignore all findings без triaging
- ❌ DAST без staging environment (нельзя в production)
- ❌ Секреты в переменных окружения CI без rotation
