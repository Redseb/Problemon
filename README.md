# Problemon 🧮

Problemon is a Calculus Pokemon-like educational game built with React Native/Expo for the frontend and NodeJs for the Backend. Problemon was a Game Jam project built in 24hrs. Players take the role of the function F(x) and are tasked with defeating the opponent function, G(x).

## 🚀 Releases 🚀

Web 🌐 [https://redseb.github.io/Problemon/](https://redseb.github.io/Problemon/)
Android 📱 [https://play.google.com/store/apps/details?id=problemon.mma.pjatk&gl=PL](https://play.google.com/store/apps/details?id=problemon.mma.pjatk&gl=PL)

# 🎲 How To Play 🎲

### Win / Lose

- The player wins either when G(x) = 0 or when G(x)'s health drops to 0
- The player loses either when F(x) = 0 or when their health drops to 0

**Each turn the player rolls a dice to determine what type of problem to answer:**

### Derivative

Enter the derivative of G(x)

- _If you answer correctly_: G(x) gets derived
- _If you answer incorrectly_: F(x) gets derived

### Integral

Enter the integral of F(x)

- _If you answer correctly_: F(x) gets integrated
- _If you answer incorrectly_: G(x) gets integrated

### Calculate

An additional dice rolls determining what value to substitute x with
Enter the value of F(x) where x is substituted with the number the player rolled

- _If you answer correctly_: G(x) loses health equal to the calculation
- _If you answer incorrectly_: F(x) loses health equal to the calculation

# 🏃‍♂️ How to Start Development Console 🏃‍♂️

Make sure you have expo-cli installed globally

    // npm
    npm install -g expo-cli

    // yarn
    yarn global add expo-cli

Install dependencies

    npm install

Start Expo Development Console [Will automatically open in browser window]

    expo start

## 📱 Mobile Development 📱

### How To Run:

1.  Download the expo app onto your device: [https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en)
2.  Open the Expo App
3.  Scan the QR code on the browser Development Console

### How To Build A Standalone Android App:

**_Be sure to increment the version codes in app.json_**
Run `expo build:android -t app-bundle`

### How To Push a New Version to Expo (Over the Air Update):

In the browser Development Console press the _"Publish / Republish Project"_

## 🌐 Web Development 🌐

### How To Run:

- When starting development run `expo start -w` instead of the normal command [`-w` denotes web]

OR

- In the browser Development Console press the _"Run in Web Browser"_ button

### How To Build and Upload A New Version:

**Build**: `expo build:web`
**Upload to Github Pages**: `npx gh-pages -d web-build`
_Note: Github Pages may take around 10 minutes to update - also clear cache when refreshing page_
