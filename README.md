# Undoist
[https://nitsuj102284.github.io/undoist-project/](https://nitsuj102284.github.io/undoist-project/)

## What is it?
Undoist is a portfolio project that I am building. It is designed to be a rebuild of the popular [Todist app](https://www.todoist.com).

I probably won't implement all features, and there will be slight differences that I might not address (some decisions like the color palette are differnt intentionally). While not all buttons and features will be functional, the goal is to get the UI to appear like the real app (as time permits... I'm working nights here).


## Tech
This is strictly frontend, although I might add a backend database and API at some point.

### Key technologies
- [Angular 19](https://angular.dev) (latest version as of beginning of this project, 03/2025)
- Typescript/JavaScript
- RxJs
- HTML
- CSS/SCSS
- IndexedDb

## How to check it out
1. **Check out [Todoist](https://www.todoist.com)** first. Get familiar with how the real app looks and behaves
1. **Open up the code** and look at how it's organized. I may have limited time to work on this, and some things could use improvement, but I really take pride with every line of code that I write
1. After you've read every line, **serve the app on your local machine** and play around with it

## Current state of things

### Log in / Authentication
1. Two sample users are added when the app is run for the first time
1. Of course, this is just a frontend project, so no real authentication is being had
1. If you are "logged in", you just go to `/login` to switch users (or open in a new tab, because for now I'm using session storage and not sharing between tabs)

### Views
1. Basic layout is in place for the app
1. A "log in" page has been added for selecting your user
1. A project view has been added (currently only for Inbox)

### Navigation
1. The side navigation panel has been aded
1. It behaves like the real app, in that it can be collapsed
1. Not implemented yet is a mobile-view of the navigation where it overlays the main view, and remembering the last state
1. The only navigation items that are wired up are 'Inbox' and 'Add Task' buttons, although the rest are in place to look pretty

### Adding a task
1. A component for adding a task has been added
1. The add task component has been added to a dialog/modal that shows when you click the 'Add Task' button in the side navigation
1. The same component will be used in the project view when you click to add a task inline
1. A formatting toolbar has been added and appears on selection of text; I still need narrow down the formatting options to just the few that you see on the real app
1. Not implemented is just about every other feature that you see when you add a task on the real app. I intend to add each of those features to the task, as time permits


## About my file structure
Just as Angular is moving away from modules as best practice, where I used to organize into a CoreModule, FeatureModule and SharedModule, with directories for services, components, etc. within each, my structure is more like this:

```plaintext
my-project/
├── ui/
│   ├── assets/
│   │   ├── images/
│   │   ├── scss/
│   ├── src/
│   │   ├── app/
│   │   │   ├── classes/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── interfaces/
│   │   │   ├── services/
│   │   │   └── views/
└── api/
```

### Generated entity classes?
You might find it strange that I have entities in `classes/generated`, when they are not generated in this project.

The reason why, is because, in a full-stack application, I generally include the frontend and backend, and generate the front-end entity classes from the backend entity files, which is done automatically with a bash script. If this project ever gets a backend component, the entities will be rewritten (with a relational database), and the frontend classes will be replaced.

## How to run the app
### Preqrequisites
Node.js and npm

    Node.js version 16.x.x or higher.
    npm version 11.x.x or higher.

Angular CLI

    Version 19.x.x of Angular CLI


### Clone the project
```bash
git clone [this repo]
cd undoist
```

### Install dependencies
```bash
npm install
```

### Serve the app

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.


## Some preliminary screenshots
[Login view](screenshots/login_view.png)

[Add task dialog](screenshots/add_task_dialog.png)

[Add task dialog growing](screenshots/add_task_dialog_growing.png)

[Project/task list view](screenshots/project_task_list_view.png)