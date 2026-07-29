import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#eee] bg-white px-5 py-3 md:px-9">
      <p className="flex items-center justify-center gap-1.5 text-[10px] text-[#999] md:text-[11px]">
        <span>Made with</span>
        <span aria-hidden="true">💙</span>
        <span>by NST</span>
        <Image
          src="/Logos/NST-Absolute-Black.png"
          alt="NST"
          width={48}
          height={16}
          className="h-3.5 w-auto object-contain md:h-4"
        />
      </p>
    </footer>
  );
}
