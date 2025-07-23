export function Footer() {
  return (
    <footer className="bg-earth-light/20 border-t-2 border-earth/30 py-3 ec-pattern-aloe">
      <div className="container max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1 mb-1">
          <span>🌿</span>
          <p className="text-earth">© 2024 Nothobile - Eastern Cape, South Africa</p>
          <span>🏔️</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-nature">
          <span>🌱 Natural</span>
          <span>•</span>
          <span>🍃 Organic</span>
          <span>•</span>
          <span>⚕️ Traditional</span>
        </div>
        <p className="mt-1 text-[10px] opacity-75">Ubuntu - &ldquo;I am because we are&rdquo;</p>
      </div>
    </footer>
  );
}