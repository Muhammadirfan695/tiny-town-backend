import { Inter } from 'next/font/google';
import './globals.css';
import { ProvideAuth } from '../authentication/ProvideAuth'; 
import { ReduxProviders } from '../redux/Providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LocalBites Admin',
  description: 'Admin panel for LocalBites.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProviders>
          <ProvideAuth> 
            {children}
          </ProvideAuth>
        </ReduxProviders>
        <ToastContainer theme="colored" />
      </body>
    </html>
  );
}