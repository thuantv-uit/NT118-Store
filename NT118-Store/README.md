# Project Name

## Introduction
Project Name is an Android application developed using **Android Studio**, the official integrated development environment (IDE) for Android applications. This project [brief description of the project’s purpose, e.g., builds a note-taking app, an e-commerce platform, or an educational tool].

### Key Features
- [Feature 1: Brief description]
- [Feature 2: Brief description]
- [Feature 3: Brief description]

## System Requirements
To run this project in Android Studio, you need:
- **Operating System**: Windows 10/11, macOS 10.14 or later, or Linux (Ubuntu recommended).
- **RAM**: Minimum 8GB, recommended 16GB.
- **Disk Space**: At least 10GB of free space.
- **JDK**: Java Development Kit version 17 or higher.
- **Android Studio**: Latest version (recommended [version name, e.g., Android Studio Iguana | 2023.2.1]).
- **Android SDK**: API Level [specify level, e.g., 34] and required build tools.

## Installation and Setup
### 1. Install Android Studio
1. Visit the [official Android Studio website](https://developer.android.com/studio).
2. Download the version compatible with your operating system.
3. Run the installer and follow the prompts to install Android Studio and the Android SDK.

### 2. Clone the Project
1. Clone this repository using the command:
```bash
   git clone https://github.com/thuantv-uit/NT118-Store.git
```

2. Open Android Studio, select File > Open, and navigate to the project folder.

3. Configure the Environment
    1. Install JDK:
    - Ensure JDK 17 or higher is installed. Download from Oracle or use OpenJDK.
    - In Android Studio, go to File > Project Structure > SDK Location and select the JDK path.

    2. Configure Android SDK:
    - Navigate to File > Settings > Appearance & Behavior > System Settings > Android SDK.
    - Install API Level [e.g., 34] and necessary build tools (Build Tools, Platform Tools).

    3. Install Dependencies:
    - Open the build.gradle file (app module) and ensure listed libraries are synchronized.
    - Click Sync Project with Gradle Files in Android Studio.

4. Run the Application
Connect an Android device (with developer mode enabled) or set up an emulator in AVD Manager. and Click ***Run > Run 'app'*** to build and run the application on the device or emulator.

## Basic Workflow Principles
To ensure a consistent and collaborative development process, contributors should follow these fundamental principles when working on the project:
- **Pull the Main Branch First**: Before starting work on a new feature, always pull the latest changes from the `main` branch to your local repository to ensure your work is based on the most up-to-date codebase. Use the command:
```bash
   git pull origin main
```

- **Create a Feature Branch**: When adding a new feature, create a dedicated branch from main for your changes. Name the branch descriptively (e.g., feature/add-login-screen). Use:
```bash
   git checkout -b feature/your-feature-name
```

- **Push Completed Features to Your Branch**: After completing the feature implementation, commit your changes with clear and descriptive messages, then push the branch to the remote repository:
```bash
   git commit -m "Add [feature description]"
   git push origin feature/your-feature-name
```

- **Create a Pull Request**: Submit a Pull Request (PR) on GitHub to merge your feature branch into the main branch. Ensure the PR includes a clear description of the changes and passes any automated tests or code reviews.

- **Sync with Main After Completion**: Once your PR is merged, pull the updated main branch again to your local repository to continue working on new features:
```bash
   git checkout main
   git pull origin main
```

## Contributing
- *** ------------------------**
- *** ------------------------**
- **Tran Van Thuan - 22521448**

## Acknowledgements
Thanks to the course instructor Trần Hồng Nghi and peers for their support.