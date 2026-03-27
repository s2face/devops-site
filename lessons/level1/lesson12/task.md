# ТЗ для devops-writer: Урок 12 — Systemd: управление службами

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 1 — Beginner |
| **Номер урока** | 12 из 15 |
| **Тема** | Systemd: управление службами Linux |
| **Хэштеги** | `#systemd` `#linux` `#services` `#daemon` `#journald` |
| **Объём** | 1800–2200 слов |

## Цель урока
Читатель научится управлять системными службами через systemctl, создавать собственные unit-файлы и анализировать систему через journald.

## Целевая аудитория
Начинающие DevOps/сисадмины.

## Пререквизиты
- Уроки 3–4: Bash и пользователи

## Технический стек
- **Systemd:** systemctl, journalctl, systemd-analyze
- **Unit-файлы:** /etc/systemd/system/

## Требования к контенту
- [ ] Что такое init-система и зачем нужен systemd
- [ ] Базовые команды: `systemctl start/stop/restart/status`
- [ ] `systemctl enable/disable` — автозапуск
- [ ] Анатомия unit-файла: [Unit], [Service], [Install]
- [ ] Создание собственного сервиса из Bash-скрипта
- [ ] `journalctl` — просмотр логов сервисов
- [ ] `systemd-analyze blame` — анализ времени загрузки
- [ ] Targets (runlevels): multi-user.target, graphical.target

## Структура статьи

### H1: Systemd: управляем сервисами как профи
### H2: Что такое systemd и зачем он заменил SysVinit
### H2: Управление сервисами через systemctl
```bash
sudo systemctl status nginx
sudo systemctl start nginx
sudo systemctl enable nginx  # запуск при загрузке
sudo systemctl reload nginx  # перечитать конфиг без перезапуска
```
### H2: Анатомия unit-файла
```ini
[Unit]
Description=My Custom DevOps Service
After=network.target

[Service]
Type=simple
User=devops
ExecStart=/usr/local/bin/myapp
Restart=always

[Install]
WantedBy=multi-user.target
```
### H2: Создаём свой сервис — пример с Python-приложением
### H2: Логи через journalctl
```bash
journalctl -u nginx -f          # следить за логами nginx
journalctl --since "1 hour ago" # логи за последний час
journalctl -p err               # только ошибки
```
### H2: Анализ загрузки системы

## KPI качества
- Полный пример unit-файла с пояснением каждой строки
- Таблица: команды systemctl и их аналоги в SysVinit
- Читатель создал собственный работающий сервис

## Антипаттерны
- ❌ Запуск приложений под root без необходимости
- ❌ `Type=forking` без понимания что это
- ❌ Игнорирование `Restart=` для production-сервисов
