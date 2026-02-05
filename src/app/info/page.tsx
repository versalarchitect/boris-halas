import Image from "next/image";

export default function InfoPage() {
  return (
    <div className="flex h-full flex-col items-center justify-start overflow-y-auto px-4 py-8 md:flex-row md:items-center md:justify-center md:gap-12 md:px-8 md:py-12">
      {/* Bio Photo */}
      <div className="relative mb-6 aspect-[3/4] w-full max-w-[200px] flex-shrink-0 md:mb-0 md:max-w-sm md:w-1/3">
        <Image
          src="/bio.jpg"
          alt="Boris Halas"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
      </div>

      {/* Bio Text */}
      <div className="max-w-md text-center md:text-left">
        <p className="mb-6 text-sm leading-relaxed text-foreground md:mb-8 md:text-base">
          Boris Halas is a Montréal-born photographer shooting predominantly on
          analogue, who specializes mostly in portrait, music, fashion and street
          photography. He has been documenting nightlife and culture in different
          landmark cities such as Paris, Tokyo, LA, NYC and London to name a few.
          Boris aims to create deep-rooted moments and visual experiences through
          intimate portraits he captures.
        </p>

        <div className="space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider">Contact</h2>
            <a
              href="mailto:hello@borishalas.com"
              className="text-foreground transition-colors hover:text-muted-foreground"
            >
              hello@borishalas.com
            </a>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider">Follow</h2>
            <div className="flex justify-center gap-4 md:justify-start">
              <a
                href="https://www.instagram.com/borishalas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-muted-foreground"
              >
                Instagram
              </a>
              <a
                href="https://vimeo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-muted-foreground"
              >
                Vimeo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
