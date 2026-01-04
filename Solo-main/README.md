
  # RPG Leveling Productivity App

  This is a code bundle for RPG Leveling Productivity App. The original project is available at https://www.figma.com/design/4pVw0rzRKFfIB4dUSS12ta/RPG-Leveling-Productivity-App.

## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Configuration

This project uses Firebase for persistence. To run the app locally or deploy it to Vercel you need to provide your own Firebase project credentials via environment variables. An example file `.env.example` is included; copy it to `.env.local` and fill in your Firebase API keys:

```bash
cp .env.example .env.local
# edit .env.local and set each VITE_FIREBASE_* variable
```

When deploying to Vercel, add these variables in the Vercel dashboard as **Environment Variables** (use the same names prefixed with `VITE_`). Vercel will automatically pick them up during the build.

### Firebase Console checklist (important)

This project persists your full app state into **Cloud Firestore** (collection: `appState`). You will **not** see anything in *Realtime Database* unless you build that integration separately.

1. Firebase Console → **Build → Firestore Database** → create a database (if you haven't).
2. Firebase Console → **Build → Authentication** → **Sign-in method** → enable **Email/Password**.
3. Firestore Rules (simple & safe default for this app):

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appState/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

After login + onboarding, you should see documents under **Firestore Database → Data → appState → {uid}**.

## Deployment

This app is built with Vite and React. To deploy it to Vercel:

1. Commit your changes to a Git repository and push to GitHub, GitLab or Bitbucket.
2. In Vercel, import the repository and select the `vite` framework preset if detected automatically.
3. Add your Firebase environment variables in the **Environment Variables** section.
4. Trigger a deployment. Vercel will build the app and host it on a global edge network.

The `.gitignore` file ensures that local development artifacts (`node_modules`, build outputs and secret `.env.local` files) are not committed to your repository.
  # level
