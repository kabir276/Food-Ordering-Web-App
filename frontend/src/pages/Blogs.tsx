import Navigation from "@/components/navigation";
import { useState } from "react";
import { DefaultSerializer } from "v8"

const Blogs = () => {
  const [active, setActive] = useState(1)
  return (
    <>

      <Navigation active={active} setActive={setActive} />
      <h1>Blogs Page</h1>
    </>
  )
}
export default Blogs;