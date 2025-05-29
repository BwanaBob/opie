module.exports = {
  apps : [{
      name: "opie",
    script: 'index.js',
     watch: true,
      ignore_watch: [
        "node_modules",
        "logs",
        "debug",
        ".git",
        ".nvm",
        "*.txt"
      ],
 }],
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
