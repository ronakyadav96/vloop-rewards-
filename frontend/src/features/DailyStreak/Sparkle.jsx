// Four-point sparkle used for all decorative glints so they share one shape.
function Sparkle({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 0c.9 6.2 5.8 11.1 12 12-6.2.9-11.1 5.8-12 12-.9-6.2-5.8-11.1-12-12C6.2 11.1 11.1 6.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default Sparkle;
