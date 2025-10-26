import { FileIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./ui/dropzone";
import { useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { bytesToBundle, encryptBundle } from "@/sdk/models/bundle";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  price: z
    .string()
    .min(1, {
      message: "Product price is required",
    })
    .refine((x) => Number(x) > 0, {
      message: "Product price must be positive",
    }),
  previewImg: z.file(),
  content: z.file(),
});

export function AddProductDialog() {
  const [filePreview, setFilePreview] = useState<string | undefined>();

  const instance = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handlePreviewDrop = (files: File[]) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setFilePreview(e.target?.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.info("Creating an encypted bundle...");
    const task = async () => {
      const previewBuffer = await values.previewImg.arrayBuffer();
      const previewUrl = Buffer.from(previewBuffer).toString("base64");

      const contentBytes = await values.content.arrayBuffer();
      const bundle = await encryptBundle({
        bundle: bytesToBundle.encode(new Uint8Array(contentBytes)),
        seed: BigInt(0),
      });

      console.log({
        previewUrl,
        name: values.name,
        description: values.description,
        bundle,
      });
    };

    task()
      .then(() => toast.success("Product has been created!"))
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  }

  return (
    <Dialog>
      <Form {...instance}>
        <form onSubmit={instance.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <PlusIcon />
              <span>Add Product</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Add product</DialogTitle>
              {/* <DialogDescription>
                Make changes to  profile here. Click save when you&apos;re
                done.
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-4 justify-between">
                <FormField
                  control={instance.control}
                  name="previewImg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preview</FormLabel>
                      <FormControl>
                        <Dropzone
                          className="p-4 min-w-48"
                          maxFiles={1}
                          maxSize={1024 * 1024 * 10}
                          accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                          onDrop={(files) => {
                            field.onChange(files[0]);
                            handlePreviewDrop(files);
                          }}
                          src={[field.value]}
                          onError={(err) => {
                            instance.control.setError("previewImg", {
                              type: "value",
                              message: err.message,
                            });
                          }}
                        >
                          <DropzoneEmptyState hideCaption />
                          <DropzoneContent>
                            {filePreview && (
                              <AspectRatio
                                ratio={189 / 74}
                                className="bg-muted rounded-lg"
                              >
                                <img
                                  alt="Preview"
                                  className="h-full w-full rounded-lg object-cover"
                                  src={filePreview}
                                />
                              </AspectRatio>
                            )}
                          </DropzoneContent>
                        </Dropzone>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <FormField
                    control={instance.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My product" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={instance.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (PYUSD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="$10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={instance.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type product's description here."
                        className="h-48"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={instance.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Dropzone
                        className="p-4 min-w-48"
                        maxFiles={1}
                        maxSize={1024 * 1024 * 10}
                        onDrop={(files) => {
                          field.onChange(files[0]);
                        }}
                        src={[field.value]}
                        onError={(err) => {
                          instance.control.setError("content", {
                            type: "value",
                            message: err.message,
                          });
                        }}
                      >
                        <DropzoneEmptyState />
                        <DropzoneContent>
                          {field.value && (
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <FileIcon size={16} />
                              </div>
                              <p className="my-2 w-full text-wrap truncate font-medium text-sm">
                                {field.value.name}
                              </p>
                              <p className="w-full text-wrap text-muted-foreground text-xs">
                                Drag and drop or click to replace
                              </p>
                            </div>
                          )}
                        </DropzoneContent>
                      </Dropzone>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={instance.handleSubmit(onSubmit)}>
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
