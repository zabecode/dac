# Sensores

Endpoints para gerenciamento de sensores IoT. Requer permissão `sensors`.

## Listar Sensores

```
GET /api/v1/sensors
```

**Resposta:**

```json
{
  "data": [
    {
      "id": 1,
      "identifier": "empresa-x",
      "deviceId": 1,
      "code": 101,
      "name": "Temperatura Ambiente",
      "description": "Sensor DS18B20",
      "active": true,
      "kind": "modbus",
      "metadata": { "metric": "temperature", "meta": { "unit": "°C" } },
      "lastConnectionAt": "2025-01-15T10:30:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

## Obter Sensor

```
GET /api/v1/sensors/:id
```

## Criar Sensor

```
POST /api/v1/sensors
```

**Body:**

```json
{
  "deviceId": 1,
  "code": 101,
  "name": "Temperatura Ambiente",
  "description": "Sensor DS18B20",
  "active": true,
  "kind": "modbus",
  "metadata": { "unit": "°C" }
}
```

| Campo         | Tipo    | Requerido | Descrição                       |
| ------------- | ------- | --------- | ------------------------------- |
| `deviceId`    | number  | ✅        | ID do dispositivo pai           |
| `code`        | number  | ✅        | Código numérico único (mín. 1)  |
| `name`        | string  | ✅        | Nome do sensor (máx. 100 chars) |
| `description` | string  | ❌        | Descrição (máx. 180 chars)      |
| `active`      | boolean | ❌        | Status ativo (padrão: true)     |
| `kind`        | string  | ❌        | Tipo do sensor (máx. 30 chars)  |
| `metadata`    | object  | ❌        | Dados adicionais em JSON        |

### Tipos de Sensor (`kind`)

| Valor    | Descrição                   |
| -------- | --------------------------- |
| `modbus` | Sensor via protocolo Modbus |
| `mqtt`   | Sensor via protocolo MQTT   |
| `http`   | Sensor via requisições HTTP |
| `custom` | Tipo personalizado (padrão) |

## Atualizar Sensor

```
PUT /api/v1/sensors/:id
```

Aceita os mesmos campos do `POST`, todos opcionais.

## Excluir Sensor

```
DELETE /api/v1/sensors/:id
```
