# xDir Frontend

Sistema de gestion de usuarios, clientes, organizaciones y roles de Ximdex

## Requisitos
En una instalacion local:
- NodeJS 20 y NPM
- Debemos tener instalada y configurada la API de https://github.com/XIMDEX/xdir-back

## Instalacion

Clona el repositorio en una carpeta con el nombre del proyecto:
```shell
git clone https://github.com/XIMDEX/xdir-front.git
```
O en la carpeta actual con:
```shell
git clone https://github.com/XIMDEX/xdir-front.git .
```

Instala las dependencias con:

```shell
npm install
```

Renombra el archivo `.env.example` a `.env` y modifica el valor de `VITE_API_URL='DEV_API_URL'` con la direccion de la API de xDir.

## Ejecucion

Una vez instaladas las dependencias, puedes ejecutar el proyecto en un entorno local ejecutando el siguiente comando en una terminal:

```shell
npm run dev
```

## Compilacion

Para compilar el proyecto, ejecuta el siguiente comando en una terminal:
```shell
npm run build
```
Se creara una carpeta dist en la raiz del proyecto, ahi se encontraran los assets utilizados, el codigo html y js del proyecto compilados.