# ERP Platform --- Documento Maestro del Proyecto

**Versión:** 1.0\
**Fecha:** 22 de septiembre de 2026\
**Tipo de documento:** Arquitectura, alcance funcional, arquitectura
técnica, QA y gobierno de desarrollo\
**Estado:** Propuesta base para iniciar desarrollo

------------------------------------------------------------------------

# 1. Resumen ejecutivo

El proyecto consiste en desarrollar una **plataforma ERP empresarial
modular**, capaz de adaptarse a empresas de diferentes tamaños y
sectores.

La plataforma deberá cubrir progresivamente:

-   Gestión de empresas y sucursales.
-   Usuarios, roles y permisos.
-   Clientes y proveedores.
-   Productos y servicios.
-   CRM.
-   Ventas.
-   Compras.
-   Inventario.
-   Almacenes y WMS.
-   Finanzas y contabilidad.
-   Tesorería.
-   Proyectos.
-   Servicios.
-   Manufactura.
-   Recursos humanos.
-   POS.
-   Comercio electrónico.
-   BI y analítica.
-   Automatización.
-   Inteligencia artificial.

La arquitectura propuesta será:

> **Monolito modular + arquitectura orientada a eventos + API-first +
> multi-tenancy + auditoría + contratos estrictos + QA automatizado.**

No se recomienda comenzar con microservicios. El sistema tendrá límites
modulares claros para que un módulo pueda convertirse posteriormente en
un servicio independiente cuando exista una razón técnica o de escala.

------------------------------------------------------------------------

# 2. Objetivos del proyecto

## 2.1 Objetivo general

Construir un ERP moderno, modular, escalable y adaptable que permita
gestionar diferentes tipos de empresas desde una plataforma común.

## 2.2 Objetivos específicos

1.  Centralizar información empresarial.
2.  Reducir duplicidad de datos.
3.  Automatizar procesos.
4.  Proporcionar trazabilidad completa.
5.  Implementar permisos granulares.
6.  Soportar múltiples empresas y sucursales.
7.  Permitir operación web y móvil.
8.  Preparar funciones offline para procesos seleccionados.
9.  Integrar APIs y servicios externos.
10. Incorporar IA de manera segura.
11. Mantener una arquitectura que permita trabajar con múltiples IAs de
    desarrollo.
12. Establecer controles QA desde el primer módulo.
13. Permitir personalización sin modificar el núcleo.
14. Mantener una experiencia de usuario coherente entre módulos.

------------------------------------------------------------------------

# 3. Stack tecnológico

  -----------------------------------------------------------------------
  Capa                    Tecnología              Responsabilidad
  ----------------------- ----------------------- -----------------------
  Lenguaje principal      TypeScript              Frontend y backend

  Web                     React Native Web        ERP web

  Mobile                  React Native            Android/iOS

  Tooling                 Expo                    Desarrollo y
                                                  distribución

  Navegación              Expo Router             Navegación universal

  Android nativo          Kotlin                  Funciones nativas
                                                  específicas

  Backend                 Node.js                 Runtime

  API                     Express 5               REST API

  Base de datos           MongoDB Atlas           Persistencia principal

  Cache/locks             Redis                   Cache, rate limits,
                                                  locks y sesiones cuando
                                                  aplique

  Workers                 Node.js                 Procesos asíncronos

  Archivos                Object Storage          PDFs, XML, imágenes y
                                                  documentos

  Búsqueda                MongoDB Search          Búsqueda empresarial

  IA/RAG                  MongoDB Vector Search   Conocimiento y
                                                  recuperación semántica

  Contratos               OpenAPI                 Contrato de API

  Eventos                 Outbox + Event Bus      Comunicación asíncrona

  Offline                 SQLite                  Datos locales
                                                  seleccionados

  Contenedores            Docker                  Ejecución consistente

  CI/CD                   Pipeline automatizado   Build, pruebas y
                                                  despliegues

  Observabilidad          OpenTelemetry           Logs, métricas y trazas
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 4. Decisión arquitectónica principal

## 4.1 Monolito modular

El backend comenzará como un solo despliegue lógico, pero internamente
estará dividido en módulos independientes.

``` text
ERP API
├── IAM
├── Tenancy
├── CRM
├── Sales
├── Purchasing
├── Inventory
├── Finance
├── Projects
├── Service
├── Manufacturing
└── HR
```

Cada módulo tendrá:

-   dominio;
-   casos de uso;
-   repositorios;
-   API;
-   eventos;
-   pruebas;
-   políticas;
-   documentación.

## 4.2 Por qué no microservicios desde el inicio

Los microservicios añadirían inicialmente:

-   complejidad de despliegue;
-   observabilidad distribuida;
-   comunicación entre servicios;
-   consistencia distribuida;
-   mayor complejidad de QA;
-   mayor cantidad de infraestructura.

El ERP necesita primero reglas de negocio estables y límites modulares
claros.

