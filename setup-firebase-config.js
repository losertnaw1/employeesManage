const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupFirebaseConfig() {
  log('\n=== Firebase Configuration Setup ===', colors.bright);
  log('This script will help you set up the necessary Firebase configuration for your application.\n', colors.fg.blue);
  
  try {
    // MongoDB URI
    const mongoUri = await question('Enter your MongoDB URI (press Enter to use the default): ');
    if (mongoUri) {
      execSync(`firebase functions:config:set mongodb.uri="${mongoUri}"`, { stdio: 'inherit' });
      log('MongoDB URI configured successfully.', colors.fg.green);
    } else {
      log('Using default MongoDB URI.', colors.fg.yellow);
    }
    
    // Auth secrets
    const accessTokenSecret = await question('Enter your access token secret (press Enter to use a default): ');
    if (accessTokenSecret) {
      execSync(`firebase functions:config:set auth.access_token_secret="${accessTokenSecret}"`, { stdio: 'inherit' });
      log('Access token secret configured successfully.', colors.fg.green);
    } else {
      log('Using default access token secret.', colors.fg.yellow);
    }
    
    const refreshTokenSecret = await question('Enter your refresh token secret (press Enter to use a default): ');
    if (refreshTokenSecret) {
      execSync(`firebase functions:config:set auth.refresh_token_secret="${refreshTokenSecret}"`, { stdio: 'inherit' });
      log('Refresh token secret configured successfully.', colors.fg.green);
    } else {
      log('Using default refresh token secret.', colors.fg.yellow);
    }
    
    // Email configuration
    log('\nEmail Configuration (for password reset functionality):', colors.bright);
    const emailHost = await question('Enter your email host (e.g., smtp.gmail.com): ');
    const emailPort = await question('Enter your email port (e.g., 587): ');
    const emailUser = await question('Enter your email username: ');
    const emailPass = await question('Enter your email password: ');
    const emailFrom = await question('Enter your email from address: ');
    
    if (emailHost && emailPort && emailUser && emailPass) {
      execSync(`firebase functions:config:set email.host="${emailHost}"`, { stdio: 'inherit' });
      execSync(`firebase functions:config:set email.port="${emailPort}"`, { stdio: 'inherit' });
      execSync(`firebase functions:config:set email.user="${emailUser}"`, { stdio: 'inherit' });
      execSync(`firebase functions:config:set email.pass="${emailPass}"`, { stdio: 'inherit' });
      execSync(`firebase functions:config:set email.from="${emailFrom || emailUser}"`, { stdio: 'inherit' });
      log('Email configuration set successfully.', colors.fg.green);
    } else {
      log('Email configuration skipped. Password reset functionality may not work properly.', colors.fg.yellow);
    }
    
    // Frontend URL
    const frontendUrl = await question('Enter your frontend URL (press Enter to use the default Firebase hosting URL): ');
    if (frontendUrl) {
      execSync(`firebase functions:config:set app.frontend_url="${frontendUrl}"`, { stdio: 'inherit' });
      log('Frontend URL configured successfully.', colors.fg.green);
    } else {
      log('Using default Firebase hosting URL.', colors.fg.yellow);
    }
    
    log('\nFirebase configuration completed successfully!', colors.fg.green);
    log('You can now deploy your application using the deploy.js script.', colors.fg.green);
    
  } catch (error) {
    log(`\nError setting up Firebase configuration: ${error.message}`, colors.fg.red);
  } finally {
    rl.close();
  }
}

setupFirebaseConfig();
