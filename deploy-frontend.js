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
  log('Starting frontend deployment process...', colors.fg.green);
  
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
  
  // Step 3: Deploy frontend to Firebase Hosting
  log('\n3. Deploying frontend to Firebase Hosting...', colors.fg.yellow);
  if (!execute('firebase deploy --only hosting')) {
    log('Firebase Hosting deployment failed.', colors.fg.red);
    return;
  }
  
  log('\nFrontend deployment completed successfully! 🎉', colors.fg.green);
  log('Your frontend is now live on Firebase Hosting.', colors.fg.green);
  log('\nFrontend URL:');
  log('https://employeesmanage-a807d.web.app', colors.fg.yellow);
  
  log('\nIMPORTANT: You need to deploy the backend separately to Render or another service.', colors.fg.red);
  log('Follow these steps to deploy the backend to Render:', colors.fg.yellow);
  log('1. Create a new account on Render.com if you don\'t have one', colors.fg.white);
  log('2. Create a new Web Service and connect your GitHub repository', colors.fg.white);
  log('3. Configure the service with the following settings:', colors.fg.white);
  log('   - Build Command: npm install', colors.fg.white);
  log('   - Start Command: npm start', colors.fg.white);
  log('4. Add the environment variables from the .env file', colors.fg.white);
  log('5. Deploy the service', colors.fg.white);
  log('6. Update the API URL in funa-EmpMan-Fe/.env.production with your Render API URL', colors.fg.white);
  log('7. Rebuild and redeploy the frontend', colors.fg.white);
}

// Run the deployment
deploy().catch(error => {
  log(`Deployment failed with error: ${error.message}`, colors.fg.red);
  process.exit(1);
});
