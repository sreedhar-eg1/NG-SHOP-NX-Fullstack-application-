const { nxE2EPreset } = require('@nx/cypress/plugins/cypress-preset');
const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: process.env['CI']
          ? 'npx nx run admin:serve-static'
          : 'npx nx run admin:serve',
        production: 'npx nx run admin:serve-static',
      },
      ciWebServerCommand: 'npx nx run admin:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
