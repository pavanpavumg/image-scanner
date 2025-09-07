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

# React Document Scanner

A modern React web application for document scanning with automatic perspective correction, built with Firebase backend.

## Features

### 🔐 Authentication
- Email/password sign-in and sign-up
- Secure user sessions with Firebase Auth
- Protected routes and user data isolation

### 📄 Document Processing
- Upload images (JPEG, PNG) and PDF files
- Automatic document edge detection
- Perspective correction and cropping
- Before/after comparison with zoom/pan functionality

### 💾 Data Persistence
- Store original and processed files in Firebase Storage
- Save document metadata in Firestore
- User-specific data isolation and security

### 🖼️ Gallery & Management
- View all uploaded documents
- Delete documents
- Share documents via public URLs
- Download original and corrected versions

### 🎨 Modern UI
- Responsive design with Tailwind CSS
- Intuitive drag-and-drop file upload
- Real-time progress indicators
- Error handling and loading states

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Image Processing**: Canvas API, PDF.js
- **UI Components**: Heroicons, React Dropzone
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Auth, Firestore, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-image-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config from Project Settings

4. **Configure Firebase**
   - Copy `firebase-config-template.js` to `src/config/firebase.js`
   - Replace the template values with your actual Firebase config
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`
   - Deploy Storage rules: `firebase deploy --only storage`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login/Signup components
│   ├── Upload/         # File upload component
│   ├── Viewer/         # Before/after comparison
│   └── Gallery/        # Document gallery
├── contexts/           # React contexts (Auth)
├── pages/              # Main pages (Dashboard, Share)
├── services/           # Firebase service layer
├── utils/              # Document processing utilities
└── config/             # Firebase configuration
```

## Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Upload Document**: Drag and drop or click to upload an image or PDF
3. **View Results**: See the before/after comparison with automatic perspective correction
4. **Manage Documents**: View, share, or delete your documents in the gallery
5. **Share**: Generate public URLs to share documents with others

## Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Other Platforms
The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Security Features

- User authentication and authorization
- Per-user data isolation
- Secure file uploads with validation
- Public sharing with token-based access
- Firestore and Storage security rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the Firebase documentation for backend setup
- Review the console for error messages

---

Built with ❤️ using React and Firebase
