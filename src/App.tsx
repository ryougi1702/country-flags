import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MainMap from "./components/MainMap";

function App() {
  const [count, setCount] = useState(0);

  // const TestComponent = () => {
  //   const elRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if (!elRef.current) return;
  //   const tooltipOverlay = new Overlay({
  //     element: elRef.current,
  //     offset: [10, 0],
  //     positioning: "bottom-left",
  //     stopEvent: false,
  //   });

  //   }, [elRef]);
  // };
  return (
    <>
      <section>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </section>
      <MainMap />
    </>
  );
}

export default App;