Cuando un módulo necesite escalar o aislarse, podrá extraerse.

------------------------------------------------------------------------

# 5. Arquitectura general

``` text
┌──────────────────────────────────────────────────────────────┐
│                        EXPERIENCIA                           │
│                                                              │
│   Web ERP       Android/iOS       POS       Portal externo  │
│ React Native    React Native      React      React Native   │
│    Web                              Native       Web         │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │ API / EXPRESS │
                │               │
                │ Auth          │
                │ Tenant        │
                │ Permissions   │
                │ Validation    │
                │ Idempotency   │
                │ Audit Context │
                └───────┬───────┘
                        │
                        ▼
          ┌──────────────────────────────┐
          │       ERP APPLICATION        │
          │                              │
          │ IAM │ CRM │ SALES │ PURCHASE │
          │ WMS │ MRP │ FINANCE │ HR     │
          │ PROJECTS │ SERVICE │ POS     │
          └───────────────┬──────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         MongoDB       Redis     Object Storage
            Atlas
              │
              ▼
       Outbox / Events
              │
              ▼
          Workers
              │
       ┌──────┼───────┐
       ▼      ▼       ▼
     Email   PDFs   Integrations
```

------------------------------------------------------------------------

# 6. Estructura final del repositorio

Se recomienda utilizar un **monorepo**.

``` text
erp-platform/
│
├── apps/
│   ├── client/
│   │   ├── app/
│   │   ├── src/
│   │   ├── assets/
│   │   └── tests/
│   │
│   ├── api/
│   │   ├── src/
│   │   ├── tests/
│   │   └── migrations/
│   │
│   └── worker/
│       ├── src/
│       └── tests/
│
├── packages/
│   ├── ui/
│   ├── design-system/
│   ├── contracts/
│   ├── api-client/
│   ├── auth/
│   ├── permissions/
│   ├── validation/
│   ├── money/
│   ├── dates/
│   ├── localization/
│   ├── observability/
│   ├── testing/
│   └── config/
│
├── native/
│   └── android/
│       └── kotlin-modules/
│
├── infrastructure/
│   ├── docker/
│   ├── mongodb/
│   ├── redis/
│   ├── monitoring/
│   └── deployment/
│
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── api/
│   ├── modules/
│   ├── qa/
│   ├── security/
│   └── ai-work-orders/
│
├── scripts/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

------------------------------------------------------------------------

# 7. Frontend

La organización será por **dominio funcional**, no únicamente por tipo
de archivo.

``` text
apps/client/src/
│
├── core/
│   ├── auth/
│   ├── navigation/
│   ├── session/
│   ├── tenancy/
│   └── permissions/
│
├── features/
│   ├── dashboard/
│   ├── crm/
│   ├── sales/
│   ├── purchasing/
│   ├── inventory/
│   ├── finance/
│   ├── manufacturing/
│   ├── projects/
│   ├── service/
│   ├── hr/
│   └── settings/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── forms/
│   ├── tables/
│   ├── feedback/
│   └── utilities/
│
└── platform/
    ├── native/
    └── web/
```

------------------------------------------------------------------------

# 8. Web y móvil

No se debe forzar que cada pantalla sea idéntica en web y móvil.

## Web

Debe aprovechar:

-   teclado;
-   tablas grandes;
-   filtros;
-   multiselección;
-   exportación;
-   paneles;
-   navegación densa.

## Mobile

Debe priorizar:

-   lectura rápida;
-   cards;
-   búsqueda;
-   scanner;
-   acciones rápidas;
-   cámara;
-   operación de campo.

Se compartirán:

-   lógica;
-   modelos;
-   validaciones;
-   API client;
-   permisos;
-   componentes simples;
-   reglas de negocio de UI.

Se permitirán implementaciones específicas:

``` text
InventoryTable.web.tsx
InventoryTable.native.tsx
```

------------------------------------------------------------------------

# 9. Design System

``` text
packages/design-system/
│
├── tokens/
│   ├── spacing
│   ├── typography
│   ├── radius
│   ├── elevation
│   └── breakpoints
│
├── primitives/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Checkbox
│   ├── Modal
│   └── Tooltip
│
├── business/
│   ├── MoneyInput
│   ├── ProductSelector
│   ├── CustomerSelector
│   ├── WarehouseSelector
│   ├── TaxSelector
│   └── StatusBadge
│
└── patterns/
    ├── DataGrid
    ├── MasterDetail
    ├── Wizard
    ├── CommandPalette
    └── Timeline
```

Esto evitará que diferentes desarrolladores o IAs creen componentes
incompatibles.

------------------------------------------------------------------------

# 10. Backend

``` text
apps/api/src/
│
├── platform/
├── modules/
├── infrastructure/
├── shared/
└── bootstrap/
```

Cada módulo:

``` text
modules/sales/
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   ├── policies/
│   ├── events/
│   └── errors/
│
├── application/
│   ├── commands/
│   ├── queries/
│   ├── handlers/
│   └── dto/
│
├── infrastructure/
│   ├── repositories/
│   ├── mongodb/
│   ├── integrations/
│   └── jobs/
│
├── presentation/
│   ├── routes/
│   ├── controllers/
│   ├── schemas/
│   └── serializers/
│
└── tests/
```

------------------------------------------------------------------------

# 11. Flujo obligatorio del backend

``` text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Validation
     │
     ▼
