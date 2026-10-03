"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MagazineFlipbook from "@components/magazine/MagazineFlipbook";

function MagazineReaderContent() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  const initialPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  return (
    <div className="min-h-screen -mt-20 bg-slate-50 py-2 px-1 sm:px-4 lg:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-[98vw] 2xl:max-w-[1700px]">
        <MagazineFlipbook
          pdfUrl="https://cdn.jsdelivr.net/gh/mohitbirla00000/document@main/magazines/bodhika-the-soit-gazette.pdf"
          title="BODHIKA"
          initialPage={initialPage}
        />
      </div>
    </div>
  );
}

export default function MagazineReadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0a0080] rounded-full animate-spin" />
        </div>
      }
    >
      <MagazineReaderContent />
    </Suspense>
  );
}
