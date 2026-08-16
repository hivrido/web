export default function FixedColumn() {
  return (
    <div className="fixed-column">
      {/* Frame fijo: primer paint instantáneo y fallback con reduced-motion */}
      <div
        className="bg-still"
        style={{ backgroundImage: "url('/images/bg/animacion-poster.jpg')" }}
      />
      <video
        className="bg"
        src="/images/bg/animacion.mp4"
        poster="/images/bg/animacion-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="overlay" />
      <div className="col-accent-bar" />
      <div className="col-footer">
        <div className="col-footer-title">Nuestra Inspiración</div>
        <div className="col-footer-sub">Is the Future</div>
      </div>
    </div>
  );
}