Application Command / Query
     │
     ▼
Domain
     │
     ▼
Repository
     │
     ▼
MongoDB
```

No se permitirá:

``` text
Route → MongoDB
```

ni:

``` text
Controller → MongoDB
```

------------------------------------------------------------------------

# 12. Módulos Core

  Módulo          Función                  Prioridad
  --------------- ------------------------ -----------
  Tenant          Multiempresa             P0
  Organization    Estructura empresarial   P0
  Company         Empresa legal            P0
  Branch          Sucursales               P0
  Users           Usuarios                 P0
  Identity        Autenticación            P0
  IAM             Roles/permisos           P0
  Audit           Auditoría                P0
  Settings        Configuración            P0
  Numbering       Folios                   P0
  Workflow        Procesos                 P0
  Approvals       Aprobaciones             P0
  Rules           Reglas                   P0
  Notifications   Alertas                  P0
  Documents       Documentos               P0
  Search          Búsqueda                 P0
  Localization    País/idioma/fiscal       P0
  Import          Importación              P0
  Export          Exportación              P0
  Feature Flags   Funciones activables     P0
  Integration     Integraciones            P0
  Jobs            Trabajos asíncronos      P0
  Events          Eventos                  P0

------------------------------------------------------------------------

# 13. Módulos funcionales

  Área            Módulos
  --------------- ---------------------------------------
  CRM             Leads, oportunidades, actividades
  Ventas          Cotizaciones, pedidos, precios
  Compras         Requisiciones, RFQ, órdenes de compra
  Inventario      Stock, movimientos, lotes
  WMS             Ubicaciones, picking, packing
  Finanzas        GL, AR, AP
  Tesorería       Bancos y conciliaciones
  POS             Punto de venta
  Comercio        eCommerce y marketplaces
  Proyectos       Costos, tareas y recursos
  Servicios       Tickets y field service
  Manufactura     BOM, MRP y producción
  Calidad         Inspecciones
  Mantenimiento   Equipos y planes
  Activos         Activos fijos
  HR              Empleados
  Payroll         Nómina regional
  Documentos      Gestión documental
  BI              Indicadores
  IA              Agentes empresariales

------------------------------------------------------------------------

# 14. Dependencias funcionales

``` text
                    CORE
                     │
     ┌───────────────┼────────────────┐
     ▼               ▼                ▼
 MASTER DATA       FINANCE          WORKFLOW
     │               │                │
     ├───────┐       │        ┌───────┤
     ▼       ▼       ▼        ▼       ▼
   SALES   PURCHASE  BANK   PROJECT  SERVICE
     │       │
     └───┬───┘
         ▼
     INVENTORY
         │
    ┌────┴────┐
    ▼         ▼
   WMS       MRP
```

------------------------------------------------------------------------

# 15. Master Data

No se debe duplicar la información empresarial entre módulos.

No:

``` text
crm_customer
sales_customer
finance_customer
pos_customer
```

Sí:

``` text
Party
├── Customer
├── Supplier
├── Employee
└── Organization
```

## Entidades maestras

  Entidad             Compartida
  ----------------- ------------
  Party                       Sí
  Person                      Sí
  Organization                Sí
  Customer                    Sí
  Supplier                    Sí
  Product                     Sí
  Product Variant             Sí
  Unit                        Sí
  Currency                    Sí
  Tax                         Sí
  Location                    Sí
  Warehouse                   Sí
  Account                     Sí
  Employee                    Sí

------------------------------------------------------------------------

# 16. MongoDB Atlas

MongoDB será la base principal.

Aunque MongoDB tenga esquema flexible, el ERP **no utilizará esquemas
libres**.

Se utilizarán tres niveles de validación:

``` text
TypeScript
    ↓
Runtime Schema Validation
    ↓
