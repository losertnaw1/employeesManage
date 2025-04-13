const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },

  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  }
};

// Helper function to log with colors
function log(message, color = colors.fg.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to execute commands
function execute(command, options = {}) {
  try {
    log(`Executing: ${command}`, colors.fg.cyan);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    log(`Error executing command: ${command}`, colors.fg.red);
    log(error.message, colors.fg.red);
    return false;
  }
}

// Main deployment function
async function deploy() {
  log('Starting deployment process...', colors.fg.green);

  // Step 1: Install dependencies
  log('\n1. Installing dependencies...', colors.fg.yellow);
  if (!execute('node install-deps.js')) {
    log('Dependencies installation failed. Continuing anyway...', colors.fg.yellow);
  }

  // Step 2: Build frontend
  log('\n2. Building frontend...', colors.fg.yellow);
  process.chdir('./funa-EmpMan-Fe');
  if (!execute('npm run build')) {
    log('Frontend build failed. Aborting deployment.', colors.fg.red);
    return;
  }
  process.chdir('..');

  // Step 3: Install dependencies in functions folder
  log('\n3. Installing dependencies in functions folder...', colors.fg.yellow);
  process.chdir('./functions');
  if (!execute('npm install')) {
    log('Failed to install dependencies in functions folder. Aborting deployment.', colors.fg.red);
    return;
  }
  process.chdir('..');

  // Step 4: Deploy to Firebase
  log('\n4. Deploying to Firebase...', colors.fg.yellow);
  if (!execute('firebase deploy')) {
    log('Firebase deployment failed.', colors.fg.red);
    return;
  }

  log('\nDeployment completed successfully! 🎉', colors.fg.green);
  log('Your application is now live on Firebase.', colors.fg.green);
  log('\nTo create the default admin account, visit:');
  log('https://employeesmanage-a807d.web.app/createAdmin', colors.fg.yellow);
  log('\nDefault login credentials:');
  log('Username: admin', colors.fg.yellow);
  log('Password: admin123', colors.fg.yellow);
}

// Run the deployment
deploy().catch(error => {
  log(`Deployment failed with error: ${error.message}`, colors.fg.red);
  process.exit(1);
});
