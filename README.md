# rdm-homepage

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## To run this frontend with rdm-homepage-server instead of its own flatfiles (local):
On /public/config/setup.js, set 
window.BASE_CONFIG = configCms
( which points to http://127.0.0.1:8082, the default server configuration )