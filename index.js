#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectName = process.argv[2];

if (!projectName) {
  console.error('Error: No project name provided.');
  console.log('Usage: npx create-react-native-boilerplate <your-new-project-name>');
  process.exit(1);
}

const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const repoUrl = 'https://github.com/tedckh/react-native-boilerplate.git';

// --- Renaming Variables ---
const oldProjectName = "ReactNativeBoilerplate";
const oldBundleIdentifier = "org.reactjs.native.example.ReactNativeBoilerplate";

// Derive new names
const newProjectName = projectName;
const newBundleIdentifier = `com.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

console.log(`Cloning the React Native boilerplate into '${projectName}'...`);
try {
  execSync(`git clone --depth 1 ${repoUrl} ${projectPath}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to clone the repository.');
  process.exit(1);
}

process.chdir(projectPath);

console.log('Updating project names in core files...');

// --- Content Replacements ---
const filesToModify = [
  'package.json',
  'app.json',
  'index.js',
  'ios/Podfile',
  'ios/ReactNativeBoilerplate.xcodeproj/project.pbxproj',
  'ios/ReactNativeBoilerplate/Info.plist',
  'ios/ReactNativeBoilerplate/AppDelegate.swift',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/java/com/ReactNativeBoilerplate/MainActivity.java',
  'android/settings.gradle',
];

filesToModify.forEach(file => {
  const filePath = path.join(projectPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(new RegExp(oldProjectName, 'g'), newProjectName);
    content = content.replace(new RegExp(oldBundleIdentifier, 'g'), newBundleIdentifier);
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  }
});

// --- Update internal package scope names ---
const oldScopeName = "@my-rn-boilerplate";
const newScopeName = `@${newProjectName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

const filesToModifyScope = [
  'package.json',
  'App.tsx',
  'src/screens/HomeScreen.tsx',
  'src/screens/SettingsScreen.tsx',
  'src/screens/InfiniteListScreen.tsx',
  'src/hooks/usePhotos.ts',
  'src/api/index.ts',
  'packages/store/package.json',
  'packages/api-client/package.json',
  'packages/query-provider/package.json',
  'metro.config.js',
];

filesToModifyScope.forEach(file => {
  const filePath = path.join(projectPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(new RegExp(oldScopeName, 'g'), newScopeName);
    fs.writeFileSync(filePath, content);
    console.log(`Updated scope in: ${file}`);
  }
});

// --- Special Case: Android Java/Kotlin folder structure ---
// This needs to be renamed based on the new bundle identifier
const oldJavaPath = path.join(projectPath, 'android', 'app', 'src', 'main', 'java', ...oldBundleIdentifier.split('.'));
const newJavaPath = path.join(projectPath, 'android', 'app', 'src', 'main', 'java', ...newBundleIdentifier.split('.'));

if (fs.existsSync(oldJavaPath)) {
  execSync(`mkdir -p ${path.dirname(newJavaPath)}`, { stdio: 'inherit' });
  execSync(`mv ${oldJavaPath} ${newJavaPath}`, { stdio: 'inherit' });
  console.log(`Renamed Android Java folder: ${oldJavaPath} -> ${newJavaPath}`);
}

// --- Rename iOS project folders ---
const oldIosProjectPath = path.join(projectPath, 'ios', oldProjectName);
const newIosProjectPath = path.join(projectPath, 'ios', newProjectName);
if (fs.existsSync(oldIosProjectPath)) {
  execSync(`mv ${oldIosProjectPath} ${newIosProjectPath}`, { stdio: 'inherit' });
  console.log(`Renamed iOS project folder: ${oldIosProjectPath} -> ${newIosProjectPath}`);
}

const oldIosXcodeprojPath = path.join(projectPath, 'ios', `${oldProjectName}.xcodeproj`);
const newIosXcodeprojPath = path.join(projectPath, 'ios', `${newProjectName}.xcodeproj`);
if (fs.existsSync(oldIosXcodeprojPath)) {
  execSync(`mv ${oldIosXcodeprojPath} ${newIosXcodeprojPath}`, { stdio: 'inherit' });
  console.log(`Renamed iOS .xcodeproj folder: ${oldIosXcodeprojPath} -> ${newIosXcodeprojPath}`);
}

// --- Special Case: iOS Scheme File Renaming and Content Update ---
const oldSchemePath = path.join(projectPath, 'ios', `${newProjectName}.xcodeproj`, 'xcshareddata', 'xcschemes', `${oldProjectName}.xcscheme`);
const newSchemePath = path.join(projectPath, 'ios', `${newProjectName}.xcodeproj`, 'xcshareddata', 'xcschemes', `${newProjectName}.xcscheme`);

if (fs.existsSync(oldSchemePath)) {
  execSync(`mv ${oldSchemePath} ${newSchemePath}`, { stdio: 'inherit' });
  console.log(`Renamed iOS scheme file: ${oldSchemePath} -> ${newSchemePath}`);

  // Update content of the scheme file
  let schemeContent = fs.readFileSync(newSchemePath, 'utf8');
  schemeContent = schemeContent.replace(new RegExp(oldProjectName, 'g'), newProjectName);
  fs.writeFileSync(newSchemePath, schemeContent);
  console.log(`Updated content of scheme file: ${newSchemePath}`);
}

console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('Installing iOS pods...');
if (process.platform === 'darwin') {
  execSync('cd ios && pod install && cd ..', { stdio: 'inherit' });
} else {
  console.log('Skipping iOS pod installation (not on macOS).');
}

console.log('Initializing a new git repository...');
execSync('rm -rf .git', { stdio: 'inherit' });
execSync('git init', { stdio: 'inherit' });
execSync('git add .', { stdio: 'inherit' });
execSync('git commit -m "Initial commit"', { stdio: 'inherit' });

console.log('\nSuccess! Your new React Native project is ready.');
console.log(`
Next steps:\n  cd ${projectName}\n  npm run ios # or npm run android`);