"use client";

import { useLayoutEffect, useRef, useState } from "react";

import ImageMapper from "react-img-mapper";

function WorkspaceMap() {
  const [width, setWidth] = useState<number>(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
    window.addEventListener("resize", (event) => {
      event.preventDefault();

      // @ts-ignore
      setWidth(ref?.current?.offsetWidth);
    });
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      <ImageMapper
        responsive={true}
        parentWidth={width!}
        natural={true}
        src={
          "https://utfs.io/f/c997ef4c-61f8-4e66-b3b2-7e0d218545f3-cb3i5r.jpg"
        }
        onImageClick={() => {}}
        onClick={(e) => {}}
        map={{
          name: "desk-map",
          areas: [],
        }}
      />
    </div>
  );
}

export default WorkspaceMap;
