export default function Skeleton({
  count = 1,
  width = "100%",
  height = "20px"
}) {
  const items = Array.from({ length: count });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {items.map((_, index) => (
        <div
          key={index}
          style={{
            width,
            height,
            borderRadius: "8px",
            background:
              "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%)",
            backgroundSize: "400% 100%",
            animation: "summarist-skeleton 1.4s ease infinite"
          }}
        />
      ))}
      <style>
        {`
          @keyframes summarist-skeleton {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}
      </style>
    </div>
  );
}
