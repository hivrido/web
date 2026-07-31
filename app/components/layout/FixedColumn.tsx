export default function FixedColumn() {
  return (
    <div className="fixed-column">
      <div
        className="bg"
        style={{ backgroundImage: "url('/images/bg/17.jpg')" }}
      />
      <div className="overlay" />
      <div className="col-accent-bar" />
      <div className="col-footer">
        <div className="col-footer-title">Nuestra Inspiración</div>
        <div className="col-footer-sub">Arte · Cultura · Tecnología</div>
      </div>
    </div>
  );
}
