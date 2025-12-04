// This script runs after electron-builder packages the app
// It modifies the AppRun script to include sandbox flags

const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  const { appOutDir, packager } = context;
  
  // For AppImage, modify the AppRun script
  if (packager.platform.name === 'linux') {
    const appRunPath = path.join(appOutDir, 'AppRun');
    
    if (fs.existsSync(appRunPath)) {
      let appRunContent = fs.readFileSync(appRunPath, 'utf8');
      
      // Check if flags are already there
      if (!appRunContent.includes('--no-sandbox')) {
        // Find the executable name (usually fliqlocko or the productName)
        const executableName = packager.config.executableName || 'fliqlocko';
        
        // Replace the exec line to include sandbox flags
        appRunContent = appRunContent.replace(
          /(exec\s+"\$HERE\/[^"]+")/,
          `$1 --no-sandbox --disable-setuid-sandbox`
        );
        
        // Also try alternative patterns
        appRunContent = appRunContent.replace(
          /(exec\s+"\$APPDIR\/[^"]+")/,
          `$1 --no-sandbox --disable-setuid-sandbox`
        );
        
        const execPattern = new RegExp(`(exec\\s+"\\$HERE/${executableName}")`);
        appRunContent = appRunContent.replace(
          execPattern,
          '$1 --no-sandbox --disable-setuid-sandbox'
        );
        
        fs.writeFileSync(appRunPath, appRunContent, { mode: 0o755 });
        console.log('✅ Modified AppRun to include sandbox flags');
      } else {
        console.log('✅ AppRun already has sandbox flags');
      }
    } else {
      console.log('⚠️  AppRun not found, creating custom one');
      // Create custom AppRun if it doesn't exist
      const executableName = packager.config.executableName || 'fliqlocko';
      const customAppRun = '#!/bin/bash\n' +
        'HERE="$(dirname "$(readlink -f "${0}")")"\n' +
        `exec "${'$'}HERE/${executableName}" --no-sandbox --disable-setuid-sandbox "$@"\n`;
      fs.writeFileSync(appRunPath, customAppRun, { mode: 0o755 });
      console.log('✅ Created custom AppRun with sandbox flags');
    }
  }
};