MongoDB JSON Schema
```

Las colecciones críticas deberán tener validación de esquema.

------------------------------------------------------------------------

# 17. Multi-tenancy

Cada documento empresarial deberá incluir, cuando corresponda:

``` javascript
{
  _id,
  tenantId,
  companyId,
  branchId,
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
  version
}
```

## Estrategia

  Tipo de cliente       Estrategia
  --------------------- ------------------------
  Pequeño               Base compartida
  Mediano               Base compartida
  Grande                Base dedicada opcional
  Enterprise regulado   DB/cluster dedicado

No se recomienda crear una colección independiente por tenant dentro de
la misma base.

------------------------------------------------------------------------

# 18. Seguridad de tenant

Nunca se debe confiar únicamente en el frontend.

Una consulta debe tener contexto de tenant.

Conceptualmente:

``` javascript
productRepository.find({
  tenantId: context.tenantId,
  sku
})
```

Se recomienda crear repositorios conscientes del tenant para reducir la
posibilidad de que un desarrollador u otra IA olvide aplicar el filtro.

## Prueba obligatoria

``` text
Tenant A → intenta acceder a Tenant B
```

Resultado esperado:

``` text
DENIED
```

------------------------------------------------------------------------

# 19. Índices

Los índices críticos deberán considerar el tenant.

Ejemplos:

``` text
tenantId + sku
```

como único.

``` text
tenantId + companyId + invoiceNumber
```

como único.

Los índices deben definirse como parte del diseño de cada módulo.

------------------------------------------------------------------------

# 20. Manejo de dinero

No se utilizará `number` para lógica financiera sensible.

Se utilizará:

``` text
Decimal128
```

Modelo conceptual:

``` text
Money
├── amount: Decimal128
└── currency: MXN
```

Se deberá crear:

``` text
packages/money/
```

para centralizar:

-   sumas;
-   restas;
-   multiplicaciones;
-   redondeos;
-   impuestos;
-   conversiones;
-   comparaciones.

------------------------------------------------------------------------

# 21. Finanzas y contabilidad

Modelo:

``` text
JournalEntry
│
├── tenantId
├── companyId
├── fiscalPeriod
├── currency
├── source
├── sourceId
│
└── lines[]
    ├── accountId
    ├── debit
    ├── credit
    ├── costCenter
    └── dimensions
```

Regla:

``` text
Σ Debit = Σ Credit
```

Siempre.

------------------------------------------------------------------------

# 22. Inmutabilidad contable

Una póliza contabilizada no se elimina ni se modifica directamente.

``` text
Original
   │
   ▼
Reversal Entry
   │
   ▼
New Correct Entry
```

Esto mantiene la trazabilidad.

------------------------------------------------------------------------

# 23. Transacciones MongoDB

Las transacciones se utilizarán cuando varias operaciones tengan que ser
atómicas.

Ejemplo:

``` text
Invoice
+
Journal Entry
+
Outbox Event
```

pueden formar parte de una misma transacción lógica.

No se utilizarán transacciones gigantes para todo el ERP.

------------------------------------------------------------------------

# 24. Eventos

Ejemplo:

``` text
SalesOrderConfirmed
        │
        ├── Inventory reserves stock
        ├── Finance evaluates credit
        ├── CRM updates activity
        └── Analytics updates projection
```

Eventos propuestos:

``` text
sales.quote.created
sales.order.confirmed
sales.order.cancelled

inventory.stock.reserved
inventory.stock.released
inventory.stock.low

purchasing.order.approved
purchasing.goods.received

finance.invoice.posted
finance.payment.received

crm.opportunity.won
```

------------------------------------------------------------------------

# 25. Outbox Pattern

La aplicación guardará el cambio empresarial y su evento en una
operación consistente.

``` text
Mongo Transaction
│
├── Update SalesOrder
└── Insert OutboxEvent
             │
             ▼
          Worker
             │
             ▼
         Event Bus
```

Esto reduce el riesgo de:

``` text
Pedido guardado
pero evento perdido
```

------------------------------------------------------------------------

# 26. API

REST será la API principal.

Base:

``` text
/api/v1/
```

Ejemplos:

``` text
GET    /products
POST   /products

GET    /sales-orders/:id
POST   /sales-orders

POST   /sales-orders/:id/confirm
POST   /sales-orders/:id/cancel
```

No todo será CRUD.

Las operaciones de negocio importantes serán acciones explícitas:

``` text
confirm
cancel
approve
post
reverse
close
```

------------------------------------------------------------------------

# 27. Contrato de API

Respuesta estándar:

``` json
{
  "data": {},
  "meta": {},
  "traceId": "..."
}
```

Error estándar:

``` json
{
  "code": "INVENTORY_INSUFFICIENT",
  "message": "Insufficient inventory",
  "details": {},
  "traceId": "..."
}
```

Los contratos deberán documentarse mediante OpenAPI.

------------------------------------------------------------------------

# 28. Request Context

Cada solicitud deberá tener:

``` text
RequestContext
├── traceId
├── tenantId
├── userId
├── companyId
├── branchId
├── roles[]
├── permissions[]
├── locale
└── timezone
```

Este contexto acompañará la ejecución de la operación.

------------------------------------------------------------------------

# 29. Idempotencia

Las operaciones críticas deberán ser idempotentes.

Especialmente:

-   pagos;
-   facturación;
-   órdenes;
-   importaciones;
-   posting;
-   integraciones externas.

Ejemplo:

``` text
Idempotency-Key
```

Si el usuario pulsa dos veces:

``` text
COBRAR
```

no se deben crear dos pagos.

------------------------------------------------------------------------

# 30. Autorización

Se utilizará:

``` text
RBAC + políticas + scopes
```

Ejemplo:

``` text
Usuario:
Juan

