"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "./question";

function Faq() {
  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">FAQs</h1>
      <Accordion type="single" collapsible>
        {faq.map((item, idx) => (
          <AccordionItem value={idx.toString()} key={idx}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent className="text-slate-700 font-semibold dark:text-slate-500 text-sm">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default Faq;
