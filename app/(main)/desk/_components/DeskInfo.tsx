"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function DeskInfo() {
  return (
    <>
      <Card className="w-full lg:w-[60%] h-fit">
        <CardHeader>
          <CardTitle>Office Desk C6</CardTitle>
          <CardDescription>Available</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4>Office area: A1</h4>
            <p>Reservation: April 16, 2024</p>
            <p>Availability: April 17, 2024</p>
          </div>
          <Separator orientation="horizontal" />

          <h4 className="text-sm font-semibold">Amenities</h4>
          <div className="flex justify-start items-center gap-2 flex-wrap">
            <Badge variant="secondary">Massager</Badge>
            <Badge variant="secondary">Desk lamp</Badge>
            <Badge variant="secondary">Whiteboard</Badge>
            <Badge variant="secondary">Natural lighting</Badge>
            <Badge variant="secondary">Quiet</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <p></p>
        </CardFooter>
      </Card>
    </>
  );
}

export default DeskInfo;
