# Análisis de SQL para Introspección (Prisma Pull)

Dado que se optará por ejecutar el SQL directamente y luego introspeccionar la base de datos (`prisma db pull`), el análisis se centra en la compatibilidad del SQL con la base de datos existente y la estructura que Prisma espera.

## 1. Conflictos Críticos de Nombres (`auth`)

El conflicto más importante está en la integración con el esquema de autenticación existente.

- **Existente (Prisma/Better-Auth):**
  - Schema: `auth`
  - Tabla: `user` (según `schema.prisma`: `model user { ... }`)
  - Clave Primaria: `id` (tipo `String`)

- **Propuesto (`consejo.sql`):**
  - Referencias a `auth.usuario` (ej. en `institucional.planilla_novedades`).
  - Referencias a `id_usuario` (tipo `int`).

> [!WARNING]
> **ERROR BLOQUEANTE**: El SQL intenta referenciar `auth.usuario(id_usuario)` pero tu base de datos tiene `auth.user(id)`. Además, los IDs son de tipos diferentes (`int` vs `String`).

**Solución Recomendada:**
Modificar el SQL para apuntar a la tabla correcta:

1.  Cambiar referencias de `auth.usuario` a `auth."user"` (comillas necesarias por ser palabra reservada en SQL a veces, o simplemente `user`).
2.  Cambiar el tipo de dato de las FKs de `int` a `text` o `varchar` (UUIDs de Better Auth).
3.  Cambiar el nombre de la columna FK de `usuario_envio` (int) a `usuario_envio_id` (text) para mayor claridad, o mantener el nombre pero cambiar el tipo.

## 2. Recomendaciones de Estructura SQL

### 2.1. Columnas Generadas (`GENERATED ALWAYS AS`)

Prisma soporta columnas generadas, pero al hacer `db pull`, estas se marcarán como `Unsupported` o de solo lectura.

- **Estado:** Aceptable. Prisma las leerá correctamente.

### 2.2. Tipos de Datos

- **`char(1)` vs `varchar`:** El SQL usa `char(1)` para códigos (ej. `institucional.zona`). Prisma lo mapeará a `String`. Es correcto.
- **`jsonb`:** `institucional.planilla_novedades` usa `jsonb`. Prisma lo mapeará a `Json`. Correcto.

### 2.3. Índices y Constraints

- El SQL incluye una excelente definición de índices y constraints. Esto se reflejará perfectamente en Prisma tras el `db pull`.

## 3. Correcciones Sugeridas al Archivo `consejo.sql`

Antes de ejecutar el script, aplica estos cambios para evitar errores de FK:

```sql
-- En institucional.planilla_novedades
-- CAMBIAR:
-- usuario_envio int not null,
-- constraint fk_planilla_usuario foreign key (usuario_envio) references auth.usuario (id_usuario),

-- POR (Asumiendo que auth.user usa IDs tipo String/UUID):
usuario_envio text not null,
constraint fk_planilla_usuario foreign key (usuario_envio) references auth."user" (id),
```

## 4. Roles y Permisos

El SQL incluye creación de roles de base de datos (`CREATE ROLE ...`).

- **Nota:** Prisma no gestiona roles de base de datos ni permisos (`GRANT`). Estos comandos se ejecutarán en la DB pero no se reflejarán en `schema.prisma`.
- **Recomendación:** Mantén los scripts de roles, pero recuerda que la lógica de permisos a nivel de aplicación (API) deberá implementarse en el código (Next.js/Better-Auth), ya que la conexión de Prisma suele usar un solo usuario de DB ("postgres" o similar) que tiene permisos totales. Los roles de DB son útiles si tienes múltiples servicios accediendo a la DB.

## 5. Resumen de Cambios Necesarios en SQL

1.  **Corregir FKs a Auth:** Buscar todas las referencias a `auth.usuario` y corregirlas a `auth."user"`. Ajustar tipos de `int` a `text`.
2.  **Verificar `rrhh.persona`:** Si planeas vincular usuarios con personas, necesitarás una columna en `auth.user` que apunte a `rrhh.persona` o viceversa. El SQL actual no modifica `auth.user`.
    - _Sugerencia:_ Agregar un `ALTER TABLE auth."user" ADD COLUMN id_persona int null references rrhh.persona(id_persona);` al final del script.

## 6. Procedimiento de Ejecución

1.  **Backup:** Realizar backup de la DB actual.
2.  **Ejecutar SQL:** Correr el script corregido en la base de datos.
3.  **Introspección:** Ejecutar `npx prisma db pull`.
4.  **Generación:** Ejecutar `npx prisma generate`.
5.  **Validación:** Verificar `schema.prisma` resultante.
