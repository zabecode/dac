# Dispositivos

Endpoints para gerenciamento de dispositivos IoT. Requer permissão `devices`.

## Listar Dispositivos

```
GET /api/v1/devices
```

**Resposta:**

```json
{
  "data": [
    {
      "id": 1,
      "identifier": "empresa-x",
      "mac": "AA:BB:CC:DD:EE:FF",
      "lastIp": "192.168.1.100",
      "active": true,
      "description": "Gateway principal",
      "metadata": { "metrics": { "uptime": 99.9 } },
      "lastConnectionAt": "2025-01-15T10:30:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

## Obter Dispositivo

```
GET /api/v1/devices/:id
```

## Criar Dispositivo

```
POST /api/v1/devices
```

**Body:**

```json
{
  "mac": "AA:BB:CC:DD:EE:FF",
  "lastIp": "192.168.1.100",
  "active": true,
  "description": "Sensor de temperatura",
  "metadata": { "location": "Sala 1" }
}
```

| Campo         | Tipo    | Requerido | Descrição                    |
| ------------- | ------- | --------- | ---------------------------- |
| `mac`         | string  | ✅        | Endereço MAC (máx. 17 chars) |
| `lastIp`      | string  | ❌        | Endereço IP (máx. 45 chars)  |
| `active`      | boolean | ❌        | Status ativo (padrão: true)  |
| `description` | string  | ❌        | Descrição (máx. 255 chars)   |
| `metadata`    | object  | ❌        | Dados adicionais em JSON     |

## Atualizar Dispositivo

```
PUT /api/v1/devices/:id
```

Aceita os mesmos campos do `POST`, todos opcionais.

## Excluir Dispositivo

```
DELETE /api/v1/devices/:id
```

---

## Gateway: Publicar Dispositivo

Endpoint especializado para gateways. Realiza **upsert** (cria ou atualiza) de um dispositivo e seus sensores com base no MAC address.

```
POST /api/v1/dac/devices/publish
```

**Body:**

```json
{
  "device": {
    "mac": "AA:BB:CC:DD:EE:FF",
    "ip": "192.168.1.100",
    "metrics": {
      "uptime": 99.9,
      "freeMemory": 1024
    }
  },
  "sensors": [
    {
      "code": 101,
      "name": "Temperatura Ambiente",
      "description": "Sensor DS18B20",
      "kind": "modbus",
      "metric": "temperature",
      "meta": { "unit": "°C", "precision": 2 }
    },
    {
      "code": 102,
      "name": "Umidade Relativa",
      "kind": "mqtt",
      "metric": "humidity",
      "meta": { "unit": "%" }
    }
  ]
}
```

**Comportamento:**

- Se o dispositivo com o MAC já existe para o identifier, **atualiza** IP, métricas e `lastConnectionAt`
- Se não existe, **cria** o dispositivo
- Para cada sensor no array, busca por `code + identifier + deviceId`:
  - Se existe, **atualiza** métricas e `lastConnectionAt`
  - Se não existe, **cria** o sensor

**Resposta:**

```json
{
  "success": true,
  "deviceId": 1
}
```