Role:
Salesperson

Company:
Empresa A

Branch:
Puebla

Permissions:
sales.order.create

Restricted:
product.cost.view

Maximum discount:
10%
```

La autorización siempre debe ejecutarse en backend.

Ocultar un botón no es seguridad.

------------------------------------------------------------------------

# 31. Auditoría

Cada cambio sensible debe generar:

``` text
AuditEvent
├── tenantId
├── actorId
├── timestamp
├── action
├── entityType
├── entityId
├── before
├── after
├── requestId
├── traceId
├── ip
└── device
```

------------------------------------------------------------------------

# 32. Timeline empresarial

El usuario podrá visualizar:

``` text
Pedido #SO-1092

09:13 Creado por Laura
09:18 Descuento modificado
09:21 Aprobado por gerente
09:25 Stock reservado
11:52 Preparado
13:22 Enviado
```

La auditoría técnica contendrá información adicional.

------------------------------------------------------------------------

# 33. Workflow Engine

Modelo:

``` text
Trigger
   ↓
Condition
   ↓
Action
```

Ejemplo:

``` text
purchase.total > 50,000
        ↓
Require Manager Approval
```

Otro:

``` text
invoice.overdueDays > 30
        ↓
Create Collection Task
```

------------------------------------------------------------------------

# 34. Rules Engine

Separado del workflow.

Ejemplo:

``` text
IF
 customer.segment == wholesale
 AND quantity >= 50

THEN
 discount = 8%
```

Esto permitirá cambiar reglas sin reescribir módulos completos.

------------------------------------------------------------------------

# 35. Document Management

MongoDB almacenará metadatos.

El archivo se guardará en Object Storage.

``` text
Document
├── _id
├── tenantId
├── objectKey
├── filename
├── contentType
├── size
├── sha256
└── linkedEntity
```

------------------------------------------------------------------------

# 36. Búsqueda

MongoDB Search se utilizará para búsqueda empresarial.

El usuario podrá buscar:

``` text
Coca 600
```

y encontrar:

-   producto;
-   inventario;
-   ventas;
-   compras;
-   proveedor;
-   precios.

También:

``` text
FAC 100923
```

para encontrar directamente una factura.

------------------------------------------------------------------------

# 37. Command Palette

Se recomienda:

``` text
CTRL + K
```

Acciones:

``` text
Crear factura
Transferir inventario
Nuevo cliente
Abrir caja
Registrar pago
Crear cotización
```

Esto reducirá la navegación innecesaria.

------------------------------------------------------------------------

# 38. Inteligencia artificial

La IA será una capa separada:

``` text
AI Gateway
```

Agentes previstos:

``` text
ExecutiveAgent
FinanceAgent
SalesAgent
InventoryAgent
PurchasingAgent
CollectionsAgent
AuditAgent
SupportAgent
```

------------------------------------------------------------------------

# 39. Seguridad de IA

No:

``` text
LLM → MongoDB
```

Sí:

``` text
LLM
 │
 ▼
AI Gateway
 │
 ▼
Tool / ERP API
 │
 ▼
Authorization
 │
 ▼
Business Rules
 │
 ▼
Audit
 │
 ▼
Domain
```

La IA no deberá saltarse permisos.

------------------------------------------------------------------------

# 40. IA como asistente de negocio

Ejemplo:

> Compra lo que haga falta esta semana.

La IA puede:

1.  consultar demanda;
2.  revisar inventario;
3.  revisar órdenes abiertas;
4.  consultar proveedores;
5.  revisar lead times;
6.  preparar una propuesta.

Resultado:

``` text
27 órdenes propuestas
Valor estimado: $128,400
```

Pero una acción crítica deberá requerir la autorización definida por el
sistema.

------------------------------------------------------------------------

# 41. RAG

MongoDB Vector Search podrá utilizarse para:

-   políticas;
-   manuales;
-   contratos;
-   procedimientos;
-   SOP;
-   documentación interna;
-   preguntas frecuentes.

Los datos transaccionales deberán consultarse mediante herramientas/API
autorizadas.

No se deberá confiar únicamente en embeddings para datos financieros o
transaccionales.

------------------------------------------------------------------------

# 42. Kotlin

Kotlin será utilizado únicamente cuando se requiera una capacidad
nativa.

  Necesidad                                         Kotlin
  ------------------------------- ------------------------
  Pantalla normal                                       No
  Formulario                                            No
  API                                                   No
  Cámara estándar                        No necesariamente
  Bluetooth especializado               Sí, si se requiere
  Impresora POS                     Sí, si el SDK lo exige
  NFC                                   Sí, si se requiere
  SDK bancario Android                                  Sí
  Background Service avanzado                           Sí
  Administración de dispositivo                         Sí
  Hardware propietario                                  Sí

Arquitectura:

``` text
React Native
     │
     ▼
