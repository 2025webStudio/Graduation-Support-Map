// //Next.js 버그로 인해 삭제하지 마시오
// export const dynamic = "force-dynamic";

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seoul Graduation Support Map",
    description: "서울 소속 대학교 졸업전시 맵 서비스",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <body>{children}</body>
        </html>
    );
}
