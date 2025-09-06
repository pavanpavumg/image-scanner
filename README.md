# Scanner Web App (React + Firebase)

A small React + Firebase app to upload images/PDFs, auto-detect document quadrilateral using OpenCV.js, perspective-correct the page, show before/after, and persist files + metadata in Firebase.

See `src/` for source files. Replace Firebase config placeholders in `src/firebaseConfig.js` with your project values.

Commands:

```bash
npm install
npm run dev
```

Deploy with Firebase Hosting (optional):
1. `firebase init` (select Hosting, Firestore, Storage)
2. `npm run build`
3. `firebase deploy --only hosting,firestore,storage`

