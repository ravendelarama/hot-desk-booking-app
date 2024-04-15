import { ScrollArea } from "@radix-ui/react-scroll-area";
import OfficeArea from "./OfficeArea";

function OfficeAreaList() {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-start items-center">
      <OfficeArea />
      <OfficeArea />
      <OfficeArea />
      <OfficeArea />
      <OfficeArea />
      <OfficeArea />
      <OfficeArea />
      <OfficeArea />
    </div>
  );
}

export default OfficeAreaList;
