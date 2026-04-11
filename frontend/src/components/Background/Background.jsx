import "./Background.css";

export default function Background() {
  return (
    <>
      <div className="bg-fixed" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
    </>
  );
}