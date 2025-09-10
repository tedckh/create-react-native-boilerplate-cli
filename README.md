# Create React Native Boilerplate

A simple CLI tool to generate a new project from the [@tedckh/react-native-boilerplate](https://github.com/tedckh/react-native-boilerplate).

## Usage

To create a new project, run the following command in your terminal:
```bash
npx @tedckh/create-react-native-boilerplate <your-project-name>
```

## What it does

The script will create a new directory with your chosen project name and perform the following steps:

1.  Clones the latest version of the `react-native-boilerplate`.
2.  Updates the `package.json`, `app.json`, `index.js`, `Podfile`, Xcode project files (`.pbxproj`, `.xcscheme`), Android build files (`.gradle`, `AndroidManifest.xml`), and Java/Kotlin source folder structure with your new project name and bundle identifier.
3.  Updates the internal package scope names (e.g., `@my-rn-boilerplate` to `@your-project-name`).
4.  Installs all JavaScript dependencies (`npm install`).
5.  Installs iOS native dependencies (`pod install`).
6.  Initializes a new git repository.

Once it's finished, your new project is ready to go with a complete Dockerized environment for both development and production.

## License

ISC

## Important Notes

### iOS Development on macOS

The project creation script includes a step to run `pod install` for iOS native dependencies. This command is part of CocoaPods and **only runs on macOS**.

If you are creating a project on a non-macOS operating system (e.g., Windows or Linux), the script will automatically skip this step. You will need to run `pod install` manually on a macOS machine if you intend to build for iOS.