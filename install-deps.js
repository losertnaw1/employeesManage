const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fg: {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
  }
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execute(command, options = {}) {
  try {
    log(`Executing: ${command}`, colors.fg.blue);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    log(`Error executing command: ${command}`, colors.fg.red);
    log(error.message, colors.fg.red);
    return false;
  }
}

// Install dependencies
async function installDependencies() {
  log('\n=== Installing Dependencies ===', colors.bright);
  
  // Frontend dependencies
  log('\nInstalling frontend dependencies...', colors.fg.green);
  process.chdir('./funa-EmpMan-Fe');
  
  // Install @types/node for TypeScript
  log('\nInstalling @types/node...', colors.fg.yellow);
  if (!execute('npm install --save-dev @types/node')) {
    log('Failed to install @types/node. Continuing anyway...', colors.fg.yellow);
  }
  
  process.chdir('..');
  
  // Backend dependencies
  log('\nInstalling backend dependencies...', colors.fg.green);
  process.chdir('./functions');
  
  // Install dotenv for environment variables
  log('\nInstalling dotenv...', colors.fg.yellow);
  if (!execute('npm install dotenv')) {
    log('Failed to install dotenv. Continuing anyway...', colors.fg.yellow);
  }
  
  process.chdir('..');
  
  log('\nDependencies installation completed!', colors.fg.green);
}

// Run the installation
installDependencies().catch(error => {
  log(`Installation failed with error: ${error.message}`, colors.fg.red);
  process.exit(1);
});
