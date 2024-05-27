import Navigation from "@/components/navigation";
import { useState } from "react";

const AboutUs=()=>{
  const [active, setActive] = useState(1)
    return (
        <>
         <Navigation active={active} setActive={setActive} />
          <h1>AboutUs Page</h1>
        </>
      )
}

export default AboutUs;