Native Module
     │
     ▼
Kotlin
     │
     ▼
Android API / Hardware
```

------------------------------------------------------------------------

# 43. Offline

Los módulos que pueden requerir operación offline:

-   POS;
-   inventarios;
-   almacén;
-   técnicos;
-   vendedores de campo.

Arquitectura:

``` text
React Native
     │
     ▼
Local SQLite
     │
     ▼
Sync Outbox
     │
 Internet
     │
     ▼
Sync API
     │
     ▼
ERP
```

------------------------------------------------------------------------

# 44. Qué puede funcionar offline

  Operación                               Offline
  -------------------------- --------------------
  Catálogo cacheado                            Sí
  Scan de inventario                           Sí
  Conteo físico                                Sí
  Field Service                                Sí
  Crear borrador de pedido                     Sí
  Venta                               Condicional
  Posting contable                             No
  Cierre fiscal                                No
  Cambio de permisos                           No
  Aprobación crítica           Preferiblemente no

------------------------------------------------------------------------

# 45. Sincronización

Cada operación offline tendrá:

``` text
operationId
deviceId
userId
tenantId
timestamp
payload
version
```

El servidor aplicará:

-   idempotencia;
-   detección de conflictos;
-   autorización;
-   validación;
-   resolución de versiones.

------------------------------------------------------------------------

# 46. Observabilidad

Cada solicitud deberá poder seguirse mediante:

``` text
Trace
 │
 ├── API
 ├── Sales
 ├── Inventory
 ├── MongoDB
 └── Worker
```

Se utilizarán:

-   logs estructurados;
-   métricas;
-   trazas;
-   seguimiento de errores;
-   auditoría;
-   medición de rendimiento.

------------------------------------------------------------------------

# 47. Seguridad

Controles mínimos:

  Control                    Requerido
  ------------------------ -----------
  TLS                               Sí
  MFA                               Sí
  Rate limiting                     Sí
  Input validation                  Sí
  CORS allowlist                    Sí
  Security headers                  Sí
  Secret manager                    Sí
  Encryption at rest                Sí
  Encryption in transit             Sí
  Dependency scanning               Sí
  SAST                              Sí
  DAST                              Sí
  Audit                             Sí
  Session revocation                Sí
  Brute-force protection            Sí

------------------------------------------------------------------------

# 48. QA

La calidad será parte de la arquitectura, no una actividad al final.

## Pirámide

``` text
                    E2E
                   /   \
              Integration
             /           \
         Contract       API
        /                  \
             UNIT TESTS
```

------------------------------------------------------------------------

# 49. Tipos de pruebas

  Nivel            Estrategia
  ---------------- -----------------------------------
  Unit             Vitest/Jest
  Domain           Unit tests
  API              Supertest
  DB integration   MongoDB de testing/Testcontainers
  Contract         OpenAPI
  Web E2E          Playwright
  Native E2E       Maestro/Detox
  Load             k6
  Security         SAST + DAST
  Accessibility    Automatizada + manual
  Visual           Pruebas visuales selectivas

------------------------------------------------------------------------

# 50. Métrica de calidad

La cobertura de código no será la única métrica.

La prioridad será probar invariantes empresariales.

## Finanzas

``` text
Debit = Credit
```

## Inventario

``` text
No duplicate serial
```

## Tenant

``` text
Tenant A cannot read Tenant B
```

## Documentos contabilizados

``` text
Posted document is immutable
```

## Pagos

``` text
Idempotency prevents duplicate payment
```

------------------------------------------------------------------------

# 51. QA Gates

Una tarea no estará terminada únicamente porque el código compile.

  Gate                     Obligatorio
  ---------------------- -------------
  Compila                           Sí
  TypeScript strict                 Sí
  Lint                              Sí
  Unit tests                        Sí
  Integration tests                 Sí
  Contract tests                    Sí
  Security checks                   Sí
  Tenant isolation                  Sí
  Audit validation                  Sí
  Migrations validated              Sí
  Documentation                     Sí
  Regression                        Sí

------------------------------------------------------------------------

# 52. Trabajo con múltiples IAs

El sistema deberá permitir que diferentes IAs trabajen en paralelo sin
modificar indiscriminadamente el proyecto.

Arquitectura de trabajo:

``` text
             PRODUCT / ARCHITECTURE
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Builder AI             Builder AI
      Module A               Module B
          │                     │
          └──────────┬──────────┘
                     ▼
                 REVIEW AI
                     │
                     ▼
                   QA AI
                     │
                     ▼
              Integration Gate
                     │
                     ▼
                   MAIN
```

Una IA que desarrolla una funcionalidad no debe ser la única instancia
que la valide.

------------------------------------------------------------------------

# 53. Work Order para IAs

Toda tarea deberá tener un contrato.

Ejemplo:

``` text
TASK: ERP-SALES-0142

Module:
Sales

Goal:
Confirm sales order

