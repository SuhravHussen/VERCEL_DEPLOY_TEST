import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RainbowButton } from "@/components/ui/RainbowButton";

export async function Hero() {
  return (
    <section className="relative w-full overflow-hidden mt-16">
      {/* Aurora Background Effect */}

      <div className="container mx-auto flex flex-col min-h-screen px-4 py-8 md:py-0">
        {/* Badge at top */}

        {/* Main content grid */}
        <div className="grid flex-1 grid-cols-1 items-center gap-4 text-center md:grid-cols-2 md:text-left">
          {/* Text Content */}
          <div className="flex flex-col items-center md:items-start md:ml-12">
            <div className="flex justify-start mb-0">
              <AnimatedShinyText className="inline-flex items-center justify-center px-3 py-1 text-sm transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 sm:text-base md:text-lg text-center">
                <span className="text-balance">
                  ✨ Custom Tests for Individuals & Institutions
                </span>
              </AnimatedShinyText>
            </div>
            <h1 className="font-primary text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Master languages
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {" "}
                with real test
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl md:text-2xl text-balance">
              Master languages with real test questions
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <RainbowButton size="xl" className="rounded-full">
                <span>Book Exam</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </RainbowButton>
              <RainbowButton
                variant="outline"
                size="xl"
                className="rounded-full"
              >
                <span>Take Exam</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </RainbowButton>
            </div>
          </div>

          {/* Image for Desktop */}
          <div className="relative hidden h-full w-full [perspective:1500px] md:block ">
            <div className="absolute top-1/2 left-0 -z-10 h-3/4 w-full -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="animate-float absolute -top-1/4 right-0 h-[150%] w-auto">
              <Image
                src="/images/home-laptop.png"
                alt="Phone screens showing app interface"
                className="h-full w-full object-contain "
                width={1200}
                height={600}
                priority
              />
            </div>
          </div>

          {/* Image for Mobile */}
          <div className="relative w-full max-w-4xl [perspective:1500px] md:hidden">
            <div className="absolute top-1/2 left-1/2 -z-10 h-3/4 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="animate-float">
              <Image
                src="/images/home-phone.png"
                alt="Phone screens showing app interface"
                className="w-full scale-150 mt-12 object-contain"
                width={1200}
                height={600}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
