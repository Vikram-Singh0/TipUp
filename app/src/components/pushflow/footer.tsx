import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-16">
      <div className="container mx-auto px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div
                className="size-8 rounded-md bg-[var(--push-pink-500)]"
                aria-hidden
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

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 TipUp. Built on Push Chain
          </p>
        </div>
      </div>
    </footer>
  );
}
