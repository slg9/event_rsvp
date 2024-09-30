import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata:Metadata = {
  title: 'Gestion d\'Événements - RSVP et Dashboard Organisateur',
  description: 'Un site pour gérer les événements, afficher les cartes, gérer les réponses RSVP avec accusé de réception par mail et fournir un tableau de bord pour les organisateurs.',
  keywords: ['événements', 'RSVP', 'gestion des réponses', 'tableau de bord organisateur', 'cartes', 'email', 'accusé de réception'],
  openGraph: {
    title: 'Gestion d\'Événements - RSVP et Dashboard Organisateur',
    description: 'Gérez vos événements, vos cartes et vos réponses RSVP.',
    siteName: 'Gestion d\'Événements',
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Import de Google Fonts via link */}
        <link
          href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
