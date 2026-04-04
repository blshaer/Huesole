import { useEffect } from "react";

let logged = false;

const LumeGradients = () => {
  useEffect(() => {
    if (logged) return;
    logged = true;
    console.log(
      `%c
   __                      ______               ___              __ 
  / /   __  ______ ___  ___ / ____/________ _____/ (_)__  ____  / /_ _____
 / /   / / / / __ \`__ \\/ _ \\/ / __/ ___/ __ \`/ __  / / _ \\/ __ \\/ __/ ___/
/ /___/ /_/ / / / / / /  __/ /_/ / /  / /_/ / /_/ / /  __/ / / / /_(__  ) 
/_____/\\__,_/_/ /_/ /_/\\___/\\____/_/   \\__,_/\\__,_/_/\\___/_/ /_/\\__/____/ 
`,
      "color: #667eea; font-weight:bold; font-size: 8px;",
    );
  }, []);

  return null;
};

export default LumeGradients;
