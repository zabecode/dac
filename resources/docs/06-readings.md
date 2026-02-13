# Leituras

Endpoints para coleta e gerenciamento de leituras de sensores. Requer permissão `readings`.

## Listar Leituras

```
GET /api/v1/readings
```

**Resposta:**

```json
{
  "data": [
    {
      "id": 1,
      "identifier": "empresa-x",
      "sensorId": 1,
      "uniqueId": 100001,
      "value": 23.5,
      "kind": "unique",
      "entry": "automatic",
      "opened": false,
      "grouping": "lote-2025-01",
      "datetime": "2025-01-15T10:30:00.000Z",
      "openedAt": null,
      "closedAt": null,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

## Obter Leitura

```
GET /api/v1/readings/:id
```

## Criar Leitura

```
POST /api/v1/readings
```

**Body:**

```json
{
  "sensorId": 1,
  "uniqueId": 100001,
  "value": 23.5,
  "kind": "unique",
  "datetime": "2025-01-15T10:30:00.000Z",
  "opened": false,
  "grouping": "lote-2025-01",
  "openedAt": null,
  "closedAt": null
}
```

| Campo      | Tipo       | Requerido | Descrição                                     |
| ---------- | ---------- | --------- | --------------------------------------------- |
| `sensorId` | number     | ✅        | ID do sensor                                  |
| `value`    | any        | ✅        | Valor da leitura (string, number, boolean...) |
| `datetime` | date (ISO) | ✅        | Data/hora da leitura                          |
| `uniqueId` | number     | ❌        | ID único para upsert (gateway)                |
| `kind`     | string     | ❌        | Tipo de leitura (máx. 20 chars)               |
| `opened`   | boolean    | ❌        | Se a leitura está "aberta"                    |
| `grouping` | string     | ❌        | Grupo/lote (máx. 50 chars)                    |
| `openedAt` | date (ISO) | ❌        | Data de abertura                              |
| `closedAt` | date (ISO) | ❌        | Data de fechamento                            |

### Tipos de Leitura (`kind`)

| Valor      | Descrição              |
| ---------- | ---------------------- |
| `unique`   | Leitura única (padrão) |
| `multiple` | Leitura múltipla       |
| `custom`   | Tipo personalizado     |

### Tipos de Entrada (`entry`)

| Valor       | Descrição                    |
| ----------- | ---------------------------- |
| `automatic` | Entrada automática (gateway) |
| `manual`    | Entrada manual               |
| `scheduled` | Entrada agendada             |
| `edit`      | Edição de leitura existente  |

## Atualizar Leitura

```
PUT /api/v1/readings/:id
```

| Campo      | Tipo       | Descrição          |
| ---------- | ---------- | ------------------ |
| `value`    | any        | Novo valor         |
| `opened`   | boolean    | Status de abertura |
| `grouping` | string     | Grupo/lote         |
| `openedAt` | date (ISO) | Data de abertura   |
| `closedAt` | date (ISO) | Data de fechamento |

## Excluir Leitura

```
DELETE /api/v1/readings/:id
```

---

## Gateway: Publicação em Lote

Endpoint especializado para gateways e automações. Permite enviar múltiplas leituras em uma única requisição com lógica de **upsert** via `uniqueId`.

```
POST /api/v1/dac/readings/batch
```

**Body:**

```json
{
  "readings": [
    {
      "sensorId": 1,
      "uniqueId": 100001,
      "value": 23.5,
      "datetime": "2025-01-15T10:30:00.000Z",
      "kind": "unique",
      "grouping": "lote-2025-01"
    },
    {
      "sensorId": 1,
      "uniqueId": 100002,
      "value": 24.1,
      "datetime": "2025-01-15T10:31:00.000Z"
    },
    {
      "sensorId": 2,
      "value": true,
      "datetime": "2025-01-15T10:30:00.000Z",
      "opened": true,
      "openedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Comportamento:**

- Se `uniqueId` é fornecido e já existe para o identifier, **atualiza** a leitura existente
- Caso contrário, **cria** uma nova leitura com `entry: "automatic"`
- Erros individuais não interrompem o lote

**Resposta:**

```json
{
  "created": 2,
  "updated": 1,
  "errors": 0
}
```
