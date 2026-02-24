
import { useEffect } from "react";
function App() {

  useEffect(() => {
    async function callBackend() {
      //This is an example of how we can call the backend from the frontend. 
      // We will replace this with actual calls to the backend later on in the files where they are necessary
      try {
        const res = await fetch("http://localhost:38451/hello");
        const text = await res.text();
        console.log(text);
      } catch (err) {
        console.error("Backend not reachable:", err);
      }
    }

    callBackend();
  }, []);

  return <></>;
}

export default App;