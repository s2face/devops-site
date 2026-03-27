# ТЗ для devops-writer: Урок 10 — SRE: SLIs, SLOs, Error Budgets

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 10 из 15 |
| **Тема** | SRE: SLIs, SLOs и Error Budgets |
| **Хэштеги** | `#sre` `#slo` `#sli` `#error-budget` `#reliability` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель поймёт принципы SRE, научится определять SLI/SLO для своих сервисов, рассчитывать Error Budget и реализует SLO-мониторинг в Prometheus/Grafana.

## Целевая аудитория
Senior DevOps / SRE-инженер.

## Пререквизиты
- Level 2 урок 14: Prometheus + Grafana, Level 3 урок 8: Observability

## Технический стек
- **Prometheus**, **Grafana**, **sloth** (SLO toolkit), **Google SRE Book**

## Требования к контенту
- [ ] SRE vs DevOps: роль и зона ответственности
- [ ] SLI (Service Level Indicator): что измеряем
- [ ] SLO (Service Level Objective): цель надёжности
- [ ] SLA (Service Level Agreement): контракт с пользователем
- [ ] Error Budget: как балансировать reliability и velocity
- [ ] Toil: рутина vs engineering work
- [ ] SLO-based alerting: Burn Rate алерты
- [ ] Sloth — генератор SLO правил для Prometheus

## Структура статьи

### H1: SRE в практике: SLI, SLO и Error Budget за один урок
### H2: Что такое SRE и чем он отличается от DevOps
### H2: SLI → SLO → SLA: иерархия надёжности
- Пример: availability SLI = (successful requests / total) * 100
### H2: Рассчитываем Error Budget
```
SLO = 99.9% availability
Error Budget = 100% - 99.9% = 0.1%
Месяц = 30 дней × 24ч × 60мин = 43,200 мин
Допустимый downtime = 43,200 × 0.001 = 43.2 минуты/месяц
```
### H2: Burn Rate алерты в Prometheus
```yaml
# alert: HighErrorBudgetBurnRate
expr: |
  (
    sum(rate(http_requests_total{status=~"5.."}[1h]))
    /
    sum(rate(http_requests_total[1h]))
  ) > 14.4 * (1 - 0.999)
```
### H2: Error Budget Policy: когда замораживать деплои
### H2: Sloth: декларативные SLO как код

## KPI качества
- Читатель определил SLI/SLO для своего сервиса
- Расчёт Error Budget в таблице: 99.9% / 99.95% / 99.99%
- Grafana-дашборд с burn rate и оставшимся Error Budget

## Антипаттерны
- ❌ SLO = 100% (невозможно и демотивирует)
- ❌ Alerting по наличию ошибок, а не по burn rate
- ❌ SLO без Error Budget Policy
