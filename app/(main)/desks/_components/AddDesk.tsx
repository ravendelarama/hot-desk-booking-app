import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addDesk } from "@/actions/desk";
import { useToast } from "@/components/ui/use-toast";
import useFloors from "@/hooks/useFloors";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateDeskMap from "@/components/CreateDeskMap";

export const NewDeskSchema = z.object({
  floor: z.string(),
  name: z.string(),
});

function AddDesk({
  setAddDeskActive,
}: {
  setAddDeskActive: Dispatch<SetStateAction<boolean>>;
}) {
  const { floors } = useFloors();
  const [coordinates, setCoordinates] = useState<string[]>([]);
  const [areaIndex, setAreaIndex] = useState<number>(0);
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  const form = useForm<z.infer<typeof NewDeskSchema>>({
    resolver: zodResolver(NewDeskSchema),
    defaultValues: {
      floor: "",
      name: "",
    },
  });

  useEffect(() => {
    setSelectedFloor(form.getValues("floor"));
  }, [form.getValues("floor")]);

  const { toast } = useToast();

  async function onSelect(x: string, y: string) {
    setCoordinates([x, y]);

    toast({
      title: "Created Desk",
      // @ts-ignore
      description: `Desk: ${coordinates[0]!} ${coordinates[1]!}`,
    });
  }

  async function onSubmit(values: z.infer<typeof NewDeskSchema>) {
    if (coordinates.length > 0) {
      await addDesk(
        values.floor, //
        values.name,
        coordinates[0]!,
        coordinates[1]!
        // amenities: [""]
      );
    }
    toast({
      title: "Created Desk",
      // @ts-ignore
      description: `Desk ${values.name}: ${coordinates[0]!} ${coordinates[1]!}`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="">
            <TabsTrigger value="account">Information</TabsTrigger>
            <TabsTrigger value="password">Office Area Map</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Floors</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value!}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="floors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Floors</SelectLabel>
                          {floors?.map((item, index) => (
                            <SelectItem
                              onClick={() => {
                                setAreaIndex(index);
                              }}
                              key={item.id!}
                              value={item.id!}
                            >
                              {item.floor}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desk Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Desk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Input placeholder="Desk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </TabsContent>
          <TabsContent value="password" className="w-full">
            {floors ? (
              <CreateDeskMap
                key={selectedFloor!}
                floorId={selectedFloor!}
                floor={floors[areaIndex!].floor!}
                onSelect={onSelect}
              />
            ) : null}
          </TabsContent>
        </Tabs>

        <div className="flex flex-col md:flex-row justify-end gap-5 item-center">
          <Button
            onClick={() => {
              setAddDeskActive(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant={"success"}
            type="submit"
            // @ts-ignore
            disabled={coordinates.length == 0}
          >
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddDesk;
