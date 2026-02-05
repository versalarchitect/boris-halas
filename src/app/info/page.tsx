import Image from "next/image";

export default function InfoPage() {
  return (
    <div className="flex h-full flex-col items-center justify-start overflow-y-auto px-4 py-8 md:flex-row md:items-center md:justify-center md:gap-12 md:px-8 md:py-12">
      {/* Bio Photo */}
      <div className="relative mb-6 aspect-square w-full max-w-[200px] flex-shrink-0 md:mb-0 md:max-w-sm md:w-1/3">
        <Image
          src="/boris.jpg"
          alt="Boris Halas"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 200px, 384px"
          priority
        />
      </div>

      {/* Bio Text */}
      <div className="max-w-md text-center md:text-left">
        <div className="space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider">Contact</h2>
            <a
              href="mailto:borishalasphoto@gmail.com"
              className="text-foreground transition-colors hover:text-muted-foreground"
            >
              borishalasphoto@gmail.com
            </a>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider">Follow</h2>
            <a
              href="https://www.instagram.com/borishalas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-muted-foreground"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