Can modify:
modules/sales/**
packages/contracts/sales/**

Cannot modify:
modules/inventory/**
modules/finance/**
platform/auth/**

Required event:
sales.order.confirmed.v1

Required permission:
sales.order.confirm

Tests:
S-101
S-102
S-103
S-104
```

------------------------------------------------------------------------

# 54. Entrega obligatoria de una IA

Cada IA deberá informar:

``` text
Objetivo:
...

Archivos modificados:
...

Arquitectura afectada:
...

Endpoints:
...

Colecciones:
...

Eventos:
...

Permisos:
...

Audit events:
...

Tests agregados:
...

Tests ejecutados:
...

Resultado:
...

Riesgos:
...

Migraciones:
...

Rollback:
...

Pendientes:
...
```

------------------------------------------------------------------------

# 55. Architecture Decision Records

Se deberán almacenar las decisiones importantes.

``` text
docs/adr/

ADR-0001-modular-monolith.md
ADR-0002-mongodb-multitenancy.md
ADR-0003-domain-events.md
ADR-0004-money-decimal128.md
ADR-0005-outbox.md
ADR-0006-permission-model.md
ADR-0007-offline-sync.md
```

Las IAs deberán consultar estos documentos antes de modificar
arquitectura.

------------------------------------------------------------------------

# 56. Definition of Done

Una funcionalidad estará terminada cuando tenga:

``` text
Código
+
Pruebas
+
Permisos
+
Auditoría
+
Manejo de errores
+
Loading states
+
Empty states
+
Responsive
+
Accessibility
+
Observabilidad
+
Documentación
```

------------------------------------------------------------------------

# 57. Roadmap

## P0 --- Plataforma

  Componente
  ---------------------
  Monorepo
  TypeScript strict
  Authentication
  Tenant
  Company
  Branch
  IAM
  Permissions
  Audit
  MongoDB conventions
  Transactions
  Event system
  Outbox
  API contract
  Error handling
  Logging
  Observability
  Design System
  Testing framework
  CI/CD

------------------------------------------------------------------------

## P1 --- ERP operativo

``` text
Master Data
Products
Customers
Suppliers

Sales
Purchasing

Inventory
Warehouses

Finance Core

Documents
Workflow
Approvals
Search
```

------------------------------------------------------------------------

## P2 --- Operación avanzada

``` text
CRM
POS
WMS
Projects
Service

Advanced Finance
Treasury
Assets
```

------------------------------------------------------------------------

## P3 --- Industrial y personas

``` text
Manufacturing
MRP
Quality
Maintenance

HR
Payroll

Commerce
Marketplaces
```

------------------------------------------------------------------------

## P4 --- Inteligencia

``` text
AI Agents
Forecasting
Advanced Analytics
Optimization
Recommendation Engines
```

------------------------------------------------------------------------

# 58. Estructura funcional final

``` text
ERP PLATFORM
│
├── 01 PLATFORM
│   ├── Identity
│   ├── Tenancy
│   ├── IAM
│   ├── Audit
│   ├── API
│   ├── Events
│   ├── Workflow
│   ├── Rules
│   ├── Search
│   ├── Documents
│   ├── Notifications
│   ├── Localization
│   ├── Imports
│   └── Integrations
│
├── 02 MASTER DATA
│   ├── Parties
│   ├── Customers
│   ├── Suppliers
│   ├── Products
│   ├── Units
│   ├── Taxes
│   ├── Locations
│   └── Warehouses
│
├── 03 COMMERCIAL
│   ├── CRM
│   ├── Sales
│   ├── Pricing
│   ├── Contracts
│   └── Subscriptions
│
├── 04 PROCUREMENT
│   ├── Requisitions
│   ├── RFQ
│   ├── Purchasing
│   └── Supplier Management
│
├── 05 SUPPLY CHAIN
│   ├── Inventory
│   ├── WMS
│   ├── Lots
│   ├── Serial Numbers
│   ├── Traceability
│   └── Logistics
│
├── 06 FINANCE
│   ├── General Ledger
│   ├── AR
│   ├── AP
│   ├── Banks
│   ├── Treasury
│   ├── Assets
│   ├── Budget
│   └── Consolidation
│
├── 07 MANUFACTURING
│   ├── BOM
│   ├── MRP
│   ├── Production
│   ├── Quality
│   └── Maintenance
│
├── 08 PROJECTS
│   ├── Projects
│   ├── Tasks
│   ├── Resources
│   ├── Timesheets
│   └── Project Accounting
│
├── 09 SERVICE
│   ├── Helpdesk
│   ├── SLA
│   ├── Field Service
│   └── Warranty
│
├── 10 PEOPLE
│   ├── HR
│   ├── Attendance
│   ├── Recruiting
│   ├── Expenses
│   └── Payroll
│
├── 11 COMMERCE
│   ├── POS
│   ├── Ecommerce
│   ├── B2B
│   └── Marketplace
│
├── 12 INTELLIGENCE
│   ├── Dashboards
│   ├── BI
│   ├── Forecast
│   ├── Alerts
│   └── AI Agents
│
└── 13 ECOSYSTEM
    ├── API
    ├── Webhooks
    ├── Apps
    ├── Connectors
    └── Marketplace
```

------------------------------------------------------------------------

# 59. Reglas arquitectónicas no negociables

    \# Regla
  ---- --------------------------------------------------------------
     1 TypeScript estricto en todo JS/TS nuevo
     2 Ningún controller accede directamente a DB
     3 Cada módulo es propietario de sus datos
     4 Un módulo no modifica directamente la DB de otro
     5 `tenantId` es obligatorio donde corresponda
     6 La autorización siempre se ejecuta en backend
     7 Operaciones críticas deben ser idempotentes
     8 Finanzas utilizan precisión decimal
     9 Documentos contabilizados son inmutables
    10 Correcciones contables se realizan mediante reversas
    11 Toda operación sensible genera auditoría
    12 Cada módulo publica contratos
    13 Comunicación entre módulos mediante servicios/eventos
    14 Las personalizaciones no modifican el core
    15 APIs versionadas
    16 Eventos versionados
    17 Las IAs no tienen acceso indiscriminado a MongoDB
    18 Ninguna IA valida sola su propio trabajo
    19 Un cambio sin pruebas no está terminado
    20 Una funcionalidad sin permisos y auditoría no está terminada

------------------------------------------------------------------------

# 60. Principios derivados de la investigación de ERP

La arquitectura responde a problemas observados en diferentes
plataformas ERP:

  -----------------------------------------------------------------------
  Problema                            Respuesta de nuestro ERP
  ----------------------------------- -----------------------------------
  Interfaces demasiado complejas      Design System + navegación
                                      contextual

  Exceso de configuración             Defaults + configuración progresiva

  Implementaciones largas             Modularidad + templates

  Personalizaciones difíciles         Extension points

  Datos duplicados                    Master Data central

  Falta de trazabilidad               Audit + Timeline

  Errores financieros                 Decimal128 + invariantes

  Dependencias entre módulos          Domain boundaries

  Integraciones frágiles              API + Events + Outbox

  Sistemas poco móviles               React Native

  Operación sin conexión limitada     Offline Sync selectivo

  Problemas de permisos               RBAC + policies + scopes

  IA insegura                         AI Gateway + herramientas
                                      autorizadas

  Cambios de IA difíciles de revisar  Work Orders + QA Gates

  Búsqueda complicada                 Search global

  Reportes dispersos                  BI + read models

  Actualizaciones peligrosas          Versionado + CI/CD + migraciones
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 61. Criterio final del proyecto

El ERP no debe construirse como una colección de pantallas.

Debe construirse como:

``` text
PLATAFORMA
    +
DATOS MAESTROS
    +
REGLAS EMPRESARIALES
    +
PROCESOS
    +
AUDITORÍA
    +
PERMISOS
    +
EVENTOS
    +
INTEGRACIONES
    +
ANALÍTICA
    +
IA
```

La interfaz será la representación de estos procesos.

------------------------------------------------------------------------

# 62. Arquitectura final resumida

``` text
                   ERP PLATFORM
                         │
       ┌─────────────────┼──────────────────┐
       ▼                 ▼                  ▼
 EXPERIENCE           BUSINESS           DATA
       │                 │                  │
 React Native       Modular Domain      MongoDB Atlas
 React Native Web   Services            Redis
 Expo               Workflows           Object Storage
       │            Rules
       │            Events
       │
       └───────────────┬──────────────────┘
                       ▼
                 API / EXPRESS
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
          Auth       Tenant      IAM
            │          │          │
            └──────────┼──────────┘
                       ▼
                 APPLICATION
                       │
            ┌──────────┼───────────┐
            ▼          ▼           ▼
          Sales    Inventory     Finance
            │          │           │
            └──────────┼───────────┘
                       ▼
                    EVENTS
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
           Workers     AI     Analytics
```

------------------------------------------------------------------------

# 63. Estado objetivo

El objetivo final es tener un ERP que permita:

-   comenzar con una empresa pequeña;
-   crecer a múltiples sucursales;
-   soportar múltiples empresas;
-   operar desde navegador;
-   operar desde Android/iOS;
-   funcionar offline donde tenga sentido;
-   integrarse con sistemas externos;
-   manejar procesos financieros auditables;
-   incorporar manufactura y logística;
-   permitir personalizaciones;
-   utilizar IA de forma controlada;
-   permitir desarrollo paralelo por varias IAs;
-   mantener pruebas automatizadas;
-   escalar módulos específicos sin reconstruir todo el sistema.

La prioridad no será tener la mayor cantidad posible de módulos
rápidamente.

La prioridad será construir **un núcleo sólido**, sobre el cual los
módulos puedan crecer sin deteriorar la plataforma.
