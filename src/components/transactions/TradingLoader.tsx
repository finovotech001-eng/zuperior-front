const TradingLoader = () => (
  <svg
    className="mx-auto w-12 h-12 text-purple-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="14" width="2" height="5" fill="currentColor">
      <animate
        attributeName="height"
        values="5;14;5"
        dur="1.2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        values="14;5;14"
        dur="1.2s"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="8" y="10" width="2" height="9" fill="currentColor">
      <animate
        attributeName="height"
        values="9;18;9"
        dur="1.2s"
        begin="0.2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        values="10;1;10"
        dur="1.2s"
        begin="0.2s"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="13" y="6" width="2" height="13" fill="currentColor">
      <animate
        attributeName="height"
        values="13;22;13"
        dur="1.2s"
        begin="0.4s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        values="6;-3;6"
        dur="1.2s"
        begin="0.4s"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="18" y="10" width="2" height="9" fill="currentColor">
      <animate
        attributeName="height"
        values="9;18;9"
        dur="1.2s"
        begin="0.6s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        values="10;1;10"
        dur="1.2s"
        begin="0.6s"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
);
export default TradingLoader;
