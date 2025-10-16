import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-16">
      <div className="container mx-auto px-12 py-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/TipUp-large-logo.png"
                alt="TipUp Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-semibold tracking-tight">TipUp</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              A universal tipping experience with real-time Push notifications.
              Powered by Push Chain and Push Wallet.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/tip/universal"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Universal Tipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://push.org"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Push Website
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.push.org"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com/pushprotocol"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/push-protocol"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Background Image */}
        <div className="mt-12 pt-8 border-t border-border">
          {/* Credits Above Image */}
          <div className="flex flex-col md:flex-row items-center justify-center py-4">
            <p className="text-base md:text-lg font-semibold text-foreground">
              © 2025 TipUp. Built on Push Chain
            </p>
          </div>

          {/* Image Container with 10% bottom trim - No bottom spacing */}
          <div className="relative overflow-hidden min-h-[360px] md:min-h-[450px] -mb-8">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                backgroundImage:
                  "url(/Gemini_Generated_Image_8otyk28otyk28oty.png)",
                backgroundSize: "contain",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
                clipPath: "inset(0 0 10% 0)",
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
