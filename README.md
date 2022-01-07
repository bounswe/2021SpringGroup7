# 	:earth_asia: Columbus Project 	:earth_africa:
We are Bogazici University Computer Engineering students. This repository mainly contains our group work in CMPE-352 and CMPE-451.
## What is Columbus
Our project, COLUMBUS, is a location stories platform where users can share stories about locations and interact with each other on these stories. To achieve this, we organize periodic meetings to assign weekly tasks to team members and finish them as a group. You can see our [wiki page](https://github.com/bounswe/2021SpringGroup7/wiki) for further information.
## CMPE 352
CMPE-352 or "Fundamentals of Software Engineering" is a course that teach us about the issues, practices, and tools associated with developing software as a team.
## CMPE 451
CMPE-451 focuses on the successful application of the practices for managing the lifecycle of the
development of a software product. It is about applying the fundamental principles gained during
Cmpe352. 
## Practice-app
The URI of the practice app could be found here: http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com/ \
The APIs could be found here: http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:5000

## What to Find Here
You can get to know our team members, see the details of our meetings, learn our communication methods and read our important reports in this repository.
- [**Here**](https://github.com/bounswe/2021SpringGroup7/wiki) is our wiki page.
- [**Here**](https://github.com/bounswe/2021SpringGroup7/wiki/Weekly-Personal-Efforts-of-Team-Members) is our team members' personal efforts.

## 👋  Team Members 👋 

- [**Abdulkadir Elmacı**](https://github.com/bounswe/2021SpringGroup7/wiki/Abdulkadir-Elmacı)
- [**Yağız Efe Şabanoğlu**](https://github.com/bounswe/2021SpringGroup7/wiki/Yağız-Efe-Şabanoğlu)
- [**Erencan Uysal**](https://github.com/bounswe/2021SpringGroup7/wiki/Erencan-Uysal)
- [**Hamza Akyıldız**](https://github.com/bounswe/2021SpringGroup7/wiki/Hamza-Akyıldız)
- [**İsmail Ata İnan(Communicator)**](https://github.com/bounswe/2021SpringGroup7/wiki/İsmail-Ata-İnan)
- [**Merve Rabia Barın**](https://github.com/bounswe/2021SpringGroup7/wiki/Merve-Rabia-Barın)
- [**Onur Can Avcı**](https://github.com/bounswe/2021SpringGroup7/wiki/Onur-Can-Avci)
- [**Ramazan Bulut**](https://github.com/bounswe/2021SpringGroup7/wiki/Ramazan-Bulut)
- [**Umut Kocasarı**](https://github.com/bounswe/2021SpringGroup7/wiki/Umut-Kocasarı)

# Instalation
## Building the Images
To build the application, please follow the below steps:
1. Make sure that Docker is installed in the computer. If not please follow the instructions on [their website](https://docs.docker.com/engine/install/).
2. Go to the directory Columbus in the source code of the repository
3. Go to the Frontend directory
4. Change the `REACT_APP_API_URL` in the `.env` file to where the backend will be deployed with port 8000.
5. For linux, run the command in the Columbus directory echo `"MAIL=Columbus_451_columbus\nDEBUG=True\n" > backend/src/.env` to set the run environment for the backend.
6. Run the following command to build the images for backend and frontend. If you have not enabled the using docker without sudo add the sudo prefix for each command:
    - For Linux: `docker-compose build`
    - For other OSs: `docker compose build`
    - If you want to build the specific image specify the service name in the docker-compose file:
        - For backend: `docker-compose build backend`
        - For frontend: `docker-compose build frontend`
7. The backend and frontend images should start the build

## Running the Images
Run the built images by running the following commands, you can also use -d command to start the containers at detach state:
- For linux: `docker-compose up`
- For otherOSs: `docker compose up`
- For only one of the services use the following commands:
    - For backend: `docker-compose up backend`
    - For frontend: `docker-compose up frontend`
## Loading the Database Dump
- `cat your_dump.sql | docker exec -i postgresql psql -U postgres`

## Accessing the Running Images
You can access the frontend with HTTP at the deployed URL and the backend at 8000 port at the deployed URL

# MOBILE APPLICATION (ANDROID)

## Requirements
### Environment
- Android Studio 
    - You can download Android Studio via https://developer.android.com/studio 
- Android SDK 
    - minSdkVersion = 21
    - compileSdkVersion = 30
    - targetSdkVersion = 30

- You can use Android Studio to install SDK by selecting checkboxes while installing it. After that you should set environment variables:
    - Get Android SDK directory on SDK Manager of Android Studio
        1. "Preferences" dialog, under `Appearance & Behavior` → `System Settings` → `Android SDK`.
        2. Configure the `ANDROID_HOME` environment variable as directory of SDK or c.
        3. You can also create a  “local.properties” file in the directory: “Columbus/mobile/Columbus/android/”. Then place code below:  
           `sdk.dir=export ANDROID_HOME= path to ANDROID_SDK_HOME`
        4. If you want to use emulator you should add another environment variable:  
           `%LOCALAPPDATA%\Android\Sdk\platform-tools`

### Node
#### On Windows:  
- You can install it via Chocolatey (package manager system) by running following command:  
`choco install nodejs`         	as Administrator Command Prompt.


#### On Mac OS: 

`brew install node`  
`brew install watchman`  via Homebrew package manager system

- Java Development Kit
    - 1.8
- npm (Node package manager) or Yarn
    - 8.1.0 (npm)
    - 1.22.17 (yarn)

- react-native-cli
    - yarn add react-native-cli or
    - npm i react-native-cli 

You can look at these web page for any trouble:
- https://reactnative.dev/docs/environment-setup
- https://reactnative.dev/docs/running-on-device 
 

To RUN:
1. `yarn or npm install` in directory: `Columbus/mobile/Columbus`
2. `react-native run-android` or `yarn android`

Also You can find APK here: https://github.com/bounswe/2021SpringGroup7/blob/CM-37/Columbus/mobile/app-release.apk
You can directly install it to your Mobile Phone or Emulator.

