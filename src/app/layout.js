import Navbar from "@/components/navbar/Navbar";
import AuthProvider from "@/context/auth";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
