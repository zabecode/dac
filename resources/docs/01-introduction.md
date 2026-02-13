# Introdução

Bem-vindo à documentação da **API DAC** (Data Acquisition Controller). Esta API permite integrar dispositivos IoT, coletar leituras de sensores e gerenciar dados de aquisição em tempo real.

## Visão Geral

- **Autenticação**: Todas as requisições devem incluir uma API Key válida via `Authorization: Bearer`
- **Multi-tenancy**: Cada API Key possui um `identifier` que isola automaticamente os dados por cliente/empresa
- **Permissões**: Acesso granular por módulo (`devices`, `sensors`, `readings`)
- **Gateway**: Endpoints especializados para publicação em lote (upsert de dispositivos, batch de leituras)

## Base URL

```
https://seu-dominio.com/api/v1
```

## Formato de Resposta

Todas as respostas são retornadas em formato JSON.

**Sucesso:**

```json
{
  "data": { ... }
}
```

**Erro:**

```json
{
  "error": "Descrição do erro"
}
```

## Códigos HTTP

| Código | Significado                                   |
| ------ | --------------------------------------------- |
| 200    | Sucesso                                       |
| 201    | Recurso criado                                |
| 400    | Requisição inválida                           |
| 401    | Não autenticado (API Key inválida ou ausente) |
| 403    | Sem permissão para o módulo                   |
| 404    | Recurso não encontrado                        |
| 422    | Erro de validação                             |
| 429    | Rate limit excedido                           |
| 500    | Erro interno                                  |

## Recursos Disponíveis

| Recurso  | Base Path          | Permissão  | Descrição                          |
| -------- | ------------------ | ---------- | ---------------------------------- |
| Devices  | `/api/v1/devices`  | `devices`  | Dispositivos IoT (MAC, IP, meta)   |
| Sensors  | `/api/v1/sensors`  | `sensors`  | Sensores vinculados a dispositivos |
| Readings | `/api/v1/readings` | `readings` | Leituras de sensores               |
| Gateway  | `/api/v1/dac/...`  | Variável   | Publicação em lote (gateway)       |
