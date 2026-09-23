# MongoDB Atlas Setup Guide
### For Person 2 and Person 3

Follow every step in order. This will get you from zero to a running backend connected to the shared project database.

---

## Step 1 — Create a MongoDB Atlas account

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **Try Free** and sign up with your email
3. Verify your email address and log in

---

## Step 2 — Create a Free Cluster

1. Once logged in, click **Create** (or "Build a Database")
2. Choose the **M0 Free** tier
3. Pick any cloud provider and region — choose the one closest to you
4. Name it anything (e.g. `Cluster0`) 
5. Click **Create Deployment**

---

## Step 3 — Create a Database User

A popup wizard will appear after the cluster is created:

1. Under "How would you like to authenticate?" choose **Username and Password**
2. Set the username to: `sample_db_user` or however you want
3. Set a password — **write it down somewhere safe**, you'll need it in Step 6
4. Click **Create User**

---

## Step 4 — Whitelist your IP Address (MongoDB automatically does this now, so you can skip this)

Still in the same wizard:

1. Under "Where would you like to connect from?" click **Add My Current IP Address**
2. Click **Finish and Close**

> ⚠️ If you switch networks later (e.g. from home Wi-Fi to school Wi-Fi), your IP changes and Atlas will block you. To fix it: go to **Network Access** in the left sidebar → **Add IP Address** → **Add Current IP Address**.
>
> For a prototype, you can also click **Allow Access from Anywhere** (`0.0.0.0/0`) to skip this issue entirely.

---

## Step 5 — Get your Connection String

1. On your cluster page, click **Connect**
2. Choose **Drivers**
3. Select **Node.js** as the driver
4. Copy the connection string — it looks like this:
   ```
   mongodb+srv://sample_db_user:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

---

## Step 6 — Build your full MONGO_URI

You need to make two edits to the string Atlas gave you:

**1. Replace `<db_password>` with your actual password**

So if your password is `mypass123`:
```
mongodb+srv://sample_db_user:mypass123@cluster0.xxxxx.mongodb.net/?...
```

**2. Add `/internship-tracker` between the `.net/` and the `?`**

This sets the database name. Before:
```
...mongodb.net/?retryWrites...
```
After:
```
...mongodb.net/internship-tracker?retryWrites...
```

**Your final connection string should look like this:**
```
mongodb+srv://sample_db_user:mypass123@cluster0.xxxxx.mongodb.net/internship-tracker?retryWrites=true&w=majority&appName=Cluster0
```

> MongoDB Atlas will automatically create the `internship-tracker` database the first time your app writes data — you don't need to create it manually.

---

## Step 7 — Create your `.env` file

The `.env` file is **not included in the GitHub repository** (it's blocked by `.gitignore` for security). You have to create it yourself.

1. Open the `backend/` folder in Cursor
2. You'll see a file called `.env.example` — copy it and rename the copy to `.env`

Or run this in your terminal from inside the `backend/` folder:

```powershell
cp .env.example .env
```

---

## Step 8 — Paste your connection string into `.env`

Open `backend/.env` and make it look like this:

```
MONGO_URI=mongodb+srv://sample_db_user:mypass123@cluster0.xxxxx.mongodb.net/internship-tracker?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```

Replace the example values with your actual username, password, and cluster address.

---

## Step 9 — Install backend dependencies

If you haven't done this yet:

```powershell
cd backend
npm install
```

> If you get a script execution error, run this first (one time only):
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
> Type `Y` to confirm, then try `npm install` again.

---

## Step 10 — Start the backend

```powershell
npm run dev
```

You should see:
```
✅  Connected to MongoDB Atlas
🚀  Server running on port 5000
```

If you see both lines, your backend is running and connected to the database. ✅

---

## Step 11 — Start the frontend (separate terminal)

Open a **second terminal** and run:

```powershell
cd frontend
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser. Both the backend (port 5000) and the frontend (port 5173) need to be running at the same time.

---

## Troubleshooting

### `MongooseServerSelectionError` or connection timeout
Your IP address is not whitelisted.
- Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Network Access** → **Add IP Address** → **Add Current IP Address**

### Wrong password error
- Double-check the password in your `.env` — make sure `<db_password>` was fully replaced

### `ECONNREFUSED` when the frontend tries to load data
- The backend isn't running → open a terminal, `cd backend`, run `npm run dev`

### `npm` is not recognized
- PowerShell is blocking scripts → run this once:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### `&&` is not a valid statement separator
- You're on Windows PowerShell 5 → run commands one at a time, not chained with `&&`

### `.env` file not found / not working
- Make sure the file is named exactly `.env` (not `.env.txt`) inside the `backend/` folder
- Windows hides file extensions by default — check the name in Cursor's file explorer sidebar

---

## Important reminders

- **Never commit `.env` to GitHub.** It contains your database password. Git is already configured to ignore it — just don't force-add it.
- **Everyone has their own Atlas cluster and their own `.env`.** You are not sharing a cluster with Person 1 — you each connect to your own database.
- **Keep the database name `internship-tracker`** in your URI so the collection names stay consistent across the team.
