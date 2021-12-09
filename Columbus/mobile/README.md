# Columbus - React Native Application

Columbus mobile app

## Table of Contents

- [Columbus - React Native Application](#Columbus---react-native-application)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Structure / Scaffolding](#structure--scaffolding)
  - [Dependencies](#dependencies)

## Prerequisites

- You should setup your development environment first with React-Native-CLI Quick Start option from the [React Native's docs](https://reactnative.dev/docs/environment-setup)
- You can use [React Native Debugger](https://github.com/jhen0409/react-native-debugger) as your debugger, it doesn't require any setup, just run open react-native-debugger and enable debug from your app.

### Installation

Open your terminal and type in

```sh
$ git clone https://github.com/bounswe/2021SpringGroup7.git
$ cd Columbus/mobile/Columbus
```

Install all the packages

```sh
$ yarn
```

If need run the below scripts to run in ios app

```sh
$ cd ios
$ pod install
```

To run ios app

```sh
$ yarn ios
```

To run android app

```sh
$ yarn android
```

### Structure / Scaffolding

```text
Columbus
├── src
│   └── assets
│       ├── logo
│   └── components
│       └── [ComponentName]
│           ├── index.js
│           ├── [ComponentName].js
│           └── [ComponentName].test.js
│   └── layouts
│       └── [LayoutName]
│           ├── index.js
│           ├── [LayoutName].js
│           └── [LayoutName].test.js
│   └── navigation
│       ├── index.js
│       ├── Navigation.js
│   └── views
│       └── [PageName]
│           ├── index.js
│           ├── [PageName].js
│           └── [PageName].test.js
│   └── context
│       └── [ContextName]
│           ├── index.js
│           ├── [ContextName].js
│   └── services
│       ├── index.js
│       ├── api.js
│       ├── services.js
│   └── configs
└── README.md
```

## Dependencies

- React Native **v0.66.2**
- React **v17.0.2**

Some of the dependencies used in the project

- [Native Base](https://github.com/GeekyAnts/NativeBase) - Essential cross-platform UI components for React Native
- [React Navigation](https://github.com/react-navigation/react-navigation) - Routing and navigation for your React Native apps
- [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
- [React Query](https://github.com/tannerlinsley/react-query) - ⚛️ Hooks for fetching, caching and updating asynchronous data in React

Dev dependencies

- [React Native Testing Library](https://github.com/callstack/react-native-testing-library) - 🦉 Simple and complete React Native testing utilities that encourage good testing practices.
