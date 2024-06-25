module.exports = {
    apps : [{
      name: 'express-app',
      script: '/var/www/crm.progryss.com/html/server/src/index.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        MONGODB_URI: 'mongodb+srv://doadmin:pe61jUC07952Xz3S@db-mongodb-blr1-19627-af15e092.mongo.ondigitalocean.com/Progryss_crm?tls=true&authSource=admin&replicaSet=db-mongodb-blr1-19627'
      },
      env_production: {
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb+srv://doadmin:pe61jUC07952Xz3S@db-mongodb-blr1-19627-af15e092.mongo.ondigitalocean.com/Progryss_crm?tls=true&authSource=admin&replicaSet=db-mongodb-blr1-19627'
      }
    }]
  };
  
