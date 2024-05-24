import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useForm } from "react-hook-form";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "@uploadthing/react/hooks";

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
import { useUploadThing } from "@/utils/uploadthing";
import { HiOutlineUpload } from "react-icons/hi";

export const NewDeskSchema = z.object({
  floor: z.string(),
  name: z.string(),
});

function AddDesk({
  setAddDeskActive,
}: {
  setAddDeskActive: Dispatch<SetStateAction<boolean>>;
}) {
  const { floors } = useFloors("");
  const [coordinates, setCoordinates] = useState<string[]>([]);
  const [areaIndex, setAreaIndex] = useState<number>(0);
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      const src = res[0].url.split("/");
      setImage(src[src.length - 1]);

      // await add(name, src[src.length - 1]);
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: () => {
      alert("upload has begun");
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

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
        image,
        values.floor, //
        values.name,
        coordinates[0]!,
        coordinates[1]!,
        amenities!
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
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
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
            {files.length > 0 && files[0].name ? (
              <div className="w-full py-10 flex justify-center items-center">
                <Button
                  variant={"default"}
                  onClick={() => {
                    startUpload(files);
                  }}
                >
                  Upload {files[0].name}
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="mt-2 flex justify-center items-center p-10 border border-dashed border-[#53BDFF] rounded-md w-full"
              >
                <input {...getInputProps()} />
                <div className="w-full flex flex-col justify-center items-center gap-3">
                  <h3 className="text-2xl font-bold">
                    <HiOutlineUpload className="h-12 w-12 text-[#53BDFF] text-center" />
                  </h3>
                  <h4 className="text-center text-sm">Drop files here!</h4>
                  <p>{files.length > 0 && files[0].name}</p>
                </div>
              </div>
            )}
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
          <TabsContent value="amenities" className="space-y-2">
            <h3 className="text-lg font-semibold">Amenities</h3>
            <p className="text-sm text-ghost">
              Type the desk amenities separated by comma.
            </p>

            <Input
              placeholder="item1, item2, item3..."
              onChange={(e) => {
                if (e.target.value.length > 0) {
                  setAmenities(e.target.value.split(","));
                }
              }}
            />
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
