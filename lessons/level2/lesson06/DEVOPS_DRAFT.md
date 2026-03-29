# ConfigMaps и Secrets: конфигурация приложений в Kubernetes

В современной облачной разработке отделение конфигурации от кода является фундаментальным принципом. Kubernetes предоставляет для этого два мощных инструмента: **ConfigMaps** и **Secrets**. В этой статье мы разберем, как эффективно управлять настройками приложений, соблюдая лучшие практики DevOps и безопасности.

## Принцип 12-factor: конфиг отдельно от кода

Согласно методологии **12-factor app**, конфигурация приложения (все, что может меняться между развертываниями: адреса БД, API-ключи, порты) должна храниться в переменных окружения.

**Почему это важно?**
1. **Портабельность:** Один и тот же образ контейнера работает в Dev, Staging и Production.
2. **Безопасность:** Секреты не попадают в систему контроля версий (Git).
3. **Гибкость:** Изменение настроек не требует пересборки приложения.

Kubernetes реализует этот принцип через объекты конфигурации, которые "подмешиваются" в Pod во время его запуска.

---

## ConfigMap — конфигурация без секретов

**ConfigMap** предназначен для хранения неконфиденциальных данных в формате "ключ-значение". Это могут быть как отдельные параметры, так и целые файлы конфигурации (например, `nginx.conf`).

### Создание ConfigMap

#### 1. Императивный подход (через kubectl)
Удобен для быстрого создания из локальных файлов или литералов:
```bash
# Из литералов
kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info

# Из файла
kubectl create configmap nginx-config --from-file=nginx.conf
```

#### 2. Декларативный подход (YAML)
Рекомендуется для промышленной эксплуатации и GitOps:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  APP_ENV: production
  LOG_LEVEL: info
  database.properties: |
    db.host=postgres-service
    db.port=5432
    db.user=admin
```

---

## Монтирование ConfigMap в Pod

Существует два основных способа доставить данные из ConfigMap в контейнер.

### 1. Как переменные окружения (Env Vars)
Подходит для простых параметров.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
    - name: app-container
      image: my-app:1.0
      env:
        # Выборочно берем ключ
        - name: ENVIRONMENT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_ENV
      # Или загружаем все ключи сразу
      envFrom:
        - configMapRef:
            name: app-config
```

### 2. Как Volume (файлы)
Используется для конфигурационных файлов. Kubernetes создаст в указанной директории файлы, имена которых соответствуют ключам в ConfigMap.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
    - name: app-container
      image: my-app:1.0
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: app-config
        items:
        - key: database.properties
          path: db.properties
```

---

## Secret — конфиденциальные данные

**Secret** похож на ConfigMap, но предназначен для хранения чувствительной информации: паролей, токенов, сертификатов.

### Типы секретов
1. **Opaque:** (по умолчанию) произвольные данные "ключ-значение".
2. **kubernetes.io/tls:** для хранения TLS-сертификатов и ключей.
3. **kubernetes.io/dockerconfigjson:** учетные данные для Docker Registry.

### Создание и base64-кодирование
Данные в манифесте Secret (поле `data`) должны быть закодированы в base64. Это **не шифрование**, а лишь кодирование для поддержки бинарных данных.

```bash
echo -n 'my-super-secret' | base64
# Вывод: bXktc3VwZXItc2VjcmV0
```

Пример манифеста:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
# data требует base64
data:
  DB_PASSWORD: bXktc3VwZXItc2VjcmV0
# stringData позволяет писать открытым текстом (K8s закодирует сам)
stringData:
  DB_USER: admin
```

### Монтирование Secret в Pod
Аналогично ConfigMap, секреты можно монтировать через `env` или `volumes`.

```yaml
      env:
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DB_PASSWORD
```

---

## Обновление ConfigMap и поведение Pod

Один из самых важных нюансов эксплуатации:

1. **Переменные окружения:** Если вы измените ConfigMap, значения переменных в запущенном Pod **не изменятся**. Для обновления потребуется перезапуск Pod (например, через `kubectl rollout restart deployment`).
2. **Volumes:** Kubernetes периодически синхронизирует содержимое томов (обычно до 1 минуты). Файлы внутри контейнера обновятся "на лету", но само приложение должно уметь перечитывать конфиг без перезагрузки (Hot Reload).

**Совет:** Для автоматизации перезагрузки Pod при изменении конфигов часто используют инструменты вроде **Reloader** или добавляют хэш конфигурации в аннотации Pod в Helm-чартах.

---

## Почему встроенные Secrets небезопасны — и что с этим делать

Многие новички ошибочно полагают, что использование Secret гарантирует безопасность. Однако:
1. **Хранение в etcd:** По умолчанию данные в etcd хранятся в открытом виде (plaintext). Если злоумышленник получит доступ к etcd, он увидит все секреты.
2. **Base64:** Это не защита. Любой, у кого есть доступ к API (и права на чтение секретов), может легко их декодировать.
3. **RBAC:** Доступ к секретам часто слишком широк внутри кластера.

### Что делать? (Preview для Level 3)
* **Encryption at Rest:** Включите шифрование данных в etcd на уровне провайдера или KMS.
* **External Secrets / Secrets Store CSI Driver:** Интегрируйте K8s с внешними хранилищами, такими как **HashiCorp Vault**, AWS Secrets Manager или Azure Key Vault. Секреты будут доставляться в Pod динамически, не оставляя следов в etcd.

---

## Итоговые рекомендации и антипаттерны

| ✅ Best Practices | ❌ Антипаттерны |
| :--- | :--- |
| Используйте `stringData` для удобства в YAML | Хранение паролей в ConfigMap |
| Ограничивайте доступ к Secrets через RBAC | Коммит YAML с секретами в Git |
| Используйте разные ConfigMap для разных окружений | Использование одного гигантского ConfigMap для всего |
| Проверяйте размер ConfigMap (лимит 1MB) | Зависимость приложения от авто-обновления файлов в Volume |

Этот технический базис поможет вам построить надежную и гибкую систему конфигурации для ваших приложений в Kubernetes.
