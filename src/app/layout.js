import Navbar from "@/components/navbar/Navbar";
import AuthProvider from "@/context/auth";
import './globals.css';

export const metadata = {
  title: 'ChatBot Maker - Create AI Chatbots Easily',
  description: 'Build and deploy custom AI chatbots with our intuitive chatbot maker platform.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
